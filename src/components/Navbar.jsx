import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Navbar.css'
import logo from '../img/Logo.png';
export default function Navbar() {


    //Aquí quiero hacer una función para renderizar la palabra "Administrador" ó "Cuidador" en base al rol


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" >
        <img className= "logo"src={logo} alt="Logo" style={{ width: '60px', height: '50px' }} />

        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            <li className="navadmin">
              <a className="nav-link" >Administrador</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
