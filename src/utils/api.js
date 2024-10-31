import axios from "axios";
import { BASE_URL } from ".";

export const accessToken = localStorage.getItem('access_token');

const $api = axios.create({
    baseURL: `${BASE_URL}/api`
});

const handleLogOut = () => {
    localStorage.clear();
}

// setting up token interceptor for all requests
$api.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});


// Setting response interceptor for handling token expiration and refreshing tokens
$api.interceptors.response.use(
    config => config,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            
            handleLogOut(); // Logout user if refresh fails
        }

        return Promise.reject(error);
    }
);

export default $api;