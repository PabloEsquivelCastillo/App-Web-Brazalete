import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Registro.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Registro() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12); // Limit to 12 characters
    setFormData({ ...formData, phone: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    const phoneRegex = /^[0-9]{1,12}$/; // 1-12 digits only
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener entre 1 y 12 dígitos";
    }

    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.post("http://localhost:3000/api/users", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        rol: "keeper",
      });

      setMessage("¡Registro exitoso! Redirigiendo...");
      
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setErrors({});
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <div className="container">
      <h2 className="titulo">Regístrate</h2>
      {message && <p className={message.includes("éxito") ? "success-message" : "error-message"}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input className="in1" type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
    
        <input className="in2" type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        {errors.email && <p className="error">{errors.email}</p>}
        
        <input 
          className="in3" 
          type="tel" 
          name="phone" 
          placeholder="Teléfono" 
          value={formData.phone} 
          onChange={handlePhoneChange} 
          maxLength="12" 
          required 
        />
        {errors.phone && <p className="error">{errors.phone}</p>}
        
        <div className="input-container">
          <input 
            className="in4" 
            type={showPassword ? "text" : "password"} 
            name="password" 
            placeholder="Contraseña" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <i 
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}
        
        <div className="input-container">
          <input 
            className="in5" 
            type={showConfirmPassword ? "text" : "password"} 
            name="confirmPassword" 
            placeholder="Confirmar contraseña" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
          <i 
            className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
            onClick={toggleConfirmPasswordVisibility}
          ></i>
        </div>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        
        <button className="btnregistro" type="submit">Registrarse</button>
      </form>
      <div className="divider"></div>
      <a href="/login" className="login-link">¿Ya tienes una cuenta? Inicia sesión</a>
    </div>
  );
}