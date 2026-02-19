import axios from 'axios';

const api = axios.create({
    baseURL: 'http://13.63.57.2:8080/api',
});

// For development, we'll stop using JWT tokens as requested.
// The backend is now configured to use a DevAuthFilter that mocks a session.
api.interceptors.request.use((config) => {
    // Optionally send a mock User ID header if needed by the backend
    config.headers['X-User-Id'] = 'dev-user';
    return config;
});

export default api;
