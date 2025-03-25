import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function RestablecerPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [tokenValido, setTokenValido] = useState(true);
  
  useEffect(() => {
    console.log("Token recibido en el componente:", token);

    const decodedToken = decodeURIComponent(token);
    console.log("Token recibido (posiblemente decodificado):", decodedToken);
    
    // Opcional: Verificar validez del token antes de mostrar el formulario
    if (!token) {
      setTokenValido(false);
      toast.error("Token de restablecimiento no proporcionado");
    }
  }, [token]);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .required('Nueva contraseña obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
      .required('Confirmar contraseña es obligatorio')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Enviando solicitud con token:", token);
      
      const response = await axiosInstance.post('/password/reset-password', {
        token: token,
        newPassword: values.newPassword
      });
      
      console.log("Respuesta del servidor:", response.data);
      
      toast.success('Contraseña actualizada correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      
      if (error.response?.status === 400) {
        toast.error('El enlace de restablecimiento no es válido o ha expirado');
      } else {
        toast.error(error.response?.data?.message || 'Error al restablecer la contraseña');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="perfil-container">
        <h1 className="perfil-header">Error de Restablecimiento</h1>
        <p>El enlace de restablecimiento no es válido o ha expirado.</p>
        <button className="perfil-button" onClick={() => navigate('/recuperar')}>
          Solicitar nuevo enlace
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="perfil-container">
        <h1 className="perfil-header">Restablecer Contraseña</h1>
        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="newPassword" className="perfil-label">Nueva contraseña</label>
                <Field type="password" name="newPassword" className="perfil-input" />
                <ErrorMessage name="newPassword" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="perfil-label">Confirmar nueva contraseña</label>
                <Field type="password" name="confirmPassword" className="perfil-input" />
                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
              </div>
              <button className="perfil-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Restablecer Contraseña"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}