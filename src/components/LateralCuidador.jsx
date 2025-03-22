import '../css/LateralCuidador.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, Watch, Pill, BellRing } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

export default function LateralCuidador() {

    let navigate=useNavigate();

    return (
        <div className="sidebar">
            <ul className="nav flex-column">
            <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/cuidador/perfil")}>
                <div className="nav-content">
                    <User size={20} />
                    Perfil
                </div>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/cuidador/Brazaletes")}>
                <div className="nav-content">
                    <Watch size={20} />
                    Brazaletes
                </div>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/cuidador/Medicamentos")}>
                <div className="nav-content">
                    <Pill size={20} />
                    Medicamentos
                </div>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/cuidador/Recordatorios")}>
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
