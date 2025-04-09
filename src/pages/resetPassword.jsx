import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/recuperar.css'; // Asegúrate de que la ruta sea correcta

export default function RestablecerPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [tokenValido, setTokenValido] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const decodedToken = decodeURIComponent(token);
    console.log("Token recibido (posiblemente decodificado):", decodedToken);
    
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!tokenValido) {
    return (
      <div className="recover-password-container">
        <div className="recover-password-card">
          <h1 className="recover-password-title">Error de Restablecimiento</h1>
          <p className="recover-password-subtitle">El enlace de restablecimiento no es válido o ha expirado.</p>
          <button className="recover-password-button" onClick={() => navigate('/recuperar')}>
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recover-password-container">
      <div className="recover-password-card">
        <h1 className="recover-password-title">Restablecer Contraseña</h1>
        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="recover-password-input-group">
                <label htmlFor="newPassword" className="recover-password-label">Nueva contraseña</label>
                <div className="input-container">
                  <Field 
                    type={showPassword ? "text" : "password"} 
                    name="newPassword" 
                    className="recover-password-input" 
                  />
                  <i 
                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                    onClick={togglePasswordVisibility}
                  ></i>
                </div>
                <ErrorMessage name="newPassword" component="div" className="text-danger" />
              </div>
              <div className="recover-password-input-group">
                <label htmlFor="confirmPassword" className="recover-password-label">Confirmar nueva contraseña</label>
                <div className="input-container">
                  <Field 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword" 
                    className="recover-password-input" 
                  />
                  <i 
                    className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                    onClick={toggleConfirmPasswordVisibility}
                  ></i>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
              </div>
              <button className="recover-password-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Restablecer Contraseña"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
