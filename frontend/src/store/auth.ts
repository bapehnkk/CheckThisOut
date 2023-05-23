import {createStore} from 'solid-js/store';
import {createEffect, createSignal} from "solid-js";

export interface AuthStateOptions {
    isAuthenticated: boolean;
    token: string | null;
}

const initialState: AuthStateOptions = {
    isAuthenticated: false,
    token: "",
};

const [authState, setAuthState] = createStore<AuthStateOptions>(initialState);
const [headerShow, setHeaderShow] = createSignal<boolean>(true);

createEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        setAuthState({isAuthenticated: true, token});
    }
});
export const setAuth = (isAuthenticated: boolean, token: string | null) => {
    setAuthState('isAuthenticated', isAuthenticated);
    setAuthState('token', token);
};

export function useAuthStore() {
    return [authState, setAuthState] as const;
}
export function useHeaderSignal() {
    return [headerShow, setHeaderShow] as const;
}

createEffect(()=>{
    if (!headerShow()) {

    }
});