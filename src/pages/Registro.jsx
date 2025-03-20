import { useState } from "react";
import axios from "axios";

export default function Registro() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/users", {
        ...formData,
        rol: "keeper", 
      });

      setMessage("Se registró exitosamente");
      setFormData({ name: "", email: "", phone: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error registrando");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required
        />
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required
        />
        <input type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required
        />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
