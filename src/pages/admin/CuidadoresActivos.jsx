import React, { useEffect, useState } from "react";
import { getCuidadores, deactivateCuidador } from "../../Logica/FuncionesAdmin";
import '../../css/CuidadoresActivos.css'
import Navbar from "../../components/Navbar";
import LateralAdmin from "../../components/LateralAdmin";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";


const CuidadoresActivos = () => {
    const [cuidadores, setCuidadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const index = 0;

    useEffect(() => {
        const cargarCuidadores = async () => {
            try {
                const data = await getCuidadores();// Llama a la función getCuidadores
                setCuidadores(data); // Guarda los datos en el estado
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        cargarCuidadores();
    }, []);

    // Función para manejar la desactivación de un cuidador
    const handleDeactivate = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas desactivar este cuidador?")) {
            try {
                await deactivateCuidador(id);
                const updatedCuidadores = cuidadores.filter(cuidador => cuidador._id !== id);
                setCuidadores(updatedCuidadores);
                toast.success("Cuidador desactivado correctamente");
            } catch (error) {
                console.error("Error al desactivar el cuidador:", error);
                toast.error("Error al desactivar el cuidador");
            }
        }
    };

    if (loading) return <p>Cargando cuidadores...</p>; // Muestra un mensaje de carga
    if (error) return <p>Error al cargar los cuidadores: {error.message}</p>; // Muestra un mensaje de error





    return (
        <>
            <div className="container">
                <table className="table table-custom">
                    <thead>
                        <tr>
                            <th className="boreder-one" scope="col" >id</th>
                            <th scope="col" >Nombre</th>
                            <th scope="col">Correo electrónico</th>
                            <th scope="col">Teléfono</th>
                            <th className="border-two" scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuidadores.map((cuidador) => (
                            <tr key={cuidador._id}>
                                <td>{cuidador._id}</td>
                                <td>{cuidador.name}</td>
                                <td>{cuidador.email}</td>
                                <td>{cuidador.phone}</td>
                                <td>
                                    <button className="btn btn-update" >
                                        <FaRegEdit />
                                    </button>
                                    <button className="btn btn-delete"  onClick={() => handleDeactivate(cuidador._id)}>
                                        <MdDeleteOutline />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>

    );
};

export default CuidadoresActivos;