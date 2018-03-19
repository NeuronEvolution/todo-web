export interface Env {
    publicUrl: string;
    host: string;
}

export const env: Env = {
    publicUrl: process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '',
    host: process.env.WEB_HOST ? process.env.WEB_HOST : 'http://127.0.0.1:8080'
};