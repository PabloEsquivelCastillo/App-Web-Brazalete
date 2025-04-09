import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from 'react-bootstrap';
import LateralCuidador from "../../components/LateralCuidador";
import Navbar from "../../components/Navbar";
import "../../css/Tablas.css";
import "../../css/Paginacion.css";
import { useAuth } from '../../context/AuthContext';

// Import the correct function
import { getBraceletsByUser } from "../../Logica/Brazaletes";

const Brazalete = () => {
    const { user } = useAuth();
    const [brazaletes, setBrazaletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('User in Brazalete:', user);

    useEffect(() => {
        console.log('Usuario en contexto de Auth:', user);
    
        const cargarBrazaletes = async () => {
            if (!user || !user.id) {
                console.error('No user or user ID, redirigiendo al login...');
                setLoading(false);
                return;
            }
    
            try {
                console.log('Fetching bracelets for user ID:', user.id);
                const data = await getBraceletsByUser(user.id);
                console.log('Bracelets fetched:', data);
                
                setBrazaletes(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bracelets:", err);
                setError(err);
                setLoading(false);
            }
        };
        
        cargarBrazaletes();
    }, [user]);

    if (loading) return <p className="mt-4 d-flex justify-content-center">Cargando brazaletes...</p>;
    if (error) return <p className="mt-4 d-flex justify-content-center">Error al cargar los brazaletes: {error.message}</p>;

    return (
        <>
            <Navbar/>
            <LateralCuidador />
            <Container fluid className="d-flex">
                <div className="contenedor">
                    <Row className="mb-3 header-content">
                        <Col>
                            <h1 className="title">Brazaletes</h1>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className="table-responsive">
                                {brazaletes.length > 0 ? (
                                    <Table className="table-custom">
                                        <thead>
                                            <tr>
                                                <th>Nombre del Brazalete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brazaletes.map((brazalete, index) => (
                                                <tr key={brazalete._id}>
                                                    <td>{brazalete.nombre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-center">No hay brazaletes disponibles</p>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
};

export default Brazalete;