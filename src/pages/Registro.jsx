import { useState } from "react";
import axios from "axios";
import "../css/Registro.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
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

      setMessage("Se registró exitosamente ");
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.message || "Error registrando ");
    }
  };

  return (
    <div className="container">
      <h2 className="titulo">Regístrate</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input className="in1" type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
    
        <input className="in2" type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        {errors.email && <p className="error">{errors.email}</p>}
        
        <input className="in3" type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
        
        <input className="in4" type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        {errors.password && <p className="error">{errors.password}</p>}
        
        <input className="in5" type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} required />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        
        <button className="btnregistro" type="submit">Registrarse</button>
      </form>
      <div className="divider"></div>
      <a href="/login" className="login-link">¿Ya tienes una cuenta? Inicia sesión</a>
    </div>
  );
}
