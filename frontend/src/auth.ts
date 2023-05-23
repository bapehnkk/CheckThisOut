import axios from 'axios';
import {setAuth, useAuthStore} from "./store/auth";
import toast from "solid-toast";

const API_BASE_URL = 'http://localhost:8000/api/';

const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}users/token/`, {
            email: email,
            password: password,
        });
        console.log(response.status)
        console.log(response.data)

        if (response.status === 200) {
            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;
            localStorage.setItem("accessToken", accessToken); // Сохраняем access токен в локальном хранилище
            localStorage.setItem("refreshToken", refreshToken); // Сохраняем refresh токен в локальном хранилище
            setAuth(true, accessToken);

            toast(`Welcome, ${email}`, {
                duration: 5000,
                position: 'top-right',
                // Add a delay before the toast is removed
                // This can be used to time the toast exit animation
                unmountDelay: 500,
                // Styling - Supports CSS Objects, classes, and inline styles
                // Will be applied to the toast container
                style: {
                    'background-color': 'var(--stp-background-lighter)',
                    'color': 'var(--stp-foreground)',
                },
                icon: '👋',
                iconTheme: {
                    primary: '#fff',
                    secondary: '#000',
                },
            });
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error("Invalid username or password.");
            throw new Error("Invalid username or password.");
        } else {
            console.error("Error during login:", error);
            throw error;
        }
    }
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        try {
            const response = await axios.post(`${API_BASE_URL}users/token/refresh/`, {
                refresh: refreshToken,
            });

            if (response.status === 200) {
                const accessToken = response.data.access;
                localStorage.setItem("accessToken", accessToken); // Сохраняем новый access токен в локальном хранилище
                setAuth(true, accessToken);
            }
        } catch (error) {
            console.error("Error during token refresh:", error);
            setAuth(false, "")
            throw error;
        }
    } else {
        try {
            setAuth(false, "")
        } catch (e){}
    }
};
function refreshAccessToken() {
    return axios.post(`${API_BASE_URL}users/token/refresh/`, {
        refresh: refreshToken
    })
    .then(response => {
        if (response.status === 200) {
            const newAccessToken = response.data.access;
            // Сохраняем новый токен в локальное хранилище
            localStorage.setItem('access_token', newAccessToken);
            return newAccessToken;
        } else {
            throw new Error('Unable to refresh token');
        }
    });
}

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axios.interceptors.response.use(undefined, (error) => {
    if (error.config && error.response && error.response.status === 401 && !error.config._retry) {
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({resolve, reject});
            }).then(token => {
                error.config.headers['Authorization'] = 'Bearer ' + token;
                return axios(error.config);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        error.config._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
            refreshAccessToken() // Ассумимируем, что эта функция существует и возвращает промис нового токена
                .then((newToken) => {
                    error.config.headers['Authorization'] = 'Bearer ' + newToken;
                    processQueue(null, newToken);
                    resolve(axios(error.config));
                })
                .catch((err) => {
                    processQueue(err, null);
                    reject(err);
                })
                .then(() => { isRefreshing = false; });
        });
    }

    return Promise.reject(error);
});



const registerUser = async (
    email: string,
    username: string,
    password: string,
    full_name: string,
    phone: string,
    language: string
) => {
    const response = await axios.post(`${API_BASE_URL}users/register/`, {
        email,
        username,
        password,
        full_name,
        phone,
        language,
    });
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;
    localStorage.setItem("accessToken", accessToken); // Сохраняем access токен в локальном хранилище
    localStorage.setItem("refreshToken", refreshToken); // Сохраняем refresh токен в локальном хранилище
    setAuth(true, accessToken!);
    return response.data;
};

const logoutUser = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const handleLogout = async () => {
    try {
        await logoutUser();
        setAuth(false, "");
    } catch (error) {
        console.error(error);
    }
}


axios.interceptors.response.use(undefined, async error => {
    if (error.config && error.response && error.response.status === 401) {
        const originalRequest = error.config;
        try {
            await refreshToken();
            return axios(originalRequest);
        } catch (_error) {
            await handleLogout();
        }
    }
    return Promise.reject(error);
});


export async function validateField(fieldName: string, fieldValue: string, addError: any, removeError: any) {
    try {
        const response = await fetch(`${API_BASE_URL}users/validate_field/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                field_name: fieldName,
                field_value: fieldValue,
            }),
        });

        const data = await response.json();

        if (data.error) {
            removeError(fieldName);
            const errorMessage = data.error[fieldName] ? data.error[fieldName][0] : 'An error occurred while validating the field.';
            addError(fieldName, errorMessage);
        } else {
            removeError(fieldName);
        }
    } catch (error) {
        console.error('Error validating field:', error);
        addError(fieldName, 'An error occurred while validating the field. Please try again.');
    }
}


export {loginUser, registerUser, handleLogout};
