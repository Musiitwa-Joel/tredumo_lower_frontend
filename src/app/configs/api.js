import axios from 'axios';
// import { logoutUser } from 'app/store/userSlice'; // Import your logout action
// import store from 'app/store'; // Import your Redux store
import { url } from './apiConfig';
import { setToken } from 'app/store/tokenSlice';
import store from 'app/store/store';

const api = axios.create({
  baseURL: url,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Dispatch logout action
            // store.dispatch(logoutUser());
            
            // Redirect to login page
            // window.location.href = '/';
            localStorage.removeItem('jwt_access_token');
            store.dispatch(setToken(null));
        }
        return Promise.reject(error);
    }
);

export default api;
