import React, { useState } from "react"
import TextareaAutosize from 'react-textarea-autosize';
import { navigate } from "gatsby";
import analizarCodigo from "../services/Analizador";
const handleSubmit = (event, texto) => {
    event.preventDefault();
    if(texto !== "") {
        let codigoAnalizado = analizarCodigo(texto); 
        navigate("/codigo-analizado/",
            { state: { codigoAnalizado } }
        )
    } else {
        alert("Por favor ingrese un codigo a analizar!")
    }
}

const textAreaStyle = {
    marginTop: 10,
    width: "60%",
    display: "block",
}

const CodeAnalizer = () => {
    const [texto, setTexto] = useState("");
    return (
        <form onSubmit={(e) => handleSubmit(e, texto)}>
            <button >Analizar Codigo</button>
            <TextareaAutosize
                onChange={(e) => setTexto(e.target.value) || navigate("#")}
                spellCheck="false"
                style={textAreaStyle}
                minRows="10" />
        </form>

    )
}

export default CodeAnalizer