import '../css/LateralAdmin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, UserCheck, Pill, BellRing, Menu, Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown, Container, Nav, NavDropdown } from "react-bootstrap";
import Navbar from './Navbar';


export default function LateralCuidador() {
    let navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 925); 
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        navigate("/login");
    };

    return (
        <>
            {isMobile ? (
                <Navbar/>
            ) : (
                <div className="sidebar">
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
                            <a className="nav-link" onClick={() => navigate("/cuidador/brazalete")}>
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
                            <a className="nav-link" onClick={() => navigate("/cuidador/Recordatorios")}>
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
