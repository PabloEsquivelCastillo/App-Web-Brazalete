import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Badge, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { IoChevronBackSharp } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import '../../css/Tablas.css';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import '../../css/Paginacion.css';
import LateralCuidador from "../../components/LateralCuidador";
import { obtenerRecordatoriosPorCuidador, eliminarRecordatorio } from "../../Logica/Recordatorios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatearFechaHora = (fechaString) => {
    if (!fechaString) return 'N/A';
    
    const fecha = new Date(fechaString);
    const opcionesFecha = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    return `${fecha.toLocaleDateString('es-ES', opcionesFecha)} a las ${fecha.toLocaleTimeString('es-ES', opcionesHora)}`;
};

const RecordatoriosCuidador = () => {
    const [recordatorios, setRecordatorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRecordatorio, setSelectedRecordatorio] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        const cargarRecordatorios = async () => {
            try {
                if (!user || !user.id) {
                    throw new Error("Usuario no autenticado");
                }

                const data = await obtenerRecordatoriosPorCuidador(user.id);
                setRecordatorios(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);

                if (err.response?.status === 401 || err.message.includes("Usuario no autenticado")) {
                    navigate('/login');
                }
            }
        };
        
        cargarRecordatorios();
    }, [user, navigate]);

    const handleEdit = (recordatorio) => {
        navigate(`/cuidador/editarRecordatorio/${recordatorio._id}`);
    };

    const handleCrearRecordatorio = () => {
        navigate('/cuidador/RegistrarRecordatorio');
    };

    const handleDeleteConfirmation = (recordatorio) => {
        setSelectedRecordatorio(recordatorio);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            if (selectedRecordatorio) {
                await eliminarRecordatorio(selectedRecordatorio._id);
                setRecordatorios(recordatorios.filter(r => r._id !== selectedRecordatorio._id));
                setShowDeleteModal(false);
                toast.success("Recordatorio eliminado correctamente");
            }
        } catch (err) {
            console.error("Error al eliminar recordatorio:", err);
            toast.error("Error al eliminar el recordatorio");
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecordatorios = recordatorios.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(recordatorios.length / itemsPerPage);

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

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <Container className="mt-4 text-center">
            <div className="alert alert-danger">
                Error al cargar los recordatorios: {error.message}
            </div>
        </Container>
    );

    return (
        <>
            <Navbar/>
            <LateralCuidador />
            <Container fluid className="mt-4 d-flex justify-content-center">
                <div className="contenedor">
                    <Row className="mb-3 header-content">
                        <Col>
                            <h1 className="title">Mis Recordatorios</h1>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="success"
                                onClick={handleCrearRecordatorio}
                                className="d-flex align-items-center gap-2 add-medicamento-btn"
                            >
                                <FaPlus /> Crear Recordatorio
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className="table-responsive">
                                {recordatorios.length > 0 ? (
                                    <Table className="table-custom table-striped table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Medicamento</th>
                                                <th>Paciente</th>
                                                <th>Inicio</th>
                                                <th>Fin</th>
                                                <th>Periodo</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecordatorios.map((recordatorio, index) => (
                                                <tr key={recordatorio._id}>
                                                    <td>{recordatorio.medicamentos?.nombre || 'Sin nombre'}</td>
                                                    <td>{recordatorio.nombre_paciente || 'N/A'}</td>
                                                    <td>{formatearFechaHora(recordatorio.inicio)}</td>
                                                    <td>{formatearFechaHora(recordatorio.fin)}</td>
                                                    <td>cada {recordatorio.time || 'N/A'} h</td>
                                                    <td>
                                                        <Badge 
                                                            bg={recordatorio.cronico ? 'info' : 'secondary'}
                                                            className="text-capitalize"
                                                        >
                                                            {recordatorio.cronico ? 'Crónico' : 'Temporal'}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleEdit(recordatorio)}
                                                            className="btn-editar"
                                                        >
                                                            <FaRegEdit /> <span className="btn-text">Editar</span>
                                                        </Button>
                                                        <Button
                                                            variant="none"
                                                            size="sm"
                                                            onClick={() => handleDeleteConfirmation(recordatorio)}
                                                            className="btn-eliminar"
                                                        >
                                                            <MdDeleteOutline /> <span className="btn-text">Eliminar</span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="alert alert-info text-center">
                                        No hay recordatorios disponibles
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* Pagination */}
                    {recordatorios.length > itemsPerPage && (
                        <Row>
                            <Col className="d-flex justify-content-end">
                                <Pagination className="custom-pagination">
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="page-link"
                                    >
                                        <IoChevronBackSharp /> Anterior
                                    </Pagination.Prev>
                                    {renderPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="page-link"
                                    >
                                        Siguiente <MdNavigateNext />
                                    </Pagination.Next>
                                </Pagination>
                            </Col>
                        </Row>
                    )}
                </div>
            </Container>

            {/* Confirmación de Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar el recordatorio para {selectedRecordatorio?.medicamentos?.nombre}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="d-flex align-items-center gap-2 add-medicamento-btn" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="secondary" className="d-flex align-items-center gap-2 add-medicamento-btn" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
};

export default RecordatoriosCuidador;