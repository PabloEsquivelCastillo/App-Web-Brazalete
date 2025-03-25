import React, { useEffect, useState } from "react";
import { getCuidadores, deactivateCuidador } from "../../Logica/FuncionesAdmin";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LateralAdmin from "../../components/LateralAdmin";
import { Container, Row, Col, Table, Pagination, Button } from 'react-bootstrap';
import Navbar from "../../components/Navbar";

const CuidadoresActivos = () => {
    const [cuidadores, setCuidadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    //.
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
    };

    const handleDeactivate = async (id) => {
        try {
            await deactivateCuidador(id);
            const updatedCuidadores = cuidadores.filter(cuidador => cuidador._id !== id); // Actualizar lista
            setCuidadores(updatedCuidadores);
            toast.success("Cuidador eliminado correctamente");
        } catch (error) {
            console.error("Error al desactivar el cuidador:", error);
            toast.error("Error al desactivar el cuidador");
        }
    };

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCuidadores = cuidadores.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(cuidadores.length / itemsPerPage);

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

    if (loading) return <p className="mt-4 d-flex justify-content-center">Cargando cuidadores...</p>;
    if (error) return <p className="mt-4 d-flex justify-content-center">Error al cargar los cuidadores: {error.message}</p>;

    return (
        <>
            <Navbar/>
            <LateralAdmin />
            <Container fluid className="mt-4 d-flex justify-content-center">
                <div className="contenedor">
                    {/* Título */}
                    <Row className="mb-3 header-content">
                        <Col>
                            <h1 className="title">Cuidadores</h1>
                        </Col>
                    </Row>

                    {/* Tabla */}
                    <Row>
                        <Col>
                            <div className="table-responsive">
                                <Table className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Correo electrónico</th>
                                            <th>Teléfono</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCuidadores.map((cuidador) => (
                                            <tr key={cuidador._id}>
                                                <td>{cuidador.name}</td>
                                                <td>{cuidador.email}</td>
                                                <td>{cuidador.phone}</td>
                                                <td>
                                                    <Button
                                                        variant="none"
                                                        size="sm"
                                                        onClick={() => handleEdit(cuidador._id)}
                                                        className="btn-editar"
                                                    >
                                                        <FaRegEdit /> <span className="btn-text">Editar</span>
                                                    </Button>
                                                    <Button
                                                        variant="none"
                                                        size="sm"
                                                        onClick={() => handleDeactivate(cuidador._id)}
                                                        className="btn-eliminar"
                                                    >
                                                        <MdDeleteOutline /> <span className="btn-text">Eliminar</span>
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
                    <Row >
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
                </div>
            </Container>
            <ToastContainer />
        </>
    );
};

export default CuidadoresActivos;