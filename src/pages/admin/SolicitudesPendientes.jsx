import React, { useEffect, useState } from "react";
import LateralAdmin from "../../components/LateralAdmin";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { aceptarSolicitudes, getSolicitudes, rechazarSolicitud } from "../../Logica/FuncionesAdmin";
import { Container, Row, Col, Table, Button, Pagination } from 'react-bootstrap';
import '../../css/Tablas.css';
import '../../css/Paginacion.css';

const SolicitudesPendientes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const cargarCuidadores = async () => {
            try {
                const data = await getSolicitudes();
                setSolicitudes(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        cargarCuidadores();
    }, []);

    const handleAccept = async (id) => {
        try {
            await aceptarSolicitudes(id);
            const updateSolis = solicitudes.filter(solicitud => solicitud._id !== id);
            setSolicitudes(updateSolis);
            toast.success("Solicitud aceptada correctamente");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al aceptar la solicitud");
        }
    };

    const handleDenny = async (id) => {
        try {
            await rechazarSolicitud(id);
            const updateSolis = solicitudes.filter(solicitud => solicitud._id !== id);
            setSolicitudes(updateSolis);
            toast.success("Solicitud rechazada correctamente");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al rechazar la solicitud");
        }
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSolicitudes = solicitudes.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(solicitudes.length / itemsPerPage);

    const renderPaginationItems = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    if (loading) return <p className="mt-4 d-flex justify-content-center">Cargando solicitudes...</p>;
    if (error) return <p className="mt-4 d-flex justify-content-center">Error al cargar las solicitudes: {error.message}</p>;

    return (
        <>
            <LateralAdmin />
            <Container fluid className="mt-4 d-flex justify-content-center">
                <div className="contenedor">
                    {/* Título */}
                    <Row className="mb-3 header-content">
                        <Col>
                            <h1 className="title">Solicitudes Pendientes</h1>
                        </Col>
                    </Row>

                    {/* Tabla */}
                    <Row>
                        <Col>
                            <div className="table-responsive">
                                <Table className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Correo Electrónico</th>
                                            <th>Teléfono</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSolicitudes.map((solicitud, index) => (
                                            <tr key={solicitud._id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{solicitud.name}</td>
                                                <td>{solicitud.email}</td>
                                                <td>{solicitud.phone}</td>
                                                <td>
                                                    <Button
                                                        variant="none"
                                                        size="sm"
                                                        onClick={() => handleAccept(solicitud._id)}
                                                        className="btn-aceptar"
                                                    >
                                                        <FaCheck /> <span className="btn-text">Aceptar</span>
                                                    </Button>
                                                    <Button
                                                        variant="none"
                                                        size="sm"
                                                        onClick={() => handleDenny(solicitud._id)}
                                                        className="btn-rechazar"
                                                    >
                                                        <RiCloseLargeFill /> <span className="btn-text">Rechazar</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>

                    {/* Paginación */}
                    <Container fluid>
                        <Row>
                            <Col className="d-flex justify-content-end">
                                <Pagination className="custom-pagination">
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="page-link"
                                    >
                                        Anterior
                                    </Pagination.Prev>
                                    {renderPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="page-link"
                                    >
                                        Siguiente
                                    </Pagination.Next>
                                </Pagination>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Container>
            <ToastContainer />
        </>
    );
};

export default SolicitudesPendientes;