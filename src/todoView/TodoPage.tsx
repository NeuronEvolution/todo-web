import { Map } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { UserToken } from '../_common/login/user-private/gen';
import TimedComponent from '../_common/TimedComponent';
import { TextTimestamp } from '../_common/TimedText';
import {
    FriendInfo, getFriendsListParams, getTodoListParams, TodoItem, TodoItemGroup,
    TodoStatus, TodoVisibility
} from '../api/todo-private/gen';
import { RootState } from '../redux';
import { apiTodoGetFriendsList, apiTodoGetTodoListByCategory, FriendsListWithPage } from '../redux_todo';

const androidDownloadImage = require('../images/android_download_qr.png');

export interface Props {
    userToken: UserToken;
    errorMessage: TextTimestamp;
    friendsListWithPage: FriendsListWithPage;
    friendTodoListByCategoryMap: Map<string, TodoItemGroup[]>;
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
                return '#FF8800';
            case TodoStatus.Completed:
                return '#ccc';
            case TodoStatus.Discard:
                return '#ccc';
            default:
                return '#444';
        }
    }

    private static getTodoVisibilityName(p?: TodoVisibility): string {
        switch (p) {
            case TodoVisibility.Private:
                return '保密的';
            case TodoVisibility.Friend:
                return '仅朋友可见';
            case TodoVisibility.Public:
                return '公开的';
            default:
                return '未知的';
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
                <label style={{color: '#FF8800', fontSize: '32px'}}>
                    @&nbsp;火&nbsp;&nbsp;星&nbsp;&nbsp;计&nbsp;&nbsp;划
                </label>
            </div>
        );
    }

    private static renderDownloadContainer() {
        return (
            <div style={{
                width: '100%',
                maxWidth: '360px',
                display: 'flex',
                flexDirection: 'row',
                marginTop: '48px'
            }}>
                <div
                    style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    <img
                        style={{width: '90%', height: 'calc(width)'}}
                        src={androidDownloadImage}/>
                    <label style={{fontSize: '14px', color: '#888888'}}>安卓版</label>
                </div>
                <div
                    style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    <img
                        style={{width: '90%', height: 'calc(width)'}}
                        src={androidDownloadImage}/>
                    <label style={{fontSize: '14px', color: '#888888'}}>苹果版(敬请期待)</label>
                </div>
            </div>
        );
    }

    private static renderTodoList(itemGroup: TodoItemGroup) {
        const items = itemGroup.todoItemList;
        if (!items || items.length === 0) {
            return null;
        }

        return (
            <div style={{width: '100%'}}>
                {items.map(TodoPage.renderTodoItem)}
            </div>
        );
    }

    private static renderTodoItem(todoItem: TodoItem) {
        const statusColor = TodoPage.getTodoStatusTextColor(todoItem.status);

        return (
            <div
                key={todoItem.todoId}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        height: '36px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <label style={{color: '#008888', fontSize: '14px', marginLeft: '4%'}}>
                        {todoItem.title}
                    </label>
                    <label style={{marginRight: '4%', fontSize: '12px', color: statusColor}}>
                        {TodoPage.getTodoStatusName(todoItem.status)}
                    </label>
                </div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#F8F8F8'}}/>
            </div>
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

        this.setState({
            friendInfoSelected: null,
            itemGroupSelected: null
        });

        this.refreshFriendList();
    }

    public render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}>
                {TodoPage.renderHeader()}
                {TodoPage.renderDownloadContainer()}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '12px'
                }}>
                    <label style={{fontSize: '14px', color: '#888'}}>网页版仅提供浏览功能</label>
                </div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#eee', marginTop: '12px'}}/>
                {this.renderFriendList()}
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
                    intervalMillSec={2000}
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
            <div style={{width: '100%', maxWidth: '480px'}}>
                {items && items.map(this.renderFriendListItem)}
            </div>
        );
    }

    private renderFriendListItem(friendInfo: FriendInfo) {
        const selectedFriendID = this.state.friendInfoSelected && this.state.friendInfoSelected.userID;
        const friendId = friendInfo.userID;
        const selected = friendId === selectedFriendID;

        return (
            <div
                key={friendInfo.userID}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                {this.renderFriendItemHead(friendInfo)}
                {!selected && <div style={{height: '1px', width: '100%', backgroundColor: '#eee'}}/>}
                {selected && this.renderCategoryList()}
            </div>
        );
    }

    private renderFriendItemHead(friendInfo: FriendInfo) {
        return (
            <div
                style={{
                    width: '92%',
                    maxWidth: '360px',
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onClick={() => {
                    this.onFriendItemClick(friendInfo);
                }}
            >
                <label style={{color: '#008888', fontSize: '14px'}}>
                    {friendInfo.userName}
                </label>
                <div style={{width: 120}}>
                    <div style={{
                        height: '24px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <label style={{color: '#888', fontSize: '12px'}}>总计划数：</label>
                        <label style={{color: '#FF8800', fontSize: '12px'}}>{friendInfo.todoCount}</label>
                    </div>
                    <div style={{
                        height: '24px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <label style={{color: '#888', fontSize: '12px'}}>是否公开：</label>
                        <label style={{color: '#FF8800', fontSize: '12px'}}>
                            {TodoPage.getTodoVisibilityName(friendInfo.todoVisibility)}
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    private onFriendItemClick(friendInfo: FriendInfo) {
        const {friendInfoSelected} = this.state;
        if (!friendInfoSelected || friendInfoSelected.userID !== friendInfo.userID) {
            this.setState({
                friendInfoSelected: friendInfo,
                itemGroupSelected: null
            });

            this.props.apiTodoGetTodoListByCategory({friendID: friendInfo.userID});
        } else {
            this.setState({
                friendInfoSelected: null,
                itemGroupSelected: null
            });
        }

        this.refreshFriendList();
    }

    private renderCategoryList() {
        const {friendInfoSelected} = this.state;
        if (!friendInfoSelected) {
            return null;
        }

        const items = this.props.friendTodoListByCategoryMap.get(friendInfoSelected.userID);
        if (!items || items.length === 0) {
            return null;
        }

        return (
            <div style={{width: '100%'}}>
                {items.map(this.renderTodoItemCategory)}
            </div>
        );
    }

    private renderTodoItemCategory(itemGroup: TodoItemGroup) {
        return (
            <div
                key={itemGroup.category}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {this.renderCategoryHead(itemGroup)}
                {TodoPage.renderTodoList(itemGroup)}
            </div>
        );
    }

    private renderCategoryHead(itemGroup: TodoItemGroup) {
        return (
            <div
                style={{
                    height: '24px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#F8F8F8'
                }}
                onClick={() => {
                    this.onCategoryClick(itemGroup);
                }}
            >
                <label style={{color: '#FF8800', fontSize: '14px', marginLeft: '4%'}}>
                    {itemGroup.category}
                </label>
            </div>
        );
    }

    private onCategoryClick(itemGroup: TodoItemGroup) {
        this.setState({
            itemGroupSelected: itemGroup
        });
    }
}

const selectProps = (rootState: RootState) => ({
    userToken: rootState.userToken,
    errorMessage: rootState.errorMessage,
    friendsListWithPage: rootState.friendsListWithPage,
    friendTodoListByCategoryMap: rootState.friendTodoListByCategoryMap
});

export default connect(selectProps, {
    apiTodoGetFriendsList,
    apiTodoGetTodoListByCategory
})(TodoPage);
