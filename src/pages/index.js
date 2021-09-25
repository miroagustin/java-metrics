import * as React from "react"
import CodeAnalizer from "../components/CodeAnalizer"
import Layout from "../components/Layout"


// markup
const IndexPage = () => {

  return (
    <Layout
      supertitulo="Pagina Principal"
      titulo="Bienvenido a Java Metrics"
      subtitulo='Por favor ingrese su clase Java y presione el boton "Analizar Codigo"'>
      <CodeAnalizer />
    </Layout>
  )
}

export default IndexPage
