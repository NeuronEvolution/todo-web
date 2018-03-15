import { Dispatchable, StandardAction } from './action';
import { TextTimestamp } from './TimedText';

const ACTION_ERROR_MESSAGE = 'ACTION_ERROR_MESSAGE';
export const onErrorMessage = (text: string): Dispatchable => (dispatch) => {
    return dispatch({type: ACTION_ERROR_MESSAGE, payload: {text, timestamp: new Date()}});
};

export const onApiError = (err: any, message: string): Dispatchable => (dispatch) => {
    const status = err && err.status ? err.status : 0;
    if (status === 401) {
        return; // skip Unauthorized error
    }

    const errString = err.toString();
    const text = (errString === 'TypeError: Network request failed' || errString === 'TypeError: Failed to fetch') ?
        '网络连接失败' + (message ? ':' : '') + message : (err.message ? err.message : err.toString());

    dispatch(onErrorMessage(text));
};

const initErrorMessage: TextTimestamp = {text: '', timestamp: new Date()};
export const errorMessageReducer = (state: TextTimestamp= initErrorMessage,
                                    action: StandardAction): TextTimestamp => {
    switch (action.type) {
        case ACTION_ERROR_MESSAGE:
            return action.payload;
        default:
            return state;
    }
};