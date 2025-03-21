import React, { useEffect, useState } from "react";
import { obtenerMedicamentos } from "../../Logica/Medicamentos";
import { data } from "react-router-dom";
import '../../css/Medicamentos.css'
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";






const Medicamentos = () => {

    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Renderizamos la lista de medicamentos al montar el componente
    useEffect(() => {
        const cargarMedicamentos = () => {
            obtenerMedicamentos()
                .then((data) => {
                    setMedicamentos(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                })
        };
        cargarMedicamentos();
    }, []);

    if (loading) return <p>Cargando cuidadores...</p>;
    if (error) return <p>Error al cargar los cuidadores: {error.message}</p>;

    return (
        <>
            <div className="container mt-4">
                <h1 className="title">Medicamentos</h1>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="col border-one">#</th>
                            <th className="col">Nombre genérico</th>
                            <th className="col">Descripción</th>
                            <th className="col border-two">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/**Mapeo */}
                        {medicamentos.map((medicamento, index) => {
                            <tr key={medicamento._id}>
                                <td>{index + 1}</td>
                                <td>{medicamento.nombre}</td>
                                <td>{medicamento.description}</td>
                                <td>
                                    <button className="btn btn-update" onClick={() => handleEdit(cuidador._id)}>
                                        <FaRegEdit />
                                    </button>
                                    <button className="btn btn-delete" onClick={() => handleDeactivate(cuidador._id)}>
                                        <MdDeleteOutline />
                                    </button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Medicamentos;