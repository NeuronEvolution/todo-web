import * as React from 'react';
import LoginComponent from './_common/LoginComponent';

interface State {
    token?: string;
    refreshToken?: string;
}

class App extends React.Component<{}, State> {
    public render() {
        return (
            <LoginComponent
                loginUrl={'127.0.0.1:3004'}
                content={this.renderApp()}/>
        );
    }

    private renderApp(): JSX.Element {
        return (
            <div>sss</div>
        );
    }
}

export default App;
