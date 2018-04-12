import { Store } from 'react-redux';
import { env } from '../../env';
import { Dispatchable, StandardAction } from '../action';
import { onApiError, onErrorMessage } from '../redux_error';
import {DefaultApiFactory as AccountPrivateApi, UserToken } from './user-private/gen';

const accountPrivateApiHost = env.host + '/api/v1/accounts';
const accountPrivateApi = AccountPrivateApi(undefined, fetch, accountPrivateApiHost);

const ACTION_LOGIN_SUCCESS = 'ACTION_LOGIN_SUCCESS';
const ACTION_USER_REFRESH_TOKEN = 'ACTION_USER_REFRESH_TOKEN';
const ACTION_USER_LOGOUT_SUCCESS = 'ACTION_USER_LOGOUT_SUCCESS';
const ACTION_REQUIRE_LOGIN = 'ACTION_REQUIRE_LOGIN';

const initUserToken: UserToken = {accessToken: '', refreshToken: ''};
export const userTokenReducer = (state: UserToken= initUserToken, action: StandardAction): UserToken => {
    switch (action.type) {
        case ACTION_LOGIN_SUCCESS:
            return action.payload;
        case ACTION_USER_REFRESH_TOKEN:
            return action.payload;
        case ACTION_REQUIRE_LOGIN:
            return initUserToken;
        case ACTION_USER_LOGOUT_SUCCESS:
            return initUserToken;
        default:
            return state;
    }
};

export const onLoginCallbackDispatch = (userToken: UserToken): Dispatchable => (dispatch) => {
    dispatch({type: ACTION_LOGIN_SUCCESS, payload: userToken});
};

export const apiUserLogout = (store: Store<{userToken: UserToken}>): Dispatchable => (dispatch) => {
    const {accessToken, refreshToken} = store.getState().userToken;
    return accountPrivateApi.logout(accessToken, refreshToken).then(() => {
        dispatch(onErrorMessage('您已退出登录'));
        dispatch({type: ACTION_USER_LOGOUT_SUCCESS});
    }).catch((err) => {
        dispatch(onApiError(err, accountPrivateApiHost + '/logout'));
    });
};

const isUnauthorizedError = (err: any): boolean => {
    const status = err && err.status;
    return status === 401;
};

const apiRefreshUserToken = (store: Store<{userToken: UserToken}>, refreshToken: string): Promise<void> => {
    return accountPrivateApi.refreshToken(refreshToken).then((data: UserToken) => {
        store.dispatch({type: ACTION_USER_REFRESH_TOKEN, payload: data});
    }).catch((err) => {
        store.dispatch(onApiError(err, accountPrivateApiHost + 'refreshToken'));
    });
};

export const apiCall = (store: Store<{userToken: UserToken}>, f: () => Promise<any>): void => {
    f().then(() => {
        console.log('progress end'); // todo 防止同时刷新
    }).catch((err) => {
        if (!isUnauthorizedError(err)) {
            store.dispatch(onApiError(err, ''));
            return null;
        }

        const {refreshToken} = store.getState().userToken;
        if (!refreshToken) {
            store.dispatch({type: ACTION_REQUIRE_LOGIN});
            return null;
        }

        return apiRefreshUserToken(store, refreshToken).then(() => {
            return f().catch((errAgain: any) => {
                if (!isUnauthorizedError(errAgain)) {
                    store.dispatch(onApiError(errAgain, ''));
                    return;
                }

                store.dispatch({type: ACTION_REQUIRE_LOGIN});
            });
        });
    });
};