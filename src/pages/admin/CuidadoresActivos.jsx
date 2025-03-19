import React, { useEffect, useState } from "react";
import { getCuidadores } from "../../components/CuidadorService";
import '../../css/CuidadoresActivos.css'


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
        <div className="container">
            <table className="table table-custom">
                <thead>
                    <tr>
                        <th className= "border-one" scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Correo electrónico</th>
                        <th className= "border-two" scope="col">Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {cuidadores.map((cuidador) => (
                        <tr key={cuidador._id}>
                            <td>{cuidador._id}</td>
                            <td>{cuidador.name}</td>
                            <td>{cuidador.email}</td>
                            <td>{cuidador.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CuidadoresActivos;