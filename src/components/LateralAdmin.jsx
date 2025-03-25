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


    //React boostrap alv, este si sireve
    return (
        <>
            {isMobile ? (
                    <Navbar/>
            ) : (
                // Sidebar en pantallas grandes 🖥️
                <div className="sidebar">
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
