//Aquí para manejar la lógica del admin

import axiosInstance from '../api/axiosConfig'; // Importa la instancia configurada de Axios

// Obtener la lista de cuidadores
export const getCuidadores = async () => {
    try {
        const response = await axiosInstance.get('/api/users/listKeepers'); // Usa la instancia configurada
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error fetching keepers:', error);
        throw error; 
    }
};


// Desactivar un cuidador
export const deactivateCuidador = async (id) => {
    try {
        const response = await axiosInstance.put(`/api/users/deactivate/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deactivating keeper:', error);
        throw error;
    }
};


//Actualizar Cuidador

export const actualizarCuidador = async (id, data) => {
    try{
        const response = await axiosInstance.put(`/api/users/${id}`, data)
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el cuidador: ', error);
        throw error;
    }
}