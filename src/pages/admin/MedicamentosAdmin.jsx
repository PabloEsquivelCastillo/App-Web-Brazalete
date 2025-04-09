import React, { useEffect, useState } from "react";
import { eliminarMedicamento, obtenerMedicamentos } from "../../Logica/Medicamentos";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { IoChevronBackSharp } from "react-icons/io5";
import { RiMedicineBottleLine } from "react-icons/ri";
import { Container, Row, Col, Table, Pagination, Button } from 'react-bootstrap';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
    const [itemsPerPage] = useState(7);

    useEffect(() => {
        obtenerMedicamentos()
            .then((data) => {
                setMedicamentos(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/EditarMedicamento/${id}`);
    };

    const handleDesactivate = (id) => {
        eliminarMedicamento(id);
        setMedicamentos(medicamentos.filter(m => m._id !== id));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMedicamentos = medicamentos.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(medicamentos.length / itemsPerPage);

    const generatePDF = async () => {
        try {
            const pdfDoc = await PDFDocument.create();
            let page = pdfDoc.addPage([600, 800]); 
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
            // Configuración de estilos
            const margin = 50;
            const headerSize = 18;
            const bodySize = 10;
            const lineHeight = 20;
            const tableRowHeight = 20;
    
            // Título principal
            const mainTitleText = 'Reporte de Medicamentos';
            const mainTitleWidth = boldFont.widthOfTextAtSize(mainTitleText, headerSize);
            page.drawText(mainTitleText, {
                x: (width - mainTitleWidth) / 2,
                y: height - margin,
                size: headerSize,
                font: boldFont,
                color: rgb(0, 0, 0),
            });
    
            // Información de generación
            const fechaGeneracion = new Date().toLocaleString('es-ES', {
                year: 'numeric', 
                month: 'numeric', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            page.drawText(`Generado el: ${fechaGeneracion}`, {
                x: margin,
                y: height - margin - (lineHeight * 1.5),
                size: bodySize,
                font,
                color: rgb(0.3, 0.3, 0.3),
            });
    
            // Configuración de columnas con anchos más generosos
            const columns = [
                { title: '#', width: 50 },
                { title: 'Nombre Genérico', width: 200 },
                { title: 'Descripción', width: 350 }
            ];
    
            // Dibujar encabezados de tabla
            const tableTop = height - margin - (lineHeight * 3);
            let currentX = margin;
            columns.forEach(column => {
                page.drawText(column.title, {
                    x: currentX,
                    y: tableTop,
                    size: bodySize,
                    font: boldFont,
                    color: rgb(0, 0, 0),
                });
                currentX += column.width;
            });
    
            // Línea divisoria debajo de los encabezados
            page.drawLine({
                start: { x: margin, y: tableTop - 5 },
                end: { x: width - margin, y: tableTop - 5 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
    
            // Dibujar datos de la tabla
            let currentY = tableTop - lineHeight;
            medicamentos.forEach((medicamento, index) => {
                // Verificar si necesitamos una nueva página
                if (currentY < margin) {
                    page = pdfDoc.addPage([600, 800]);
                    currentY = height - margin - lineHeight;
                    
                    // Redibujar encabezados
                    let newX = margin;
                    columns.forEach(column => {
                        page.drawText(column.title, {
                            x: newX,
                            y: currentY,
                            size: bodySize,
                            font: boldFont,
                            color: rgb(0, 0, 0),
                        });
                        newX += column.width;
                    });
                    
                    currentY -= lineHeight;
                }
    
                // Dibujar cada fila de datos
                page.drawText(`${index + 1}`, {
                    x: margin,
                    y: currentY,
                    size: bodySize,
                    font,
                    maxWidth: columns[0].width
                });
                
                page.drawText(medicamento.nombre, {
                    x: margin + columns[0].width,
                    y: currentY,
                    size: bodySize,
                    font,
                    maxWidth: columns[1].width
                });
                
                page.drawText(medicamento.description || 'Sin descripción', {
                    x: margin + columns[0].width + columns[1].width,
                    y: currentY,
                    size: bodySize,
                    font,
                    maxWidth: columns[2].width
                });
    
                // Dibujar línea separadora entre filas
                page.drawLine({
                    start: { x: margin, y: currentY - 5 },
                    end: { x: width - margin, y: currentY - 5 },
                    thickness: 0.5,
                    color: rgb(0.8, 0.8, 0.8),
                });
    
                currentY -= tableRowHeight;
            });
    
            // Pie de página con total de medicamentos
            page.drawText(`Total de medicamentos: ${medicamentos.length}`, {
                x: margin,
                y: margin / 2,
                size: bodySize,
                font: boldFont,
                color: rgb(0, 0, 0),
            });
    
            const pdfBytes = await pdfDoc.save();
            
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Reporte_Medicamentos_${new Date().toISOString().slice(0, 10)}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Hubo un error al generar el PDF');
        }
    };



    return (
        <>
            <Navbar />
            <LateralAdmin />
            <Container fluid className="d-flex">
                <div className="contenedor">
                    <Row className="mb-3 header-content">
                        <Col><h1 className="title">Medicamentos</h1></Col>
                        <Col className="d-flex justify-content-end gap-2">
                            <Button variant="success" onClick={() => navigate("/admin/RegistrarMedicamento")} className="d-flex align-items-center gap-2 add-medicamento-btn">
                                <img src={iconMed} alt="Mi Icono" style={{ width: '30px', height: '30px' }} /> Añadir Medicamento
                            </Button>
                            <Button variant="primary" onClick={generatePDF} className="d-flex align-items-center gap-2 add-medicamento-btn">
                                Generar PDF
                            </Button>
                        </Col>
                    </Row>
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
                                                    <Button variant="none" size="sm" onClick={() => handleEdit(medicamento._id)} className="btn-editar">
                                                        <FaRegEdit /> <span className="btn-text">Editar</span>
                                                    </Button>
                                                    <Button variant="none" size="sm" onClick={() => handleDesactivate(medicamento._id)} className="btn-eliminar">
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
                    <Row>
                        <Col className="d-flex justify-content-end">
                            <Pagination className="custom-pagination">
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><IoChevronBackSharp /> Anterior</Pagination.Prev>
                                {[...Array(totalPages).keys()].map(number => (
                                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente <MdNavigateNext /></Pagination.Next>
                            </Pagination>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
};

export default MedicamentosAdmin;
