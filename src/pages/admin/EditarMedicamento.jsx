import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router-dom";
import { actualizarMedicamento, registrarMed } from "../../Logica/Medicamentos";
import { IoIosArrowBack } from "react-icons/io";
import { Container, Row, Col, Form as BootstrapForm, Button, Alert } from 'react-bootstrap';
import "../../css/Login.css";
import axiosInstance from "../../api/axiosConfig";

const EditarMedicamento = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const validation = Yup.object({
        nombre: Yup.string()
            .min(2, "Muy corto")
            .max(50, "Menor a 50 caracteres")
            .required("Nombre obligatorio"),
        description: Yup.string()
            .min(3, "Mínimo 3 caracteres")
            .max(120, "Máximo 120 caracteres")
            .required("Descripción obligatoria"),
    });

    useEffect(() => {
        axiosInstance
            .get(`/medication/${id}`)
            .then((res) => {
                setInitialValues(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error al cargar los datos:", err);
                setError("Error al cargar los datos del medicamento. Inténtalo de nuevo más tarde.");
                setLoading(false);
            })
    }, [id])


    const handleSubmit =  (values) => {
        actualizarMedicamento(id, values)
        .then(( res ) => {
            if(res.status === 200) {
                navigate("/admin/Medicamentos")
            } else {
                setError("Error al actualizar el medicamento. Inténtalo de nuevo.");
            }
        })
    };

    return (
        <Container fluid className="login-page d-flex justify-content-center align-items-center">
            <Row className="login-container shadow-lg">
                <Col md={12} className="login-form p-4">
                    {/* Ícono de volver */}
                    <Button onClick={() => navigate(-1)} className="volver-btn">
                        <IoIosArrowBack className="back-icon" style={{ width: "20px", height: "20px" }} /> Volver
                    </Button>
                    {/* Título del formulario */}
                    <h1 className="login-title text-center mb-4">Editar Medicamento</h1>

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
                                        name="nombre"
                                        as={BootstrapForm.Control}
                                        placeholder="Ingresa el nombre"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                {/* Campo de Descripción */}
                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Descripción</BootstrapForm.Label>
                                    <Field
                                        type="text"
                                        name="description"
                                        as={BootstrapForm.Control}
                                        placeholder="Ingresa la descripción"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="description" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                {/* Mensaje de Error General */}
                                {errors.form && <Alert variant="danger">{errors.form}</Alert>}

                                {/* Botón de Registrar */}
                                <div className="button-container text-center">
                                    <Button
                                        type="submit"
                                        className="btn-login w-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Actualizando...' : 'Actualizar Medicamento'}
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

export default EditarMedicamento;