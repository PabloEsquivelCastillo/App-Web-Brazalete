import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Container, Row, Col, Form as BootstrapForm, Button, Alert, FormCheck } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import { crearRecordatorio } from "../../Logica/Recordatorios";
import { obtenerMedicamentos } from "../../Logica/Medicamentos";
import { toast } from "react-toastify"; // Asegúrate de que toast esté importado
import { getBraceletsByUser } from "../../Logica/Brazaletes";
import "../../css/Login.css";

const RegistrarRecordatorio = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [medicamentos, setMedicamentos] = useState([]);
    const [brazaletes, setBrazaletes] = useState([]);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(true);
    const formRef = useRef(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const [medsData, braceletsData] = await Promise.all([
                    obtenerMedicamentos(),
                    user?.id ? getBraceletsByUser(user.id) : Promise.resolve([])
                ]);
                setMedicamentos(medsData);
                setBrazaletes(braceletsData);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setServerError("Error al cargar los datos necesarios");
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [user?.id]);

    const initialValues = {
        id_medicamento: '',
        inicio: '',
        fin: '',
        time: '',
        id_usuario: user?.id || '',
        id_pulsera: '',
        cronico: false,
        nombre_paciente: user?.name || '',
        edo: true,
        timeout: false
    };

    // Modified validation schema to make fin conditional on cronico
    const validationSchema = Yup.object().shape({
        id_medicamento: Yup.string().required("Seleccione un medicamento"),
        inicio: Yup.date()
            .min(new Date(), "La fecha de inicio no puede ser anterior a la fecha actual")
            .required("Fecha de inicio es obligatoria"),
        fin: Yup.date()
            .when('cronico', {
                is: false,
                then: () => Yup.date()
                    .min(Yup.ref('inicio'), "Fecha de fin debe ser posterior a la fecha de inicio")
                    .required("Fecha de fin es obligatoria"),
                otherwise: () => Yup.date().nullable()
            }),
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

    // Function to manually trigger form submission
    const submitForm = (formikProps) => {
        console.log("Manual form submission triggered");
        if (formikProps.isValid) {
            console.log("Form is valid, proceeding with submission");
            formikProps.handleSubmit();
        } else {
            console.log("Form validation failed:", formikProps.errors);
            // Touch all fields to show errors
            Object.keys(formikProps.values).forEach((field) => {
                formikProps.setFieldTouched(field, true);
            });
            setServerError("Por favor, corrige los errores del formulario");
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log("Iniciando envío del formulario", values);
        setServerError('');
        
        try {
            const payload = {
                id_medicamento: values.id_medicamento,
                id_usuario: values.id_usuario,
                id_pulsera: values.id_pulsera,
                nombre_paciente: values.nombre_paciente,
                inicio: new Date(values.inicio).toISOString(),
                time: Number(values.time),
                cronico: Boolean(values.cronico),
                edo: true,
                timeout: false
            };
            
            // Only include end date if not chronic
            if (!values.cronico && values.fin) {
                payload.fin = new Date(values.fin).toISOString();
            }
            
            console.log("Enviando payload:", payload);
            const response = await crearRecordatorio(payload);
            console.log("Respuesta recibida:", response);
            
            toast.success("Recordatorio creado exitosamente!");
            navigate("/cuidador/Recordatorios");
        } catch (error) {
            console.error("Error completo:", error);
            const errorMessage = error.response?.data?.error || "Error al crear recordatorio";
            console.log("Mensaje de error:", errorMessage);
            setServerError(errorMessage);
            
            // Mostrar alert para depuración
            alert("Error al crear recordatorio: " + errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNumberInput = (e, setFieldValue, fieldName) => {
        const value = e.target.value;
        if (value === '' || (/^[0-9\b]+$/.test(value) && (value === '' || (parseInt(value) > 0 && parseInt(value) <= 24)))) {
            setFieldValue(fieldName, value);
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
                    <h1 className="login-title text-center mb-3">Registrar Recordatorio</h1>

                    {serverError && <Alert variant="danger" className="mb-3">{serverError}</Alert>}

                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(formikProps) => (
                            <Form className="compact-form">
                                <BootstrapForm.Group className="mb-2">
                                    <BootstrapForm.Label htmlFor="nombre_paciente" className="mb-1">Nombre del Paciente</BootstrapForm.Label>
                                    <Field
                                        id="nombre_paciente"
                                        type="text"
                                        name="nombre_paciente"
                                        className={`form-control form-control-sm ${formikProps.errors.nombre_paciente && formikProps.touched.nombre_paciente ? 'is-invalid' : ''}`}
                                        placeholder="Ingrese el nombre del paciente"
                                    />
                                    <ErrorMessage name="nombre_paciente" component="div" className="text-danger small" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-2">
                                    <BootstrapForm.Label htmlFor="id_medicamento" className="mb-1">Medicamento</BootstrapForm.Label>
                                    <Field
                                        id="id_medicamento"
                                        as={BootstrapForm.Select}
                                        name="id_medicamento"
                                        className={`form-control form-control-sm ${formikProps.errors.id_medicamento && formikProps.touched.id_medicamento ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Seleccionar Medicamento</option>
                                        {medicamentos.map((med) => (
                                            <option key={med._id} value={med._id}>
                                                {med.nombre}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="id_medicamento" component="div" className="text-danger small" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-2">
                                    <BootstrapForm.Label htmlFor="id_pulsera" className="mb-1">Brazalete</BootstrapForm.Label>
                                    <Field
                                        id="id_pulsera"
                                        as={BootstrapForm.Select}
                                        name="id_pulsera"
                                        className={`form-control form-control-sm ${formikProps.errors.id_pulsera && formikProps.touched.id_pulsera ? 'is-invalid' : ''}`}
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
                                    <ErrorMessage name="id_pulsera" component="div" className="text-danger small" />
                                    {brazaletes.length === 0 && (
                                        <small className="text-danger">No tienes brazaletes asignados. Contacta al administrador.</small>
                                    )}
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-2">
                                    <BootstrapForm.Label htmlFor="inicio" className="mb-1">Fecha y Hora de Inicio</BootstrapForm.Label>
                                    <Field
                                        id="inicio"
                                        type="datetime-local"
                                        name="inicio"
                                        className={`form-control form-control-sm ${formikProps.errors.inicio && formikProps.touched.inicio ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="inicio" component="div" className="text-danger small" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-2 d-flex align-items-center">
                                    <FormCheck
                                        type="switch"
                                        id="cronico-switch"
                                        label="Recordatorio crónico"
                                        checked={formikProps.values.cronico}
                                        onChange={(e) => {
                                            formikProps.setFieldValue('cronico', e.target.checked);
                                            // If chronic is turned on, clear the end date
                                            if (e.target.checked) {
                                                formikProps.setFieldValue('fin', '');
                                            }
                                        }}
                                        className="me-2"
                                    />
                                </BootstrapForm.Group>

                                {/* End date field - only shown if not chronic */}
                                {!formikProps.values.cronico && (
                                    <BootstrapForm.Group className="mb-2">
                                        <BootstrapForm.Label htmlFor="fin" className="mb-1">Fecha y Hora de Fin</BootstrapForm.Label>
                                        <Field
                                            id="fin"
                                            type="datetime-local"
                                            name="fin"
                                            className={`form-control form-control-sm ${formikProps.errors.fin && formikProps.touched.fin ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage name="fin" component="div" className="text-danger small" />
                                    </BootstrapForm.Group>
                                )}

                                <BootstrapForm.Group className="mb-2">
                                    <BootstrapForm.Label htmlFor="time" className="mb-1">
                                        {formikProps.values.cronico 
                                            ? "Intervalo de Tomas (Horas) - Máximo 24" 
                                            : "Intervalo de Tomas (Horas) - Máximo 24"}
                                    </BootstrapForm.Label>
                                    <input
                                        id="time"
                                        type="text"
                                        name="time"
                                        className={`form-control form-control-sm ${formikProps.errors.time && formikProps.touched.time ? 'is-invalid' : ''}`}
                                        value={formikProps.values.time}
                                        onChange={(e) => handleNumberInput(e, formikProps.setFieldValue, 'time')}
                                        onKeyDown={(e) => {
                                            if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="Ej: 8 (horas)"
                                        maxLength="2"
                                    />
                                    <ErrorMessage name="time" component="div" className="text-danger small" />
                                    <small className="text-muted">
                                        {formikProps.values.cronico 
                                            ? "Para los recordatorios crónicos, las dosis se repetirán según las horas que asignes " 
                                            : "El intervalo máximo es 24 horas"}
                                    </small>
                                </BootstrapForm.Group>

                                <Field type="hidden" name="id_usuario" />
                                <Field type="hidden" name="edo" />
                                <Field type="hidden" name="timeout" />

                                <div className="text-center mt-3">
                                    <Button
                                        type="button"
                                        className="perfil-button"
                                        disabled={formikProps.isSubmitting || brazaletes.length === 0}
                                        onClick={() => {
                                            console.log("Botón registrar clickeado");
                                            if (brazaletes.length === 0) {
                                                setServerError("No hay brazaletes disponibles para crear un recordatorio");
                                                return;
                                            }
                                            submitForm(formikProps);
                                        }}
                                    >
                                        {formikProps.isSubmitting ? 'Registrando...' : 'Registrar Recordatorio'}
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

export default RegistrarRecordatorio;