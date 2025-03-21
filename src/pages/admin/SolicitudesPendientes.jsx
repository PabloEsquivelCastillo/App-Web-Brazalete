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

  const index = 0;
  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error al cargar las solicitudes: {error.message}</p>;

  return (
    <>
      <Navbar></Navbar>
      <div className="container mt-4">
        <h1 className="title">Solicitudes Pendientes</h1>
        <table className="table-custom">
          <thead>
            <tr>
              <th className="boreder-one">#</th>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th className="border-two">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud, index) => (
              <tr key={solicitud._id}>
                <td>{index + 1}</td>
                <td>{solicitud.name}</td>
                <td>{solicitud.email}</td>
                <td>{solicitud.phone}</td>
                <td className="container-button">
                  <button className="btn btn-yes" onClick={() => handleAccept(solicitud._id)}>
                    <FaCheck /> Aceptar
                  </button>
                  <button className="btn btn-not" onClick={() => handleDenny(solicitud._id)}>
                    <RiCloseLargeFill /> Rechazar
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
