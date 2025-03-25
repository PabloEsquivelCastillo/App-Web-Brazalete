import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Pagination } from 'react-bootstrap';
import '../../css/Tablas.css';
import '../../css/Paginacion.css';
import LateralAdmin from "../../components/LateralAdmin";
import { obtenerRecordatorios } from "../../Logica/Recordatorios";
import { data } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Recordatorios = () => {
    const [recordatorios, setRecordatorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const cargarRecordatorios = async () => {
            obtenerRecordatorios()
            .then((data) => {
                setRecordatorios(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            })
        };
        cargarRecordatorios();
    }, []);

    // Paginación
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

    if (loading) return <p className="mt-4 d-flex justify-content-center">Cargando recordatorios...</p>;
    if (error) return <p className="mt-4 d-flex justify-content-center">Error al cargar los recordatorios: {error.message}</p>;

    return (
        <>
        <Navbar/>
            <LateralAdmin />
            <Container fluid className="mt-4 d-flex justify-content-center">
                <div className="contenedor">
                    {/* Título */}
                    <Row className="mb-3 header-content">
                        <Col>
                            <h1 className="title">Recordatorios</h1>
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
                                            <th>Medicamento</th>
                                            <th>Nombre del Cuidador</th>
                                            <th>Fecha de Inicio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecordatorios.map((recordatorio, index) => (
                                            <tr key={recordatorio._id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{recordatorio.medicamentos.nombre}</td>
                                                <td>{recordatorio.usuario.name}</td>
                                                <td>{recordatorio.inicio}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>

                    {/* Paginación */}
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
                </div>
            </Container>
        </>
    );
};

export default Recordatorios;