// # Configuración de Axios y llamadas a la API
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://psu3y59k4a.execute-api.us-east-1.amazonaws.com',
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export default axiosInstance;