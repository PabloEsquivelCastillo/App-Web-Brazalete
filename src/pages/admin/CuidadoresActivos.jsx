import React, { useEffect, useState } from "react";
import { getCuidadores, deactivateCuidador } from "../../Logica/FuncionesAdmin";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";  // Importa ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importa los estilos de react-toastify
import { useNavigate } from "react-router-dom";

const CuidadoresActivos = () => {
    const [cuidadores, setCuidadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarCuidadores = async () => {
            try {
                const data = await getCuidadores();
                setCuidadores(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        cargarCuidadores();
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/editar/${id}`);
    }

    const handleDeactivate = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas desactivar este cuidador?")) {
            try {
                await deactivateCuidador(id);
                const updatedCuidadores = cuidadores.filter(cuidador => cuidador._id !== id);
                setCuidadores(updatedCuidadores);
                toast.success("Cuidador eliminado correctamente");
            } catch (error) {
                console.error("Error al desactivar el cuidador:", error);
                toast.error("Error al desactivar el cuidador");
            }
        }
    };

    if (loading) return <p>Cargando cuidadores...</p>;
    if (error) return <p>Error al cargar los cuidadores: {error.message}</p>;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} /> {/* Contenedor de notificaciones */}
            <div className="container">
                <h1 className="title">Cuidadores</h1>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="boreder-one">Nombre</th>
                            <th>Correo electrónico</th>
                            <th>Teléfono</th>
                            <th className="border-two">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuidadores.map((cuidador) => (
                            <tr key={cuidador._id}>
                                <td>{cuidador.name}</td>
                                <td>{cuidador.email}</td>
                                <td>{cuidador.phone}</td>
                                <td className="container-button">
                                    <button className="btn btn-yes" onClick={() => handleEdit(cuidador._id)}>
                                        <FaRegEdit /> Editar
                                    </button>
                                    <button className="btn btn-not   " onClick={() => handleDeactivate(cuidador._id)}>
                                        <MdDeleteOutline /> Eliminar
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
