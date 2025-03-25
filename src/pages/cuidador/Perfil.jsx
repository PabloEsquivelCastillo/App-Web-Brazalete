import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import LateralCuidador from "../../components/LateralCuidador";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "../../css/Perfil.css";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        name: "",
        phone: "",
    });

    const validationSchema = Yup.object({
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
        if (!user?.id) {
            console.error("ID de usuario no encontrado");
            setLoading(false);
            return;
        }
    
        const cargarDatosUsuario = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.id}`);
                setInitialValues(response.data); 
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
                toast.error("Error al cargar los datos del usuario");
            } finally {
                setLoading(false);
            }
        };
        cargarDatosUsuario();
    }, [user]);

    const handleSubmit = async (values) => {
        try {
            const response = await axiosInstance.put(`/users/${user.id}`, values);
            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            toast.error("Error al actualizar el perfil");
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Spinner animation="border" variant="success" />
            <span className="ms-2">Cargando datos del usuario...</span>
        </div>
    );

    return (
        <>
            <Navbar />
            <LateralCuidador />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5} className="perfil-container">
                        <h1 className="perfil-header">Editar Perfil</h1>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <Form className="px-3 px-md-4">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="perfil-label">Nombre completo</label>
                                        <Field 
                                            type="text" 
                                            name="name" 
                                            className="perfil-input" 
                                            autoComplete="off" 
                                        />
                                        <ErrorMessage 
                                            name="name" 
                                            component="div" 
                                            className="text-danger text-start ms-4" 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="perfil-label">Teléfono</label>
                                        <Field 
                                            type="text" 
                                            name="phone" 
                                            className="perfil-input" 
                                            autoComplete="off" 
                                        />
                                        <ErrorMessage 
                                            name="phone" 
                                            component="div" 
                                            className="text-danger text-start ms-4" 
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="perfil-button" 
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Actualizando..." : "Actualizar Datos"}
                                    </Button>
                                    <p 
                                        className="mt-4 cursor-pointer" 
                                        onClick={() => navigate("/cuidador/contraseña")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Cambiar Contraseña
                                    </p>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
            </Container>
        </>
    );
}