import { CompressTwoTone } from '@mui/icons-material';
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