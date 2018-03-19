export interface Env {
    host: string;
}

export const env: Env = {
    host: process.env.REACT_APP_WEB_HOST ? process.env.REACT_APP_WEB_HOST : ''
};
