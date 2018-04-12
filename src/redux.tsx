import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { userTokenReducer } from './_common/login/redux_login';
import { UserToken } from './_common/login/user-private/gen';
import { errorMessageReducer } from './_common/redux_error';
import { TextTimestamp } from './_common/TimedText';
import { TodoItemGroup } from './api/todo-private/gen';
import {
    friendsListReducer, FriendsListWithPage, friendTodoListByCategoryMapReducer,
    todoListByCategoryReducer
} from './redux_todo';

export interface RootState {
    userToken: UserToken;
    errorMessage: TextTimestamp;
    friendsListWithPage: FriendsListWithPage;
    todoListByCategory: TodoItemGroup[];
    friendTodoListByCategoryMap: Map<string, TodoItemGroup[]>;
}

export const rootReducer = combineReducers<RootState>({
    userToken: userTokenReducer,
    errorMessage: errorMessageReducer,
    friendsListWithPage: friendsListReducer,
    todoListByCategory: todoListByCategoryReducer,
    friendTodoListByCategoryMap: friendTodoListByCategoryMapReducer
});
