import * as React from "react"
import Collapsible from 'react-collapsible';
import './style.css'

const ListaMetodos = (props) => {
    if (props.metodos.length > 0) {
        return (
            props.metodos.map((metodo) => {
                return (
                    <Collapsible className="metodo"
                        openedClassName="metodo active"
                        triggerClassName="metodo-title"
                        triggerOpenedClassName="metodo-title active"
                        triggerTagName="button"
                        contentInnerClassName="metodo-content"
                        transitionTime={300}
                        easing="ease-out"
                        trigger={(metodo.complejidadCiclomatica < 11 ? "✔️ " : "⚠️ ") +metodo.nombre}>
                        <pre>{metodo.codigo}</pre>
                        <ul>
                            <li>
                                Complejidad Ciclomatica: {metodo.complejidadCiclomatica}
                            </li>
                            <li>
                                Longitud Halstead: {metodo.longitudHalstead}
                            </li>
                            <li>
                                Volumen Halstead: {metodo.volumenHalstead}
                            </li>
                            <li>
                                Porcentaje de lineas con comentarios simples: {metodo.porcentajeComentarios}
                            </li>
                        </ul>
                    </Collapsible>)
            })

        )
    } else {
        return (
            <h3> ⚠️No se encontraron metodos, por favor verifique si su codigo es Java.⚠️</h3>
        )
    }
}

export default ListaMetodos