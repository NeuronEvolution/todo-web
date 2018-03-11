import { combineReducers } from 'redux';
import { User, userReducer } from './_common/login/redux_login';
import { errorMessageReducer } from './_common/redux_error';
import { TextTimestamp } from './_common/TimedText';

export interface RootState {
    user: User;
    errorMessage: TextTimestamp;
}

export const rootReducer = combineReducers<RootState>({
    user: userReducer,
    errorMessage: errorMessageReducer
});
