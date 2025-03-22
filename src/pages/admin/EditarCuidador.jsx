import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { actualizarCuidador } from "../../Logica/FuncionesAdmin";
import { toast } from "react-toastify";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { Container, Row, Col, Form as BootstrapForm, Button, Alert } from 'react-bootstrap';
import '../../css/Login.css';

const EditarCuidador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        name: '',
        phone: ''
    });

    const validation = Yup.object({
        name: Yup.string()
            .min(2, "Muy corto")
            .max(50, "Menor a 50 caracteres")
            .required("Nombre obligatorio"),
        phone: Yup.string()
            .min(3, "Mínimo 3 caracteres")
            .max(12, "Máximo 12 caracteres")
            .required("Teléfono obligatorio"),
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await axiosInstance.get(`/user/${id}`);
                setInitialValues(response.data);
                console.log("Usuario datos: ", response.data);
            } catch (error) {
                console.error("Error al cargar los datos: ", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [id]);

    const handleSubmit = async (values) => {
        try {
            await actualizarCuidador(id, values);
            console.log(values);
            toast.success("Cuidador actualizado correctamente");
            navigate(`/admin/cuidadoresActivos`);
        } catch (error) {
            console.error("Error al actualizar el cuidador:", error);
            toast.error("Error al actualizar el cuidador");
        }
    };

    if (loading) return <p>Cargando datos del cuidador...</p>;

    return (
        <Container fluid className="login-page d-flex justify-content-center align-items-center">
            <Row className="login-container shadow-lg">
                <Col md={12} className="login-form p-4">
                    {/* Ícono de volver */}
                    <Button  onClick={() => navigate(-1)} className="volver-btn" >
                    <IoIosArrowBack className="back-icon"  style={{  width: "20px", height: "20px"}}/> Volver
                    </Button>
                    {/* Título del formulario */}
                    <h1 className="login-title text-center mb-4">Editar Cuidador</h1>

                    {/* Formulario */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validation}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, errors }) => (
                            <Form>
                                {/* Campo de Nombre */}
                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Nombre</BootstrapForm.Label>
                                    <Field
                                        type="text"
                                        name="name"
                                        as={BootstrapForm.Control}
                                        placeholder="Ingresa el nombre"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                {/* Campo de Teléfono */}
                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Teléfono</BootstrapForm.Label>
                                    <Field
                                        type="text"
                                        name="phone"
                                        as={BootstrapForm.Control}
                                        placeholder="Ingresa el teléfono"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="phone" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                {/* Mensaje de Error General */}
                                {errors.form && <Alert variant="danger">{errors.form}</Alert>}

                                {/* Botón de Actualizar */}
                                <div className="button-container text-center">
                                    <Button
                                        type="submit"
                                        className="btn-login w-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Actualizando...' : 'Actualizar Datos'}
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

export default EditarCuidador;