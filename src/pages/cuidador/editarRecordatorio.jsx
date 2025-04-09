import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form as BootstrapForm, Button, Alert, FormCheck } from 'react-bootstrap';
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../../api/axiosConfig";
import { actualizarRecordatorio } from "../../Logica/Recordatorios";
import { obtenerMedicamentos } from "../../Logica/Medicamentos";
import { getBraceletsByUser } from "../../Logica/Brazaletes";
import "../../css/Login.css";

const EditarRecordatorio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [medicamentos, setMedicamentos] = useState([]);
    const [brazaletes, setBrazaletes] = useState([]);
    const [serverError, setServerError] = useState('');
    const [initialValues, setInitialValues] = useState({
        id_medicamento: '',
        inicio: '',
        fin: '',
        time: '',
        id_usuario: user?.id || '',
        id_pulsera: '',
        cronico: false,
        nombre_paciente: user?.name || '',
        edo: true
    });

    const validationSchema = Yup.object().shape({
        id_medicamento: Yup.string().required("Seleccione un medicamento"),
        inicio: Yup.date().required("Fecha de inicio es obligatoria"),
        fin: Yup.date()
            .min(Yup.ref('inicio'), "Fecha de fin debe ser posterior a la fecha de inicio")
            .required("Fecha de fin es obligatoria"),
        time: Yup.number()
            .typeError("Debe ser un número válido")
            .positive("El intervalo debe ser positivo")
            .integer("Debe ser un número entero")
            .max(24, "El intervalo máximo es 24 horas (1 día)")
            .required("Intervalo de tomas es obligatorio"),
        id_pulsera: Yup.string()
            .required("Seleccione un brazalete")
            .test(
                'has-bracelets',
                'No hay brazaletes disponibles',
                () => brazaletes.length > 0
            ),
        nombre_paciente: Yup.string().required("Nombre de paciente es requerido"),
        cronico: Yup.boolean().required("Estado crónico es requerido")
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                setServerError('');

                // Check if user is authenticated
                if (!user || !user.id) {
                    navigate('/login');
                    return;
                }
        
                // Cargar lista de medicamentos y brazaletes
                const [medicamentosData, braceletsData, recordatorioRes] = await Promise.all([
                    obtenerMedicamentos(),
                    getBraceletsByUser(user.id),
                    axiosInstance.get(`/reminder/${id}`)
                ]);

                setMedicamentos(medicamentosData);
                setBrazaletes(braceletsData);
                
                // Formatear fechas para el campo de formulario
                const recordatorio = recordatorioRes.data;
                setInitialValues({
                    id_medicamento: recordatorio.id_medicamento || '',
                    inicio: recordatorio.inicio ? new Date(recordatorio.inicio).toISOString().slice(0, 16) : '',
                    fin: recordatorio.fin ? new Date(recordatorio.fin).toISOString().slice(0, 16) : '',
                    time: recordatorio.time || '',
                    id_usuario: user?.id || '',
                    id_pulsera: recordatorio.id_pulsera || '',
                    cronico: recordatorio.cronico || false,
                    nombre_paciente: recordatorio.nombre_paciente || user?.name || '',
                    edo: true
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar los datos: ", error);
                
                // Check for authentication errors
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setServerError(error.response?.data?.error || "Error al cargar los datos del recordatorio");
                }
                
                setLoading(false);
            }
        };
        
        cargarDatos();
    }, [id, user, navigate]);

    const handleNumberInput = (e, setFieldValue, fieldName) => {
        const value = e.target.value;
        if (value === '' || (/^[0-9\b]+$/.test(value) && (value === '' || (parseInt(value) > 0 && parseInt(value) <= 24)))) {
            setFieldValue(fieldName, value);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setServerError('');
        try {
            const payload = {
                id_medicamento: values.id_medicamento,
                id_usuario: values.id_usuario,
                id_pulsera: values.id_pulsera,
                nombre_paciente: values.nombre_paciente,
                inicio: new Date(values.inicio).toISOString(),
                fin: new Date(values.fin).toISOString(),
                time: Number(values.time),
                cronico: Boolean(values.cronico),
                edo: true
            };

            await actualizarRecordatorio(id, payload);
            
            toast.success("Recordatorio actualizado correctamente");
            navigate("/cuidador/Recordatorios");
        } catch (error) {
            console.error("Error al actualizar el recordatorio:", error);
            
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setServerError(error.response?.data?.error || "Error al actualizar el recordatorio");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container fluid className="login-page d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="login-page d-flex justify-content-center align-items-center">
            <Row className="login-container shadow-lg">
                <Col md={12} className="login-form p-4">
                    <Button onClick={() => navigate(-1)} className="volver-btn">
                        <IoIosArrowBack className="back-icon" /> Volver
                    </Button>
                    <h1 className="login-title text-center mb-4">Editar Recordatorio</h1>

                    {serverError && <Alert variant="danger" className="mb-4">{serverError}</Alert>}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, errors, values, setFieldValue }) => (
                            <Form>
                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Medicamento</BootstrapForm.Label>
                                    <Field
                                        as={BootstrapForm.Select}
                                        name="id_medicamento"
                                        className={`form-control ${errors.id_medicamento ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Seleccionar Medicamento</option>
                                        {medicamentos.map((med) => (
                                            <option key={med._id} value={med._id}>
                                                {med.nombre}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="id_medicamento" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Brazalete</BootstrapForm.Label>
                                    <Field
                                        as={BootstrapForm.Select}
                                        name="id_pulsera"
                                        className={`form-control ${errors.id_pulsera ? 'is-invalid' : ''}`}
                                        disabled={brazaletes.length === 0}
                                    >
                                        <option value="">Seleccionar Brazalete</option>
                                        {brazaletes.length > 0 ? (
                                            brazaletes.map((brazalete) => (
                                                <option key={brazalete._id} value={brazalete._id}>
                                                    {brazalete.nombre || `Brazalete ${brazalete._id}`}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No hay brazaletes disponibles</option>
                                        )}
                                    </Field>
                                    <ErrorMessage name="id_pulsera" component="div" className="text-danger" />
                                    {brazaletes.length === 0 && (
                                        <small className="text-danger">No tienes brazaletes asignados. Contacta al administrador.</small>
                                    )}
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Fecha y Hora de Inicio</BootstrapForm.Label>
                                    <Field
                                        type="datetime-local"
                                        name="inicio"
                                        className={`form-control ${errors.inicio ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="inicio" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Fecha y Hora de Fin</BootstrapForm.Label>
                                    <Field
                                        type="datetime-local"
                                        name="fin"
                                        className={`form-control ${errors.fin ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="fin" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Intervalo de Tomas (Horas) - Máximo 24</BootstrapForm.Label>
                                    <input
                                        type="text"
                                        name="time"
                                        className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                                        value={values.time}
                                        onChange={(e) => handleNumberInput(e, setFieldValue, 'time')}
                                        onKeyDown={(e) => {
                                            if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="Ej: 8 (horas)"
                                        maxLength="2"
                                    />
                                    <ErrorMessage name="time" component="div" className="text-danger" />
                                    <small className="text-muted">El intervalo máximo es 24 horas (1 día completo)</small>
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3 d-flex align-items-center">
                                    <FormCheck
                                        type="switch"
                                        id="cronico-switch"
                                        label="Recordatorio crónico"
                                        checked={values.cronico}
                                        onChange={(e) => setFieldValue('cronico', e.target.checked)}
                                        className="me-2"
                                    />
                                    <small className="text-muted">
                                        {values.cronico ? 'Este recordatorio es crónico' : 'Este recordatorio no es crónico'}
                                    </small>
                                </BootstrapForm.Group>

                                <Field type="hidden" name="nombre_paciente" />
                                <Field type="hidden" name="id_usuario" />
                                <Field type="hidden" name="edo" />

                                <div className="text-center mt-4">
                                    <Button
                                        type="submit"
                                        className="perfil-button"
                                        disabled={isSubmitting || brazaletes.length === 0}
                                    >
                                        {isSubmitting ? 'Actualizando...' : 'Actualizar Recordatorio'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarRecordatorio;