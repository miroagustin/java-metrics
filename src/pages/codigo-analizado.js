import * as React from "react"
import Layout from "../components/Layout"
import ListaMetodos from "../components/ListaMetodos"
import { Link } from "gatsby";


const CodigoAnalizadoPage = (props) => {
    let codigoAnalizado = props.location.state ? props.location.state.codigoAnalizado :  null;
    return(
    <Layout
        supertitulo="Resultado"
        titulo="Resultado del Analisis"
        subtitulo='Debajo encontrara los resultados del analisis del codigo Java. Si el metodo tiene un ⚠️ se recomienda modularizarlo.'>
        <Link to="/">Volver a Home</Link>
        
        <h2>Porcentaje total de lineas con comentarios simples: {codigoAnalizado ? codigoAnalizado.porcentajeComentariosTotal : 0 + "%"}</h2>
        <ListaMetodos
            metodos={codigoAnalizado ? codigoAnalizado.metodos : []} />
    </Layout>)
}

export default CodigoAnalizadoPage