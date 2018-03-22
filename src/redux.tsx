import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { User, userReducer } from './_common/login/redux_login';
import { errorMessageReducer } from './_common/redux_error';
import { TextTimestamp } from './_common/TimedText';
import { TodoItemGroup } from './api/todo-private/gen';
import {
    friendsListReducer, FriendsListWithPage, friendTodoListByCategoryMapReducer,
    todoListByCategoryReducer
} from './redux_todo';

export interface RootState {
    user: User;
    errorMessage: TextTimestamp;
    friendsListWithPage: FriendsListWithPage;
    todoListByCategory: TodoItemGroup[];
    friendTodoListByCategoryMap: Map<string, TodoItemGroup[]>;
}

export const rootReducer = combineReducers<RootState>({
    user: userReducer,
    errorMessage: errorMessageReducer,
    friendsListWithPage: friendsListReducer,
    todoListByCategory: todoListByCategoryReducer,
    friendTodoListByCategoryMap: friendTodoListByCategoryMapReducer
});
