import axiosInstance from '../api/axiosConfig'; // Importa la instancia configurada de Axios

// Obtener la lista de cuidadores
export const getCuidadores = async () => {
    try {
        const response = await axiosInstance.get('/api/users/listKeepers'); // Usa la instancia configurada
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error fetching keepers:', error);
        throw error; // Lanza el error para manejarlo en el componente
    }
};