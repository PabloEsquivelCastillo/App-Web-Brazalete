import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import 'react-toastify/dist/ReactToastify.css';
import '../css/recuperar.css'; // Asegúrate de que la ruta sea correcta

// Crear una instancia de axios sin interceptores de autenticación
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://psu3y59k4a.execute-api.us-east-1.amazonaws.com',
});

export default function Recuperar() {
  const navigate = useNavigate(); // Crear una instancia de useNavigate

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email inválido')
      .required('Email es obligatorio'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axiosPublic.post('/api/password/request-reset', {
        email: values.email,
      });

      toast.success('Hemos enviado un email con instrucciones para restablecer tu contraseña');
      resetForm();

      // Redirigir a la página principal después de enviar el correo
      navigate('/'); // Redirigir al usuario a la ruta principal "/"
    } catch (error) {
      console.error('Error al solicitar restablecimiento:', error);

      if (error.response?.status === 404) {
        toast.info('Si el email está registrado, recibirás instrucciones para restablecer tu contraseña');
      } else {
        toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recover-password-container">
      <div className="recover-password-card">
        <h1 className="recover-password-title">Recuperar Contraseña</h1>
        <p className="recover-password-subtitle">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="recover-password-input-group">
                <label htmlFor="email" className="perfil-label">Email</label>
                <Field type="email" name="email" className="recover-password-input" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <button className="recover-password-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Email de Recuperación"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
