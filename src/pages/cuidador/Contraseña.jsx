import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../css/Contraseña.css'
const Contraseña = () => {
    return (
        <div className="update-password-container">
          <div className="update-password-card">
            <h2 className="update-password-title">Actualiza tu contraseña</h2>
            <p className="update-password-subtitle">Ingresa tu nueva contraseña.</p>
            <form>
              <div className="update-password-input-group">
                <label htmlFor="password" className="update-password-label">
                  Contraseña nueva:
                </label>
                <input
                  type="password"
                  className="update-password-input"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
              <div className="update-password-button-container">
                <button className="update-password-button" type="submit">
                  Guardar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      );
};

export default Contraseña;