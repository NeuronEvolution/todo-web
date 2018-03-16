import { Dispatchable, StandardAction } from './_common/action';
import { apiCall } from './_common/login/redux_login';
import {
    DefaultApiFactory as TodoPrivateApi, FriendInfo, getFriendsListParams, getTodoListParams, TodoItemGroup
} from './api/todo-private/gen';
import { HOST } from './ENV';
import { REDUX_STORE } from './index';

const todoPrivateApi = TodoPrivateApi(
    {apiKey: () => REDUX_STORE.getState().user.accessToken},
    fetch, HOST + '/api-private/v1/todo'
);

const ACTION_TODO_GET_FRIEND_LIST_SUCCESS = 'ACTION_TODO_GET_FRIEND_LIST_SUCCESS';
const ACTION_TODO_LIST_BY_CATEGORY_SUCCESS = 'ACTION_TODO_LIST_BY_CATEGORY_SUCCESS';
const ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS = 'ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS';

export interface FriendsListWithPage {
    pageToken: string;
    items: FriendInfo[];
    nextPageToken: string;
}

const initFriendsList = {pageToken: '', items: [], nextPageToken: ''};
export const friendsListReducer = (
    state: FriendsListWithPage= initFriendsList, action: StandardAction): FriendsListWithPage => {
    switch (action.type) {
        case ACTION_TODO_GET_FRIEND_LIST_SUCCESS:
            const oldItems = state.items;
            state = {
                pageToken: action.payload.pageToken,
                nextPageToken: action.payload.data.nextPageToken,
                items: []
            };

            action.payload.pageToken && action.payload.pageToken !== ''
                ? state.items = [...oldItems, ...action.payload.data.items]
                : state.items = action.payload.data.items;

            return state;
        default:
            return state;
    }
};

export const todoListByCategoryReducer = (state: TodoItemGroup[]= [], action: StandardAction): TodoItemGroup[] => {
    switch (action.type) {
        case ACTION_TODO_LIST_BY_CATEGORY_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export const friendTodoListByCategoryReducer
    = (state: TodoItemGroup[]= [], action: StandardAction): TodoItemGroup[] => {
    switch (action.type) {
        case ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export const apiTodoGetFriendsList = (p: getFriendsListParams): Dispatchable => (dispatch) => {
    return apiCall(REDUX_STORE, () => {
        return todoPrivateApi.getFriendsList(p.pageSize, p.pageToken).then((data) => {
            dispatch({
                type: ACTION_TODO_GET_FRIEND_LIST_SUCCESS,
                payload: {
                    pageToken: p.pageToken,
                    data
                }
            });
        });
    });
};

export const apiTodoGetTodoListByCategory = (p: getTodoListParams): Dispatchable => (dispatch) => {
    return apiCall(REDUX_STORE, () => {
        return todoPrivateApi.getTodoListByCategory(p.friendID).then((result: TodoItemGroup[]) => {
            if (p.friendID) {
                dispatch({type: ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS, payload: result});
            } else {
                dispatch({type: ACTION_TODO_LIST_BY_CATEGORY_SUCCESS, payload: result});
            }
        });
    });
};
