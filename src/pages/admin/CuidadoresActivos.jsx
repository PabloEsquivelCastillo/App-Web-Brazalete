import React, { useEffect, useState } from "react";
import { getCuidadores } from "../../components/CuidadorService";
import '../../css/CuidadoresActivos.css'
import Navbar from "../../components/Navbar";
import LateralAdmin from "../../components/LateralAdmin";


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
                setError(err); // Maneja el error
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        cargarCuidadores();
    }, []);

    if (loading) return <p>Cargando cuidadores...</p>; // Muestra un mensaje de carga
    if (error) return <p>Error al cargar los cuidadores: {error.message}</p>; // Muestra un mensaje de error





    return (
        <>
                <Navbar/>
                <LateralAdmin/>
                <div className="container">
            
            <table className="table table-custom">
                <thead>
                    <tr>
                        <th scope="col" className="col-name">Nombre</th>
                        <th scope="col">Correo electrónico</th>
                        <th className= "border-two" scope="col">Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {cuidadores.map((cuidador) => (
                        <tr key={cuidador._id}>
                            <td>{cuidador.name}</td>
                            <td>{cuidador.email}</td>
                            <td>{cuidador.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
        
    );
};

export default CuidadoresActivos;