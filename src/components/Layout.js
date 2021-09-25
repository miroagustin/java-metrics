import * as React from "react"

const pageStyles = {
    color: "#232129",
    padding: 96,
    fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
    marginTop: 0,
    marginBottom: 64,
    maxWidth: 320,
}
const paragraphStyles = {
    marginBottom: 48,
}

const LayoutComponent = (props) => {
    return (
        <main style={pageStyles}>
            <title>Java Metrics - {props.supertitulo}</title>
            <h1 style={headingStyles}>
                {props.titulo}
            </h1>
            <p style={paragraphStyles}>
                {props.subtitulo}
            </p>
            {props.children}
        </main>
    )
}

export default LayoutComponent