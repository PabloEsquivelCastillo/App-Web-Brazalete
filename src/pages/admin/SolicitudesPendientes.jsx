import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import LateralAdmin from "../../components/LateralAdmin";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import '../../css/SolicitudesPendientes.css'


const Solicitudes = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/users/listKeepers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        const formattedRows = response.data.map((item, index) => ({
          id: index + 1,
          name: item.name,
          email: item.email,
          phone: item.phone,
        }));
        setRows(formattedRows);
      } else {
        console.error("El api no devolvió nada", response.data);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error al cargar las solicitudes: {error.message}</p>;

  return (
    <>
      <Navbar />
      <LateralAdmin />
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
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.phone}</td>
                <td>
                  <button className="btn btn-primary me-2">
                    <FaRegEdit />
                  </button>
                  <button className="btn btn-danger" >
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

export default Solicitudes;
