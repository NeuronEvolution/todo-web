import * as React from 'react';
import { parseQueryString } from './common';

export interface Props {
    loginUrl: string;
    content: JSX.Element;
    style?: React.CSSProperties;
}

interface State {
    accessToken?: string;
    refreshToken?: string;
}

export const DEFAULT_STYLE_FULLSCREEN: React.CSSProperties = {
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    height: '100%',
    border: '0px'
};

export default class LoginComponent extends React.Component<Props, State> {
    public componentWillMount() {
        const queryParamsMap = parseQueryString(window.location.search);
        const accessToken = queryParamsMap.get('accessToken');
        const refreshToken = queryParamsMap.get('refreshToken');

        this.loginFrameEventListener = this.loginFrameEventListener.bind(this);

        this.setState({accessToken, refreshToken});

        window.addEventListener('message', this.loginFrameEventListener);
    }

    public render() {
        return this.state.accessToken ? this.props.content : this.renderLoginFrame();
    }

    private renderLoginFrame() {
        const style = this.props.style ? this.props.style : DEFAULT_STYLE_FULLSCREEN;
        const url = 'http://' + this.props.loginUrl +
            '?fromOrigin=' + encodeURIComponent(window.location.origin);

        return (
            <iframe
                style={style}
                src={url}
            />
        );
    }

    private loginFrameEventListener(e: MessageEvent) {
        const data = e.data;
        switch (data.type) {
            case 'onLoginCallback':
                const {accessToken, refreshToken} = data.payload;
                this.onLoginCallback(accessToken, refreshToken);
                break;
            default:
                return;
        }
    }

    private onLoginCallback(accessToken: string, refreshToken: string) {
        this.setState({accessToken, refreshToken});
    }
}