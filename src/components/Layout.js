import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const pageStyles = {
    padding: 68,
    flex: 1
}
const headingStyles = {
    marginTop: 0,
    marginBottom: 64,
    maxWidth: 320,
}
const paragraphStyles = {
    marginBottom: 48,
}
const bodyStyles = {
    display: "flex",
    flexDirection: "column",
    minWidth: "100vh",
    fontFamily: "-apple-system, Roboto, sans-serif, serif",
    color: "#232129",
}
const footerStyles = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
}

const LayoutComponent = (props) => {
    return (
        <div style={bodyStyles}>
            <title>Java Metrics - {props.supertitulo}</title>
            <header><StaticImage
                alt="UnlaM"
                src="../images/logo-unlam.png"
                height={128}
                width={128} /></header>
            <main style={pageStyles}>
                <h1 style={headingStyles}>
                    {props.titulo}
                </h1>
                <p style={paragraphStyles}>
                    {props.subtitulo}
                </p>
                {props.children}
            </main>
            <footer style={footerStyles}><h3>Hecho por Grupo 2 Analisis de Software UnlaM 2021.</h3></footer>
        </div>

    )
}

export default LayoutComponent