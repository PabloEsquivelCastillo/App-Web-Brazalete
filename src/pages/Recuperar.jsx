import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Crear una instancia de axios sin interceptores de autenticación
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
});

export default function Recuperar() {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email inválido')
      .required('Email es obligatorio'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axiosPublic.post('/api/password/request-reset', {
        email: values.email
      });
      
      toast.success('Hemos enviado un email con instrucciones para restablecer tu contraseña');
      resetForm();
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
    <div className="perfil-container">
      <h1 className="perfil-header">Recuperar Contraseña</h1>
      <p className="perfil-text">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
      
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="email" className="perfil-label">Email</label>
              <Field type="email" name="email" className="perfil-input" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <button className="perfil-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Email de Recuperación"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}