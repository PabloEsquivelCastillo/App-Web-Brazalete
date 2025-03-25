import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Navbar.css';
import { Dropdown } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  //.
  return (
    <nav className="navbar navbar-expand-lg " >
      <div className="container-fluid">
        <a className="navbar-brand">
          <h2>Logo</h2>
        </a>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Dropdown className="admin-dropdown" drop="start">
                <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown'>
                  Admin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item className='logout' onClick={() => navigate("/logout")}>
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}