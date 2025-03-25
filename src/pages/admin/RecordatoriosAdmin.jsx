import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Pagination, Modal } from 'react-bootstrap';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import '../../css/Tablas.css';
import '../../css/Paginacion.css';
import LateralAdmin from "../../components/LateralAdmin";
import { obtenerRecordatorios } from "../../Logica/Recordatorios";
import Navbar from "../../components/Navbar";

// Función para formatear fecha
const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    
    const fecha = new Date(fechaString);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
};

const RecordatoriosAdmin = () => {
    const [recordatorios, setRecordatorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    //.

    const [showPDFModal, setShowPDFModal] = useState(false);

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

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecordatorios = recordatorios.slice(indexOfFirstItem, indexOfLastItem);

    // PDF 
    const generarPDF = async () => {
        try {
            // Crear
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            
            // Titulo
            page.drawText('Reporte de Recordatorios de Medicamentos', {
                x: 50,
                y: height - 50,
                size: 18,
                font,
                color: rgb(0, 0, 0),
            });

            //tabla headers
            const headers = ['Medicamento', 'Descripción', 'Cuidador', 'Fecha de Inicio', 'Fecha de Fin'];
            const startY = height - 100;
            const cellHeight = 30;
            const columnWidths = [100, 150, 100, 100, 100];

            //headers
            headers.forEach((header, i) => {
                page.drawText(header, {
                    x: 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
                    y: startY,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                });
            });

            //rows
            recordatorios.forEach((recordatorio, index) => {
                const y = startY - cellHeight * (index + 1);
                
                page.drawText(recordatorio.medicamentos.nombre || 'N/A', {
                    x: 50,
                    y,
                    size: 10,
                    font,
                });
                
                page.drawText(recordatorio.medicamentos.descripcion || 'N/A', {
                    x: 150,
                    y,
                    size: 10,
                    font,
                });
                
                page.drawText(recordatorio.usuario.name || 'N/A', {
                    x: 300,
                    y,
                    size: 10,
                    font,
                });
                
                page.drawText(formatearFecha(recordatorio.inicio), {
                    x: 400,
                    y,
                    size: 10,
                    font,
                });
                
                page.drawText(formatearFecha(recordatorio.fin), {
                    x: 500,
                    y,
                    size: 10,
                    font,
                });
            });

            // Guardar PDF
            const pdfBytes = await pdfDoc.save();
            
            // Descargar PDF
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Reporte_Recordatorios_Medicamentos.pdf';
            link.click();

            setShowPDFModal(false);
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Hubo un error al generar el PDF');
        }
    };

    const renderPaginationItems = () => {
        const totalPages = Math.ceil(recordatorios.length / itemsPerPage);
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => setCurrentPage(number)}
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
                        <Col className="text-end">
                            <Button onClick={() => setShowPDFModal(true)} variant="success">
                                Generar PDF
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
                                            <th>Medicamento</th>
                                            <th>Nombre del Cuidador</th>
                                            <th>Fecha de Inicio</th>
                                            <th>Fecha de Fin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecordatorios.map((recordatorio, index) => (
                                            <tr key={recordatorio._id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{recordatorio.medicamentos.nombre}</td>
                                                <td>{recordatorio.usuario.name}</td>
                                                <td>{formatearFecha(recordatorio.inicio)}</td>
                                                <td>{formatearFecha(recordatorio.fin)}</td>
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
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="page-link"
                                >
                                    Anterior
                                </Pagination.Prev>
                                {renderPaginationItems()}
                                <Pagination.Next
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(recordatorios.length / itemsPerPage)}
                                    className="page-link"
                                >
                                    Siguiente
                                </Pagination.Next>
                            </Pagination>
                        </Col>
                    </Row>

                    {/* Modal de Confirmación de PDF */}
                    <Modal show={showPDFModal} onHide={() => setShowPDFModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Generar Reporte PDF</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Está seguro que desea generar un reporte PDF de los recordatorios?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPDFModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={generarPDF}>
                                Generar PDF
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Container>
        </>
    );
};

export default RecordatoriosAdmin;