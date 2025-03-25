import React from "react";
import axiosInstance from "../api/axiosConfig";






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