//Aquí para manejar la lógica del cuidador

import axios from 'axios';
import axiosInstance from '../api/axiosConfig'; // Importa la instancia configurada de Axios
import { data } from 'react-router-dom';


//Actualizar Usuario
export const actualizarCuidador = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el cuidador:", error);
        throw error;
    }
};


