import { combineReducers } from 'redux';
import { User, userReducer } from './_common/login/redux_login';
import { errorMessageReducer } from './_common/redux_error';
import { TextTimestamp } from './_common/TimedText';
import { TodoItemGroup } from './api/todo-private/gen';
import {
    friendsListReducer, FriendsListWithPage, friendTodoListByCategoryReducer,
    todoListByCategoryReducer
} from './redux_todo';

export interface RootState {
    user: User;
    errorMessage: TextTimestamp;
    friendsListWithPage: FriendsListWithPage;
    todoListByCategory: TodoItemGroup[];
    friendTodoListByCategory: TodoItemGroup[];
}

export const rootReducer = combineReducers<RootState>({
    user: userReducer,
    errorMessage: errorMessageReducer,
    friendsListWithPage: friendsListReducer,
    todoListByCategory: todoListByCategoryReducer,
    friendTodoListByCategory: friendTodoListByCategoryReducer
});
