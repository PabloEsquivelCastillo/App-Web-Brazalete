import React from "react";
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

export default function Contraseña() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Contraseña actual obligatoria"),
    newPassword: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("Nueva contraseña obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
      .required("Confirmar contraseña es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.put(
        `/users/${user.id}`, 
        {
          oldPassword: values.oldPassword, 
          newPassword: values.newPassword, 
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      toast.success("Contraseña actualizada correctamente");
      navigate("/cuidador/perfil");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      
      if (error.response?.data?.message === 'La contraseña actual es incorrecta') {
        toast.error("La contraseña actual es incorrecta. Por favor, inténtelo de nuevo.");
      } else {
        toast.error(error.response?.data?.message || "Error al actualizar la contraseña");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <LateralCuidador />
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5} className="perfil-container" style={{ minHeight: "auto", paddingBottom: "30px" }}>
            <h1 className="perfil-header">Cambiar Contraseña</h1>
            <Formik
              initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="px-3 px-md-4">
                  <div className="mb-3">
                    <label htmlFor="oldPassword" className="perfil-label">Contraseña actual</label>
                    <Field type="password" name="oldPassword" className="perfil-input" />
                    <ErrorMessage 
                      name="oldPassword" 
                      component="div" 
                      className="text-danger text-start ms-4" 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="perfil-label">Nueva contraseña</label>
                    <Field type="password" name="newPassword" className="perfil-input" />
                    <ErrorMessage 
                      name="newPassword" 
                      component="div" 
                      className="text-danger text-start ms-4" 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="perfil-label">Confirmar nueva contraseña</label>
                    <Field type="password" name="confirmPassword" className="perfil-input" />
                    <ErrorMessage 
                      name="confirmPassword" 
                      component="div" 
                      className="text-danger text-start ms-4" 
                    />
                  </div>
                  <Button 
                    className="perfil-button" 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ marginTop: "20px" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner 
                          as="span" 
                          animation="border" 
                          size="sm" 
                          role="status" 
                          aria-hidden="true" 
                          className="me-2" 
                        />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
}