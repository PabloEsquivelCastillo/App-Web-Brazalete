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

export const aceptarSolicitud = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No hay token disponible");
            return;
        }

        console.log("📤 Enviando solicitud para actualizar usuario con ID:", id);

        const response = await axiosInstance.put(
            `http://localhost:3000/api/users/${id}`,
            {},  // Asegúrate de enviar un objeto (aunque sea vacío)
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("✅ Respuesta de la API:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en la solicitud PUT:", error.response ? error.response.data : error);
    }
};



//Actualizar Cuidador