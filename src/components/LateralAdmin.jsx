import '../css/LateralAdmin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, UserCheck, Pill, BellRing, Menu } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown, Navbar, Container } from "react-bootstrap";

export default function LateralAdmin() {
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


    //React boostrap alv, este si sireve
    return (
        <>
            {isMobile ? (
                // Navbar en pantallas pequeñas 📱
                <Navbar expand="lg" className="mobile-navbar">
                    <Container>
                        <Navbar.Brand href="#">Admin</Navbar.Brand>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Opciones
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate("/admin/solicitudes")}>
                                    <User size={20} /> Solicitudes
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate("/admin/dashboard")}>
                                    <UserCheck size={20} /> Cuidadores
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate("/admin/Medicamentos")}>
                                    <Pill size={20} /> Medicamentos
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    <BellRing size={20} /> Recordatorios
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => navigate("/logout")}>
                                    Cerrar sesión
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Container>
                </Navbar>
            ) : (
                // Sidebar en pantallas grandes 🖥️
                <div className="sidebar">
                    <Dropdown className="admin-dropdown"  drop="end">
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown'>
                            Admin
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className='logout' onClick={() => navigate("/logout")}>
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

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
