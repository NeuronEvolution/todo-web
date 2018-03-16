import { Button } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import LoginFrame from './_common/login/LoginFrame';
import { User } from './_common/login/redux_login';
import { HOST } from './ENV';
import { RootState } from './redux';
import TodoPage from './todoView/TodoPage';

const androidDownloadImage = require('./images/android_download_qr.png');

export interface Props {
    user: User;
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
                <label style={{color: '#FFF', fontSize: '200%'}}>
                    @&nbsp;火&nbsp;&nbsp;星&nbsp;&nbsp;计&nbsp;&nbsp;划
                </label>
            </div>
        );
    }

    private static renderDownloadContainer() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: '12px',
                paddingBottom: '12px'
            }}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '12px'}}>
                    <img
                        style={{width: '160px', height: '160px'}}
                        src={androidDownloadImage}/>
                    <label>安卓版</label>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '12px'}}>
                    <img
                        style={{width: '160px', height: '160px'}}
                        src={androidDownloadImage}/>
                    <label>苹果版</label>
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

        if (this.props.user.accessToken === '') {
            return this.renderLoginFrame();
        }

        return (<TodoPage/>);
    }

    private renderMainPage() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {App.renderHeader()}
                {App.renderDownloadContainer()}
                <div style={{width: '100%', height: '1px', backgroundColor: '#eee'}}/>
                {this.renderLoginButtonContainer()}
            </div>
        );
    }

    private renderLoginButtonContainer() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Button
                    style={{
                        backgroundColor: '#0088FF',
                        color: '#fff',
                        marginTop: '48px',
                        fontSize: '200%',
                        width: '300px',
                        borderStyle: 'solid',
                        borderColor: '#eee',
                        borderWidth: '1px',
                        borderRadius: '8px'
                    }}
                    onClick={this.onLoginButtonClick}
                >
                    登录
                </Button>
                <label style={{color: '#888', marginTop: '8px'}}>
                    创建并分享你的梦想
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
                    borderColor: '#eee',
                    borderWidth: '1px',
                    backgroundColor: '#fff'
                }}
                loginUrl={HOST + '/web/user/login'}
                onLoginCallback={() => {
                    console.log('');
                }}
            />
        );
    }
}

const selectProps = (rootState: RootState) => ({
    user: rootState.user
});

export default connect(selectProps, {
})(App);
