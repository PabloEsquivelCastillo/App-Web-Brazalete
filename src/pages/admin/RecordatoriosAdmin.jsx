import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Pagination, Modal, Form, Badge, Card } from 'react-bootstrap';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import '../../css/Tablas.css';
import '../../css/Paginacion.css';
import LateralAdmin from "../../components/LateralAdmin";
import { obtenerRecordatorios, getHistoryReminderByIdReminder } from "../../Logica/Recordatorios";
import Navbar from "../../components/Navbar";

// Date formatting function
const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    
    const fecha = new Date(fechaString);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
};

const RecordatoriosAdmin = () => {
    const [recordatorios, setRecordatorios] = useState([]);
    const [filteredRecordatorios, setFilteredRecordatorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el modal de historial de desactivaciones
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const [historialActual, setHistorialActual] = useState([]);
    const [recordatorioSeleccionado, setRecordatorioSeleccionado] = useState(null);

    // Filtering states
    const [nombreMedicamento, setNombreMedicamento] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [filtroCronico, setFiltroCronico] = useState('todos'); // 'todos', 'cronico', 'no-cronico'

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // PDF Modal state
    const [showPDFModal, setShowPDFModal] = useState(false);

    useEffect(() => {
        const cargarRecordatorios = async () => {
            try {
                const data = await obtenerRecordatorios();
                setRecordatorios(data);
                setFilteredRecordatorios(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        cargarRecordatorios();
    }, []);

    // Función para abrir el modal de historial
    const mostrarHistorial = async (recordatorio) => {
        try {
            setRecordatorioSeleccionado(recordatorio);
            setLoading(true);
            
            // Verificar si id_recordatorio es un número y convertirlo
            const idRecordatorio = typeof recordatorio._id === 'string' ? 
                parseInt(recordatorio._id) : recordatorio._id;
            
            console.log(`Obteniendo historial para recordatorio ID: ${idRecordatorio}`);
            
            const historialData = await getHistoryReminderByIdReminder(idRecordatorio);
            
            // Ordenar el historial por fecha de creación (más reciente primero)
            const historialOrdenado = historialData.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            setHistorialActual(historialOrdenado);
            setShowHistorialModal(true);
            setLoading(false);
        } catch (err) {
            console.error(`Error al obtener historial para recordatorio:`, err);
            setLoading(false);
            // Mostrar un mensaje de error o un toast
            alert('Error al cargar el historial de desactivaciones');
        }
    };

    // Filtering function
    const aplicarFiltros = () => {
        let filtered = recordatorios.filter(recordatorio => {
            const matchNombre = nombreMedicamento 
                ? recordatorio.medicamentos?.nombre?.toLowerCase().includes(nombreMedicamento.toLowerCase()) 
                : true;
            
            const matchFechaInicio = fechaInicio 
                ? new Date(recordatorio.inicio) >= new Date(fechaInicio) 
                : true;
            
            const matchFechaFin = fechaFin 
                ? new Date(recordatorio.inicio) <= new Date(fechaFin) 
                : true;
            
            const matchCronico = filtroCronico === 'todos' 
                ? true 
                : filtroCronico === 'cronico' 
                    ? recordatorio.cronico 
                    : !recordatorio.cronico;
            
            return matchNombre && matchFechaInicio && matchFechaFin && matchCronico;
        });

        setFilteredRecordatorios(filtered);
        setCurrentPage(1);
    };

    // Reset filters
    const resetFiltros = () => {
        setNombreMedicamento('');
        setFechaInicio('');
        setFechaFin('');
        setFiltroCronico('todos');
        setFilteredRecordatorios(recordatorios);
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecordatorios = filteredRecordatorios.slice(indexOfFirstItem, indexOfLastItem);

    // PDF Generation
    const generarPDF = async () => {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([700, 850]); // Aumentar el ancho de la página
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
            const margin = 50;
            const headerSize = 16;
            const bodySize = 9; // Reducir un poco la fuente
            const lineHeight = 15;
            const tableRowHeight = 22;
    
            // Columnas con más espacio
            const columns = [
                { title: 'Medicamento', width: 140, maxChars: 25 },
                { title: 'Cuidador', width: 100, maxChars: 15 },
                { title: 'Inicio', width: 120 },
                { title: 'Fin', width: 120 },
                { title: 'Tipo', width: 80 }
            ];
    
            // Función para truncar textos largos
            const truncateText = (text, maxWidth) => {
                if (!text) return 'N/A';
                while (font.widthOfTextAtSize(text, bodySize) > maxWidth && text.length > 3) {
                    text = text.substring(0, text.length - 4) + '...';
                }
                return text;
            };
    
            // Título principal centrado
            const title = 'Reporte de Recordatorios';
            const titleWidth = boldFont.widthOfTextAtSize(title, headerSize);
            page.drawText(title, {
                x: (width - titleWidth) / 2,
                y: height - margin,
                size: headerSize,
                font: boldFont,
                color: rgb(0, 0, 0),
            });
    
            // Información de generación
            const fechaGeneracion = `Generado el: ${new Date().toLocaleString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })}`;
            page.drawText(fechaGeneracion, {
                x: margin,
                y: height - margin - lineHeight * 2,
                size: bodySize,
                font,
                color: rgb(0.3, 0.3, 0.3),
            });
    
            // Tabla de encabezados
            let currentY = height - margin - lineHeight * 4;
            let currentX = margin;
            columns.forEach(column => {
                page.drawText(column.title, {
                    x: currentX,
                    y: currentY,
                    size: bodySize,
                    font: boldFont,
                    color: rgb(0, 0, 0),
                });
                currentX += column.width;
            });
    
            // Línea divisoria
            page.drawLine({
                start: { x: margin, y: currentY - 5 },
                end: { x: width - margin, y: currentY - 5 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
    
            currentY -= tableRowHeight;
    
            // Dibujar filas con datos
            filteredRecordatorios.forEach(recordatorio => {
                if (currentY < margin * 2) {
                    page.drawText('-- Continúa en la siguiente página --', {
                        x: margin,
                        y: currentY,
                        size: bodySize,
                        font,
                        color: rgb(0.5, 0.5, 0.5),
                    });
    
                    currentY = height - margin - lineHeight;
    
                    // Dibujar encabezados en la nueva página
                    currentX = margin;
                    columns.forEach(column => {
                        page.drawText(column.title, {
                            x: currentX,
                            y: currentY,
                            size: bodySize,
                            font: boldFont,
                            color: rgb(0, 0, 0),
                        });
                        currentX += column.width;
                    });
    
                    currentY -= tableRowHeight;
                }
    
                // Dibujar datos de cada fila
                const data = [
                    truncateText(recordatorio.medicamentos?.nombre, columns[0].width),
                    truncateText(recordatorio.usuario?.name, columns[1].width),
                    formatearFecha(recordatorio.inicio),
                    formatearFecha(recordatorio.fin),
                    recordatorio.cronico ? 'Crónico' : 'Temporal'
                ];
    
                currentX = margin;
                data.forEach((text, index) => {
                    page.drawText(text, {
                        x: currentX,
                        y: currentY,
                        size: bodySize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                    currentX += columns[index].width;
                });
    
                currentY -= tableRowHeight;
            });
    
            // Pie de página
            page.drawText(`Total de recordatorios: ${filteredRecordatorios.length}`, {
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
            link.download = `Reporte_Recordatorios_${new Date().toISOString().slice(0, 10)}.pdf`;
            link.click();
    
            setShowPDFModal(false);
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Hubo un error al generar el PDF');
        }
    };
    
    // Pagination rendering
    const renderPaginationItems = () => {
        const totalPages = Math.ceil(filteredRecordatorios.length / itemsPerPage);
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
                    </Row>

                    {/* Filtros */}
                    <Row className="mb-3">
                        <Col md={2}>
                            <Form.Control 
                                type="text" 
                                placeholder="Nombre del Medicamento"
                                value={nombreMedicamento}
                                onChange={(e) => setNombreMedicamento(e.target.value)}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Control 
                                type="datetime-local" 
                                placeholder="Fecha Inicio"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Control 
                                type="datetime-local" 
                                placeholder="Fecha Fin"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={filtroCronico}
                                onChange={(e) => setFiltroCronico(e.target.value)}
                            >
                                <option value="todos">Todos los tipos</option>
                                <option value="cronico">Solo crónicos</option>
                                <option value="no-cronico">Solo temporales</option>
                            </Form.Select>
                        </Col>
                        <Col md={4} className="d-flex align-items-center">
                            <Button onClick={aplicarFiltros} variant="primary" className="d-flex align-items-center gap-2 add-medicamento-btn me-2">
                                Filtrar
                            </Button>
                            <Button onClick={resetFiltros} variant="secondary" className="d-flex align-items-center gap-2 add-medicamento-btn me-2">
                                Limpiar
                            </Button>
                            <Button onClick={() => setShowPDFModal(true)} variant="success" className="d-flex align-items-center gap-2 add-medicamento-btn">
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
                                            <th>Cuidador</th>
                                            <th>Inicio</th>
                                            <th>Fin</th>
                                            <th>Tipo</th>
                                            <th>Historial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecordatorios.map((recordatorio, index) => (
                                            <tr key={recordatorio._id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{recordatorio.medicamentos?.nombre || 'N/A'}</td>
                                                <td>{recordatorio.usuario?.name || 'N/A'}</td>
                                                <td>{formatearFecha(recordatorio.inicio)}</td>
                                                <td>{formatearFecha(recordatorio.fin)}</td>
                                                <td>
                                                    <Badge bg={recordatorio.cronico ? 'info' : 'secondary'} 
                                                          className="text-capitalize">
                                                        {recordatorio.cronico ? 'Crónico' : 'Temporal'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="outline-info" 
                                                        size="sm"
                                                        onClick={() => mostrarHistorial(recordatorio)}
                                                    >
                                                        Ver historial
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>

                    {/* Paginación - Alineada a la derecha */}
                    {filteredRecordatorios.length > itemsPerPage && (
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
                                        disabled={currentPage === Math.ceil(filteredRecordatorios.length / itemsPerPage)}
                                        className="page-link"
                                    >
                                        Siguiente
                                    </Pagination.Next>
                                </Pagination>
                            </Col>
                        </Row>
                    )}

                    {/* Modal del Historial de Desactivaciones */}
                    <Modal 
                        show={showHistorialModal} 
                        onHide={() => setShowHistorialModal(false)}
                        size="lg"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Historial de Desactivaciones 
                                {recordatorioSeleccionado && (
                                    <span> - {recordatorioSeleccionado.medicamentos?.nombre}</span>
                                )}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {historialActual.length > 0 ? (
                                <div className="historial-container">
                                    {historialActual.map((item, index) => (
                                        <Card key={index} className="mb-3">
                                            <Card.Header className="d-flex justify-content-between">
                                                <span>Desactivación #{index + 1}</span>
                                                <Badge bg="info">
                                                    {item.timeout ? `Tiempo de espera: ${item.timeout} segundos` : 'Sin tiempo registrado'}
                                                </Badge>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    <strong>Fecha y hora:</strong> {formatearFecha(item.createdAt)}
                                                </Card.Text>
                                                {item.nombre_paciente && (
                                                    <Card.Text>
                                                        <strong>Paciente:</strong> {item.nombre_paciente}
                                                    </Card.Text>
                                                )}
                                                {item.cronico !== undefined && (
                                                    <Card.Text>
                                                        <strong>Tipo:</strong> {item.cronico ? 'Crónico' : 'Temporal'}
                                                    </Card.Text>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center">No hay registros de desactivaciones para este recordatorio.</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowHistorialModal(false)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de Confirmación de PDF */}
                    <Modal show={showPDFModal} onHide={() => setShowPDFModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Generar Reporte PDF</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Seguro que desea generar un reporte PDF con {filteredRecordatorios.length} recordatorios?
                            <br/>
                            <small className="text-muted">El PDF incluirá todos los recordatorios que coincidan con los filtros que aplique.</small>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" className="d-flex align-items-center gap-2 add-medicamento-btn" onClick={() => setShowPDFModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={generarPDF} className="d-flex align-items-center gap-2 add-medicamento-btn">
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