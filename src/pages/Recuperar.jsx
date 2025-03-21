import React from "react";
import "../css/recuperar.css"

const Recuperar = () => {

    return(

        <div className="formbox-recu">
                <form action="#">
                    <div className="title">
                    <h1>Recuperar Contraseña</h1>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Correo para recuperar contraseña"></input>
                        <i className="bx bxs-envelope"></i>
                    </div>
                    <button type="submit" className="btn">
                        Enviar Correo
                    </button>
                </form>
        </div>
    )
} 

export default Recuperar;