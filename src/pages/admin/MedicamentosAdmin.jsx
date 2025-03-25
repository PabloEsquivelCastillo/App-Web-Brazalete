import React, { useEffect, useState } from "react";
import { eliminarMedicamento, obtenerMedicamentos } from "../../Logica/Medicamentos";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { IoChevronBackSharp } from "react-icons/io5";
import { RiMedicineBottleLine } from "react-icons/ri";
import { Container, Row, Col, Table, Pagination, Button } from 'react-bootstrap';
import "../../css/Tablas.css";
import "../../css/Paginacion.css";
import LateralAdmin from "../../components/LateralAdmin";
import iconMed from '../../assets/iconMed.svg';
import Navbar from "../../components/Navbar";


const MedicamentosAdmin = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

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
        navigate(`/admin/EditarMedicamento/${id}`)
        console.log("Editar medicamento con ID:", id);
    };

    const handleDesactivate = (id) => {
        eliminarMedicamento(id)
        const actualizarLista = medicamentos.filter(medicamento => medicamento._id !== id);
        setMedicamentos(actualizarLista);
    };

    // Paginación
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
            <Navbar />
            <LateralAdmin />
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
                                onClick={() => navigate("/admin/RegistrarMedicamento")}
                                className="d-flex align-items-center gap-2 add-medicamento-btn"
                                style={{ height: "50px" }}
                            >
                                <img src={iconMed} alt="Mi Icono" style={{ width: '30px', height: '30px', opacity: "revert" }} />
                                Añadir Medicamento
                            </Button>
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
                                            <th>Nombre genérico</th>
                                            <th>Descripción</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMedicamentos.map((medicamento, index) => (
                                            <tr key={medicamento._id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
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
                                                        onClick={() => handleDesactivate(medicamento._id)}
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
                </div>
            </Container>
        </>
    );
};

export default MedicamentosAdmin;