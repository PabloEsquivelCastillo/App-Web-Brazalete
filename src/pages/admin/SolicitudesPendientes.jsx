import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import LateralAdmin from "../../components/LateralAdmin";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import '../../css/SolicitudesPendientes.css'
import { aceptarSolicitudes, getSolicitudes, rechazarSolicitud } from "../../Logica/FuncionesAdmin";

const SolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const cargarCuidadores = () => {
      getSolicitudes()
        .then((data) => {
          setSolicitudes(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
        })
    };
    cargarCuidadores();
  }, []);


  const handleAccept = (id) => {
      if (window.confirm("Aceptart solicitud de ser cuidador")) {
          try {
            aceptarSolicitudes(id);
            const updateSolis = solicitudes.filter(solicitud => solicitud._id !== id);
            setSolicitudes(updateSolis);
          } catch (error) {
             console.error("Erro: ", error);
            toast.error("Error ");
          }
      }
  };

  const handleDenny = (id) => {
      if (window.confirm("Rechazar Solicitud")) {
          try {
            rechazarSolicitud(id);
            const updateSolis = solicitudes.filter(solicitud => solicitud._id !== id);
            setSolicitudes(updateSolis);
          } catch (error) {
             console.error("Erro: ", error);
            toast.error("Error ");
          }
      }
  };


  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error al cargar las solicitudes: {error.message}</p>;

  return (
    <>
      <div className="container mt-4">
        <h1 className="title">Solicitudes Pendientes</h1>
        <table className="table table-custom">
          <thead>
            <tr>
              <th className="boreder-one" scope="col">Nombre</th>
              <th scope="col">Correo Electrónico</th>
              <th scope="col">Teléfono</th>
              <th className="border-two" scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud._id}>
                <td>{solicitud.name}</td>
                <td>{solicitud.email}</td>
                <td>{solicitud.phone}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handleAccept(solicitud._id)} >
                    <FaCheck />
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDenny(solicitud._id)} >
                    <RiCloseLargeFill />
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

export default SolicitudesPendientes;
