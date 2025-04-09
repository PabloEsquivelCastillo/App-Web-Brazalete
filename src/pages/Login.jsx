import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { jwtDecode } from 'jwt-decode';
import { Container, Row, Col, Form as BootstrapForm, Button, Alert } from 'react-bootstrap';
import '../css/Login.css';
import brazalete from '../img/brazalete.png'; 


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:3000/login', values);
      const token = response.data.token;

      if (!token) {
        setErrors({ form: 'Token no recibido. Intenta de nuevo.' });
        return;
      }

      login(token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.rol;
      const edoUser = decodedToken.edo; 
      const edoReq = decodedToken.edoReq;
      const id = decodedToken._id;

      if (!edoUser) {
        setErrors({ form: 'Usuario dado de baja. Contacta al administrador.' });
        return;
      }

      if (Number(edoReq) === 0) {
        setErrors({ form: 'Espera a que el administrador acepte tu solicitud' });
        return;
      }

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'keeper') {
        navigate('/cuidador/perfil');
      } else {
        setErrors({ form: 'Rol no válido' });
      }
    } catch (err) {
      setErrors({ form: 'Error al iniciar sesión. Verifica tus credenciales.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    document.querySelector('[name="email"]').value = '';
    document.querySelector('[name="password"]').value = '';
  }, []);

  return (
    <Container fluid className="login-page d-flex justify-content-center align-items-center">
      <Row className="login-container shadow-lg">
        <Col md={6} className="login-form p-4">
          <h1 className="login-title text-center mb-4">Inicia sesión</h1>
          <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, errors }) => (
              <Form>
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Correo electrónico</BootstrapForm.Label>
                  <Field
                    type="email"
                    name="email"
                    as={BootstrapForm.Control}
                    placeholder="Ingresa tu correo electrónico"
                    autoComplete="off"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Contraseña</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    as={BootstrapForm.Control}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="off"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </BootstrapForm.Group>

                {errors.form && <Alert variant="danger">{errors.form}</Alert>}

                <div className="button-container text-center">
                  <Button
                    type="submit"
                    className="btn-login w-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>
                </div>

                <hr className="my-4" />
                <div className="down text-center">
                  <a href='/recuperar' className="link">Olvidé mi contraseña</a>
                  <div className="link-group mt-2">
                    <span className="text-link">¿No tienes cuenta?</span>
                    <a href='/registro' className="link ms-1">Crear ahora</a>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Col>


          <Col md={6} className="login-banner d-none d-md-block">
            <img src={brazalete} alt="Login Banner" className="img-fluid w-100 h-100" />

          </Col>
      </Row>
    </Container>
  );
}

export default Login;
