import 'bootstrap/dist/css/bootstrap.min.css';
import { User, UserCheck, Pill, BellRing, Menu, Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown, Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import '../css/LateralAdmin.css';

export default function LateralCuidador() {
    let navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 925); // Cambia a navbar en pantallas pequeñas
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

    return (
        <>
            {isMobile ? (
                // Navbar en pantallas pequeñas 📱
                <Navbar expand="lg" className="mobile-navbar">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar id="basic-navbar-nav">
                            <Nav className="me-auto justify-content-center">
                                <Nav.Link onClick={() => navigate("/cuidador/perfil")}>
                                    <User size={20} /> Perfil
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate("/cuidador/brazaletes")}>
                                    <Watch size={20} /> Brazaletes
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate("/cuidador/medicamentos")}>
                                    <Pill size={20} /> Medicamentos
                                </Nav.Link>
                                <Nav.Link href="#">
                                    <BellRing size={20} /> Recordatorios
                                </Nav.Link>
                                <Dropdown className="admin-dropdown" drop="start">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown'>
                                        Cuidador
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
                            Cuidador
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className='logout' onClick={handleLogout}>
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/cuidador/perfil")}>
                                <div className="nav-content">
                                    <User size={20} />
                                    <span className="nav-text">Perfil</span>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/cuidador/brazaletes")}>
                                <div className="nav-content">
                                    <Watch size={20} />
                                    <span className="nav-text">Brazaletes</span>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/cuidador/medicamentos")}>
                                <div className="nav-content">
                                    <Pill size={20} />
                                    <span className="nav-text">Medicamentos</span>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
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
