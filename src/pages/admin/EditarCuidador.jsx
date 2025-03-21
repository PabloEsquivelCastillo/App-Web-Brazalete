import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, setIn } from "formik";
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { actualizarCuidador } from "../../Logica/FuncionesAdmin";
import { toast } from "react-toastify";

import '../../css/EditarCuidador.css';






const EditarCuidador = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        name: '',
        phone: ''
    });


    const validation = Yup.object({
        name: Yup.string()
            .min(2, "Muy corto")
            .max(50, "Menor a 50 caracteres")
            .required("Nombre obligatorio"),
        phone: Yup.string()
            .min(3, "Mínimo 3 caracteres")
            .max(12, "Máximo 12 caracteres")
            .required("Teléfono obligatorio"),
    });


    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await axiosInstance.get(`/api/user/${id}`);
                setInitialValues(response.data);
                console.log("Usuaurio datos: ", response.data);
                
            } catch (error) {
                console.error("Error al cargar los datos: ", error);
            } finally {
                setLoading(false)
            }
        };
        cargarDatos();
    }, [id]);

    const handleSubmit = async ( values) => {
        try{
            await actualizarCuidador(id, values);
            console.log(values);
            toast.success("Cuidador actualizado correctamente")
            navigate(`/admin/cuidadoresActivos`)
        }catch (error) {
            console.error("Error al actualizar el cuidador:" , error);
            toast.error("Error al actualizar el cuidador")
            
        }
    }


    if (loading) return <p>Cargando datos del cuidador...</p>;

    return (
        <div className="col-6 login-form">
            <h1 className="login-title">Editar Cuidador</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validation}
                onSubmit={handleSubmit}
                enableReinitialize // Permite que el formulario se reinicialice cuando cambian los initialValues
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <Field type="text" name="name" className="form-control" autoComplete="off" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <Field type="text" name="phone" className="form-control" autoComplete="off" />
                            <ErrorMessage name="phone" component="div" className="text-danger" />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Validando Información ...' : 'Actualizar Datos'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};


export default EditarCuidador;