import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Email } from "@mui/icons-material";



const EditarCuidador = () => {

    return (
        <div className="col-6 login-form">
            <h1>Editar Cuidador</h1>
            <Formik 
            initialValues={{
                name: '',
                email: '',
                phone: ''
            }}>

            </Formik>
        </div>
    );

};


export default EditarCuidador;