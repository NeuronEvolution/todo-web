import * as React from 'react';
import { connect } from 'react-redux';
import LoginFrame from './_common/login/LoginFrame';
import { User } from './_common/login/redux_login';
import MainPage from './mainView/MainPage';

export interface Props {
    user: User;
}

class App extends React.Component<Props> {
    private static renderLoginFrame() {
        return (
            <LoginFrame loginUrl={'127.0.0.1:3004'}/>
        );
    }

    public render() {
        return (
            <div>
                <MainPage s={''}/>
                {this.props.user.accessToken === '' && App.renderLoginFrame()}
            </div>
        );
    }
}

const selectProps = (rootState: {user: User}) => ({
    user: rootState.user
});

export default connect(selectProps, {
})(App);
