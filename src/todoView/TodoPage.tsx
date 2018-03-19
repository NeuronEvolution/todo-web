import { List, ListItem } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { User } from '../_common/login/redux_login';
import TimedComponent from '../_common/TimedComponent';
import { TextTimestamp } from '../_common/TimedText';
import {
    FriendInfo, getFriendsListParams, getTodoListParams, TodoItem, TodoItemGroup,
    TodoStatus
} from '../api/todo-private/gen';
import { RootState } from '../redux';
import { apiTodoGetFriendsList, apiTodoGetTodoListByCategory, FriendsListWithPage } from '../redux_todo';

export interface Props {
    user: User;
    errorMessage: TextTimestamp;
    friendsListWithPage: FriendsListWithPage;
    friendTodoListByCategory: TodoItemGroup[];
    apiTodoGetFriendsList: (p: getFriendsListParams) => Dispatchable;
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
}

interface State {
    friendInfoSelected: FriendInfo | null;
    itemGroupSelected: TodoItemGroup | null;
}

class TodoPage extends React.Component<Props, State> {
    private static getTodoStatusName(p: TodoStatus): string {
        switch (p) {
            case TodoStatus.Ongoing:
                return '进行中';
            case TodoStatus.Completed:
                return '已完成';
            case TodoStatus.Discard:
                return '已放弃';
            default:
                return '未知的';
        }
    }

    private static getTodoStatusTextColor(p: TodoStatus): string {
        switch (p) {
            case TodoStatus.Ongoing:
                return '#777';
            case TodoStatus.Completed:
                return '#ccc';
            case TodoStatus.Discard:
                return '#ccc';
            default:
                return '#444';
        }
    }

    private static renderHeader() {
        return (
            <div style={{
                display: 'flex',
                width: '100%',
                height: '48px',
                backgroundColor: '#444',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <label style={{color: '#FFF', fontSize: '200%'}}>
                    @&nbsp;火&nbsp;&nbsp;星&nbsp;&nbsp;计&nbsp;&nbsp;划
                </label>
            </div>
        );
    }

    private static renderTodoItem(todoItem: TodoItem) {
        const statusColor = TodoPage.getTodoStatusTextColor(todoItem.status);

        return (
            <ListItem
                key={todoItem.todoId}
                button={true}
                divider={true}
                style={{
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
            >
                <label style={{color: '#444', fontSize: '14px'}}>
                    {todoItem.title}
                </label>
                <label style={{fontSize: '12px', color: statusColor}}>
                    {TodoPage.getTodoStatusName(todoItem.status)}
                </label>
            </ListItem>
        );
    }

    private static renderGlobalToastContent(text: string) {
        return (
            <div style={{backgroundColor: '#444', padding: '12px', borderRadius: '8px'}}>
                <label style={{fontSize: '125%', color: '#fff'}}>{text}</label>
            </div>
        );
    }

    public componentWillMount() {
        this.renderFriendListItem = this.renderFriendListItem.bind(this);
        this.renderFriendListItem = this.renderFriendListItem.bind(this);
        this.renderTodoItemCategory = this.renderTodoItemCategory.bind(this);
        this.renderTodoList = this.renderTodoList.bind(this);

        this.setState({
            friendInfoSelected: null,
            itemGroupSelected: null
        });

        this.refreshFriendList();
    }

    public render() {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                {TodoPage.renderHeader()}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'row'
                }}>
                    {this.renderFriendList()}
                    {this.renderCategoryList()}
                    {this.renderTodoList()}
                </div>
                {this.renderGlobalToast()}
            </div>
        );
    }

    private renderGlobalToast() {
        const {text, timestamp} = this.props.errorMessage;
        const visible = text != null && text !== '';

        return (
            <div style={{
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%'
            }}>
                <TimedComponent
                    contentElement={TodoPage.renderGlobalToastContent(text)}
                    timestamp={timestamp}
                    intervalMillSec={5000}
                    visible={visible}/>
            </div>
        );
    }

    private refreshFriendList() {
        this.props.apiTodoGetFriendsList({pageToken: '', pageSize: 40});
    }

    private renderFriendList() {
        const {items} = this.props.friendsListWithPage;

        return (
            <List style={{width: '300px'}}>
                {items && items.map(this.renderFriendListItem)}
            </List>
        );
    }

    private renderFriendListItem(friendInfo: FriendInfo) {
        const selectedFriendID = this.state.friendInfoSelected && this.state.friendInfoSelected.userID;
        const friendId = friendInfo.userID;
        const selected = friendId === selectedFriendID;

        return (
            <ListItem
                key={friendInfo.userID}
                button={true}
                divider={true}
                style={{
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                onClick={() => {
                    this.onFriendItemClick(friendInfo);
                }}
            >
                <label style={{color: '#444', fontSize: '14px'}}>
                    {friendInfo.userName}
                </label>
                <label style={{color: '#aaa'}}>
                    {selected ? '-' : ''}
                </label>
            </ListItem>
        );
    }

    private onFriendItemClick(friendInfo: FriendInfo) {
        this.setState({
            friendInfoSelected: friendInfo,
            itemGroupSelected: null
        });

        this.refreshFriendList();
        this.props.apiTodoGetTodoListByCategory({friendID: friendInfo.userID});
    }

    private renderCategoryList() {
        if (!this.state.friendInfoSelected) {
            return null;
        }

        const items = this.props.friendTodoListByCategory;
        if (!items || items.length === 0) {
            return null;
        }

        return (
            <List style={{width: '300px', marginLeft: '48px'}}>
                {items.map(this.renderTodoItemCategory)}
            </List>
        );
    }

    private renderTodoItemCategory(itemGroup: TodoItemGroup) {
        const selected = this.state.itemGroupSelected === itemGroup;

        return (
            <ListItem
                key={itemGroup.category}
                button={true}
                divider={true}
                style={{
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                onClick={() => {
                    this.onCategoryClick(itemGroup);
                }}
            >
                <label style={{color: '#444', fontSize: '14px'}}>
                    {itemGroup.category}
                </label>
                <label style={{color: '#aaa'}}>
                    {selected ? '-' : ''}
                </label>
            </ListItem>
        );
    }

    private onCategoryClick(itemGroup: TodoItemGroup) {
        this.setState({
            itemGroupSelected: itemGroup
        });
    }

    private renderTodoList() {
        const itemGroup = this.state.itemGroupSelected;
        if (!itemGroup) {
            return null;
        }

        const items = itemGroup.todoItemList;
        if (!items || items.length === 0) {
            return null;
        }

        return (
            <List style={{width: '360px', marginLeft: '48px'}}>
                {items.map(TodoPage.renderTodoItem)}
            </List>
        );
    }
}

const selectProps = (rootState: RootState) => ({
    user: rootState.user,
    errorMessage: rootState.errorMessage,
    friendsListWithPage: rootState.friendsListWithPage,
    friendTodoListByCategory: rootState.friendTodoListByCategory
});

export default connect(selectProps, {
    apiTodoGetFriendsList,
    apiTodoGetTodoListByCategory
})(TodoPage);
