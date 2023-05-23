/* @refresh reload */
import {render} from 'solid-js/web';

import './Styles/main.css';
import App from './App';
import {refreshToken} from "./auth";


const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
    );
}
window.onload = async () => {
    await refreshToken();
};
render(
    () =>
        <>
            <App/>
        </>,
    root!
)
