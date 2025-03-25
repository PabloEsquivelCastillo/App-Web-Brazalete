import '../css/LateralAdmin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, UserCheck, Pill, BellRing, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown, Container, Nav, NavDropdown } from "react-bootstrap";
import Navbar from "../components/Navbar";

export default function LateralAdmin() {
    let navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1100); // Cambia a navbar en pantallas pequeñas
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Función para cerrar sesión eliminando el token
    const handleLogout = () => {
        // Eliminar el token del localStorage o sessionStorage
        localStorage.removeItem("token"); // O sessionStorage.removeItem("token");
        // Redirigir a la página de login o principal
        navigate("/login");
    };

    //React boostrap alv, este si sirve
    return (
        <>
            {isMobile ? (
<<<<<<< HEAD
                // Navbar en pantallas pequeñas 📱
                <Navbar expand="lg" className="mobile-navbar">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar id="basic-navbar-nav">
                            <Nav className="me-auto justify-content-center">
                                <Nav.Link onClick={() => navigate("/admin/solicitudes")}>
                                    <User size={20} /> Solicitudes
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate("/admin/dashboard")}>
                                    <UserCheck size={20} /> Cuidadores
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate("/admin/Medicamentos")}>
                                    <Pill size={20} /> Medicamentos
                                </Nav.Link>
                                <Nav.Link href="#">
                                    <BellRing size={20} /> Recordatorios
                                </Nav.Link>
                                <Dropdown className="admin-dropdown" drop="start">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown'>
                                        Admin
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className='logout' onClick={handleLogout}>
                                            Cerrar sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar>
                    </Container>
                </Navbar>
            ) : (
                // Sidebar en pantallas grandes 🖥️
                <div className="sidebar">
                    <Dropdown className="admin-dropdown" drop="end">
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown'>
                            Admin
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className='logout' onClick={handleLogout}>
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

=======
                    <Navbar/>
            ) : (
                // Sidebar en pantallas grandes 🖥️
                <div className="sidebar">
>>>>>>> origin/juan-dev
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/admin/solicitudes")}>
                                <div className="nav-content">
                                    <User size={20} />
                                    <span className="nav-text">Solicitudes</span>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/admin/dashboard")}>
                                <div className="nav-content">
                                    <UserCheck size={20} />
                                    <span className="nav-text">Cuidadores</span>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/admin/Medicamentos")}>
                                <div className="nav-content">
                                    <Pill size={20} />
                                    <span className="nav-text">Medicamentos</span>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/admin/Recordatorios")}>
                                <div className="nav-content">
                                    <BellRing size={20} />
                                    <span className="nav-text">Recordatorios</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}
