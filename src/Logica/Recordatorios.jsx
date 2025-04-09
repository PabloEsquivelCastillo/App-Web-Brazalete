import React from "react";
import axiosInstance from "../api/axiosConfig";



export const crearRecordatorio = async (recordatorioData) => {
    try {
        const response = await axiosInstance.post('/reminder', recordatorioData);
        return response.data;
    } catch (error) {
        console.error('Error en crearRecordatorio:', error);
        throw error;
    }
};


export const getHistoryReminderByIdReminder = async (id) => {
    try {
      // Usar axiosInstance para mantener la consistencia con otras funciones
      const response = await axiosInstance.get(`/reminders/hystory/${id}`);
      
      // Registrar información de depuración
      console.log(`Respuesta de historial para ID ${id}:`, response.status);
      
      return response.data;
    } catch (error) {
      // Mejorar el manejo de errores para ayudar con la depuración
      console.error('Error en getHistoryReminderByIdReminder:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.error(`Error del servidor: ${error.response.status}`, error.response.data);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        // Algo ocurrió al configurar la petición
        console.error('Error en la configuración de la petición:', error.message);
      }
      
      throw error;
    }
  };

// Logica/Recordatorios.js
export const obtenerRecordatorios = async () => {
    try {
        const response = await axiosInstance.get('/reminders');
        return response.data; // Asegúrate que esto devuelve el array directamente
    } catch (error) {
        console.error("Error en obtenerRecordatorios:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};  




export const obtenerRecordatoriosPorCuidador = async (id) => {
    try {
        const response = await axiosInstance.get(`/reminders/user/${id}`);
        return response.data; // Asegúrate que esto devuelve el array directamente
    } catch (error) {
        console.error("Error en obtenerRecordatorios:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};  

export const eliminarRecordatorio = async (recordatorioId) => {
    try {
        const response = await axiosInstance.delete(`/reminder/${recordatorioId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar recordatorio:", error);
        throw error;
    }
};


export const actualizarRecordatorio = async (id, data) => {
    try{
        const response = await axiosInstance.put(`/reminder/${id}`, data)
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el recordatorio: ', error);
        throw error;
    }
}