import React, { useEffect, useState } from "react";
import { eliminarMedicamento, obtenerMedicamentos } from "../../Logica/Medicamentos";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { IoChevronBackSharp } from "react-icons/io5";
import { RiMedicineBottleLine } from "react-icons/ri";
import { Container, Row, Col, Table, Pagination, Button, Modal } from 'react-bootstrap';
import "../../css/Tablas.css";
import "../../css/Paginacion.css";
import iconMed from '../../assets/iconMed.svg';
import LateralCuidador from "../../components/LateralCuidador";
import Navbar from "../../components/Navbar";


const MedicamentosCuidador = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    
    // Estados para el modal de confirmación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMedicamento, setSelectedMedicamento] = useState(null);

    useEffect(() => {
        const cargarMedicamentos = () => {
            obtenerMedicamentos()
                .then((data) => {
                    setMedicamentos(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });
        };
        cargarMedicamentos();
    }, []);

    const handleEdit = (id) => {
        navigate(`/cuidador/EditarMedicamento/${id}`)
        console.log("Editar medicamento con ID:", id);
    };

    const handleDesactivate = (medicamento) => {
        setSelectedMedicamento(medicamento);
        setShowDeleteModal(true);
    };
    
    const handleDelete = () => {
        eliminarMedicamento(selectedMedicamento._id);
        const actualizarLista = medicamentos.filter(medicamento => medicamento._id !== selectedMedicamento._id);
        setMedicamentos(actualizarLista);
        setShowDeleteModal(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMedicamentos = medicamentos.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(medicamentos.length / itemsPerPage);

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

    if (loading) return <p className="mt-4 d-flex justify-content-center" >Cargando medicamentos...</p>;
    if (error) return <p className="mt-4 d-flex justify-content-center">Error al cargar los medicamentos: {error.message}</p>;

    return (
        <>
            <Navbar/>
            <LateralCuidador />
            <Container fluid className=" d-flex ">
                <div className="contenedor">
                    {/* Botón "Añadir Medicamento" */}
                    <Row className="mb-3  header-content">
                        <Col>
                            <h1 className="title">Medicamentos</h1>
                        </Col>
                        <Col>
                            <Button
                                variant="success"
                                onClick={() => navigate("/cuidador/RegistrarMedicamento")}
                                className="d-flex align-items-center gap-2 add-medicamento-btn"
                                style={{ height: "50px" }}
                            >
                                <img src={iconMed} alt="Mi Icono" style={{ width: '30px', height: '30px', opacity: "revert" }} />
                                Añadir Medicamento
                            </Button>
                        </Col>

                    </Row>


                    <Row>
                        <Col>
                            <div className="table-responsive">
                                <Table className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Nombre genérico</th>
                                            <th>Descripción</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMedicamentos.map((medicamento, index) => (
                                            <tr key={medicamento._id}>
                                                <td>{medicamento.nombre}</td>
                                                <td>{medicamento.description}</td>
                                                <td>
                                                    <Button
                                                        variant="none"
                                                        size="sm"
                                                        onClick={() => handleEdit(medicamento._id)}
                                                        className="btn-editar"
                                                    >
                                                        <FaRegEdit /> <span className="btn-text">Editar</span>
                                                    </Button>
                                                    <Button
                                                        variant="none"
                                                        size="sm"
                                                        onClick={() => handleDesactivate(medicamento)}
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

                    <Container fluid>
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
                    </Container>
                    
                    {/* Confirmación de Eliminación */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Está seguro que desea eliminar el medicamento {selectedMedicamento?.nombre}?
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
                </div>
            </Container>
        </>
    );
};

export default MedicamentosCuidador;