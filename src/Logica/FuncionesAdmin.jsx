//Aquí para manejar la lógica del admin

import axios from 'axios';
import axiosInstance from '../api/axiosConfig'; // Importa la instancia configurada de Axios
import { data } from 'react-router-dom';

// Obtener la lista de cuidadores
export const getCuidadores = async () => {
    try {
        const response = await axiosInstance.get('/users/listKeeperss'); // Usa la instancia configurada
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error fetching keepers:', error);
        throw error; 
    }
};

//Para que se suba



// Desactivar un cuidador
export const deactivateCuidador = async (id) => {
    try {
        const response = await axiosInstance.put(`/users/deactivate/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deactivating keeper:', error);
        throw error;
    }
};

//Actualizar Cuidador
export const actualizarCuidador = async (id, data) => {
    try{
        const response = await axiosInstance.put(`/users/${id}`, data)
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el cuidador: ', error);
        throw error;
    }
}



//Consultar Solicitudes
export const getSolicitudes = async () => {
    return axiosInstance
    .get('/users/listKeepers')
    .then((res) => {
        return res.data;
    })
    .catch((e) => {
        return {error : "Error al msotrar las solicitudes"}
    })
}


//Aceptar Solicitudes
export const aceptarSolicitudes = async (id) => {
    return axiosInstance
    .get(`/acepKeep/${id}`)
    .then(( res ) => {
        return res;
    })
    .catch( (e) => {
        return {error : ""}
    })
}

//Rechazar Solicitud
export const rechazarSolicitud = async (id) => {
    return axiosInstance
    .get(`/users/deny/${id}`)
    .then(( res ) => {
        return res;
    })
    .catch( (e) => {
        return {error : ""}
    })
}








