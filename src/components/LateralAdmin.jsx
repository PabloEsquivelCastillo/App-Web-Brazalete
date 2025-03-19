import '../css/LateralAdmin.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, UserCheck, Pill, BellRing } from "lucide-react"; 

export default function LateralAdmin() {
    return (
        <div className="sidebar">
            <ul className="nav flex-column">
            <li className="nav-item">
                <a className="nav-link" href="#">
                <div className="nav-content">
                    <User size={20} />
                    Solicitudes
                </div>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                <div className="nav-content">
                    <UserCheck size={20} />
                    Cuidadores
                </div>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                <div className="nav-content">
                    <Pill size={20} />
                    Medicamentos
                </div>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                <div className="nav-content">
                    <BellRing size={20} />
                    Recordatorios
                </div>
                </a>
            </li>
            </ul>
        </div>
    );
}
