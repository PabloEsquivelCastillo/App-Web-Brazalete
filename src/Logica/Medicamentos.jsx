import { CompressTwoTone, ExploreOff } from '@mui/icons-material';
import axiosInstance from '../api/axiosConfig'; // Importa la instancia configurada de Axios
import { data } from 'react-router-dom';


//Obtener Medicamentos
export const obtenerMedicamentos = async () => {
    return axiosInstance
        .get("/medication")
        .then((res) => {
            return res.data
        })
        .catch((e) => {
            return {error : ""}

        })
}

//Registrar medicamento

export const registrarMed = async (data) =>{
    return axiosInstance   
        .post("/medication", data)
        .then((res) => {
            return res.data
        })
        .catch((e) => {
            return {error : "Error al registrar el medicamento"}
        })
}


//Actualizar medicamento

export const actualizarMedicamento = async (id, data) => {
    return axiosInstance
        .put(`/medication/${id}`, data)
        .then((res) => {
            return res
        })
        .catch((error) => {
            console.error("Error:", error)
            return {error : "Erro al actualizar el medicamento"}
        })
}


//Eliminar medicamento
export const eliminarMedicamento = async (id) => {
    return axiosInstance
        .put(`/medication/desactivate/${id}`)
        .then((res) => {
            return res
        })
        .catch((e) => {
            return {error : "Erro al eliminar el medicamento", e}
        })
}