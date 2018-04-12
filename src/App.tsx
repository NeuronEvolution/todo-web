import { Button } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import LoginFrame from './_common/login/LoginFrame';
import { UserToken } from './_common/login/user-private/gen';
import { env } from './env';
import { RootState } from './redux';
import TodoPage from './todoView/TodoPage';

const androidDownloadImage = require('./images/android_download_qr.png');

export interface Props {
    userToken: UserToken;
}

interface State {
    loginButtonClicked: boolean;
}

class App extends React.Component<Props, State> {
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

    public componentWillMount() {
        this.onLoginButtonClick = this.onLoginButtonClick.bind(this);

        this.setState({
            loginButtonClicked: false
        });
    }

    public render(): JSX.Element {
        if (!this.state.loginButtonClicked) {
            return this.renderMainPage();
        }

        if (this.props.userToken.accessToken === '') {
            return this.renderLoginFrame();
        }

        return (<TodoPage/>);
    }

    private renderMainPage() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                {App.renderHeader()}
                {App.renderDownloadContainer()}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '12px'
                }}>
                    <label style={{fontSize: '14px', color: '#FF8800'}}>创建并分享你的梦想</label>
                </div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#eee', marginTop: '12px'}}/>
                {this.renderLoginButtonContainer()}
            </div>
        );
    }

    private renderLoginButtonContainer() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}>
                <Button
                    style={{
                        width: '90%',
                        maxWidth: '360px',
                        backgroundColor: '#008888',
                        color: '#fff',
                        marginTop: '48px',
                        fontSize: '200%',
                        borderStyle: 'solid',
                        borderColor: '#eee',
                        borderWidth: '1px',
                        borderRadius: '8px'
                    }}
                    onClick={this.onLoginButtonClick}
                >
                    登录网页版
                </Button>
                <label style={{color: '#888', marginTop: '8px', fontSize: '12px'}}>
                    网页版仅提供浏览功能
                </label>
            </div>
        );
    }

    private onLoginButtonClick() {
        this.setState({loginButtonClicked: true});
    }

    private renderLoginFrame() {
        return (
            <LoginFrame
                style={{
                    position: 'absolute',
                    margin: 'auto',
                    top: '0',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    width: '100%',
                    height: '100%',
                    borderWidth: '0px'
                }}
                loginUrl={env.host + '/web/account/login'}
                onLoginCallback={() => {
                    console.log('');
                }}
            />
        );
    }
}

const selectProps = (rootState: RootState) => ({
    userToken: rootState.userToken
});

export default connect(selectProps, {
})(App);
