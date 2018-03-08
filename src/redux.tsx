import { combineReducers } from 'redux';
import { StandardAction } from './_common/action';

const hello = (state: string= '', action: StandardAction): string => {
    return state;
};

export const rootReducer = combineReducers({
    hello
});
