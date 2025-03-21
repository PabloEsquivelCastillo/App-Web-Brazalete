import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(1, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:3000/login', values);
      const token = response.data.token;
      login(token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.rol;

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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row login-container">
        <div className="col-md-6 login-form">
          <h1 className='login-title'>Inicia sesión</h1>
          <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, errors }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <Field type="email" name="email" className="form-control" autoComplete="off" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <Field type="password" name="password" className="form-control" autoComplete="off" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <div className='button-container'>
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </div>
                <hr className=" border-dark border-1 opacity-50" />
                <div className='down'>
                  <a className='link' href='#'>Olvidé mi contraseña</a>
                  <div className='link-group'>
                    <a className='text-link'>¿No tienes cuenta?</a>
                    <a className='link' href='#'>Crear ahora</a>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="col-md-6 login-banner"></div>

      </div>
    </div>
  );

}

export default Login;
