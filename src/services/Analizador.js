//Analiza el codigo y devuelve el array de objetos metodo para ser renderizado en la pagina codigo analizado
const regexMetodo = /((\bpublic\b)|(\bprivate\b))(.*)\((.*)\)/g
const analizarCodigo = (codigoCrudo) => {
	if (codigoCrudo.indexOf("class") > -1)
		codigoCrudo = codigoCrudo.substr(0, codigoCrudo.lastIndexOf("}"));

	codigoCrudo = codigoCrudo.replace(/(\/\*([\s\S]*?)\*\/)/gm, '');
	let listaMetodos = [];
	let codigoSinComentarios = codigoCrudo.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
	let metodos = [...codigoSinComentarios.matchAll(regexMetodo)];
	let porcentajecomentariosTotal = calcularComentarios(codigoCrudo).porcentajeComentarios;

	for (let index = 0; index < metodos.length; index++) {
		const metodo = (metodos[index])[0];
		const proximoMetodo = index + 1 < metodos.length ? metodos[index + 1][0] : null;
		var nombreMetodo = metodos[index][4];
		nombreMetodo = nombreMetodo.substr(nombreMetodo.lastIndexOf(" ")).trim();

		let codigoMetodo = codigoCrudo.split(metodo)[1];
		if (proximoMetodo)
			codigoMetodo = codigoMetodo.split(proximoMetodo)[0];

		codigoMetodo = codigoMetodo.substr(0, codigoMetodo.lastIndexOf("}"))
		codigoMetodo = codigoMetodo.substr(codigoMetodo.indexOf("{") + 1)
		let complejidad = complejidadCiclomatica(codigoMetodo);
		let halstead = halsteadMetodo(codigoMetodo);
		let metricasComentarios = calcularComentarios(codigoMetodo);

		let objetoMetodo = {
			nombre: metodo,
			codigo: codigoMetodo,
			complejidadCiclomatica: complejidad,
			longitudHalstead: halstead[0],
			volumenHalstead: halstead[1],
			metricasComentarios: metricasComentarios,
			nombreCorto: nombreMetodo,
			fanIn: 0,
			fanOut: 0
		}
		listaMetodos.push(objetoMetodo);
	}
	calcularFanOut(listaMetodos)
	return { metodos: listaMetodos, porcentajeComentariosTotal: porcentajecomentariosTotal };
}
function calcularComentarios(codigoMetodo) {
	var lineasTotales = codigoMetodo.split('\n').length - 1;
	var lineasComentariosSimples = codigoMetodo.split('//').length - 1;
	var lineasVacias = (codigoMetodo.match(/(^[ \t]*(\n|$))/gm) || []).length
	var porcentajeComentarios = parseFloat((parseInt(lineasComentariosSimples) / parseInt(lineasTotales)) * 100).toFixed(2);
	if (isNaN(porcentajeComentarios)) porcentajeComentarios = 0;
	porcentajeComentarios += "%";
	return {
		porcentajeComentarios,
		lineasTotales,
		lineasComentariosSimples,
		lineasVacias,
		lineasCodigo: lineasTotales - (lineasComentariosSimples + lineasVacias)
	};
}
function calcularFanOut(metodos) {
	for (let index = 0; index < metodos.length; index++) {
		for (let j = 0; j < metodos.length; j++) {
			if (index === j) continue;
			var metodo = metodos[index];
			var otroMetodo = metodos[j];
			var regexBusqueda = new RegExp("\\b" + metodo.nombreCorto + "\\b")
			var fanOut = otroMetodo.codigo.replace(/(".*")/gm, "").split(regexBusqueda).length - 1;
			otroMetodo.fanOut += fanOut;
			if (fanOut > 0) metodo.fanIn++;
		}
	}
}

function complejidadCiclomatica(texto) {
	var codigoMetodo = texto.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
	var c = 0;
	c += codigoMetodo.split(/\bif\b/gm).length - 1;
	c += codigoMetodo.split(/\bfor\b/gm).length - 1;
	c += codigoMetodo.split(/\bwhile\b/gm).length - 1;
	c += codigoMetodo.split(/\bcatch\b/gm).length - 1;
	c += codigoMetodo.split(' || ').length - 1;
	c += codigoMetodo.split(' && ').length - 1;
	return c + 1;
}
function halsteadMetodo(texto) {
	//Operadores + - = * ; int double float return
	var codigoMetodo = texto.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
	var cantidadOperadoresTotales = 0;
	var cantidadOperandosTotales = 0;
	var cantidadOperadoresUnicos = 0;
	var cantidadOperandosUnicos = 0;
	var operadores = ["+", "-", "/", "*", "int", "double", "float", ";", ":", "public", "static", "void", "&&", "||", "<=", ">=", "<", ">"];
	var operandosUnicos = [];
	var i;
	//OPERADORES UNICOS Y TOTALES.
	for (i = 0; i < operadores.length; i++) {
		if (codigoMetodo.indexOf(operadores[i]) !== -1)
			cantidadOperadoresUnicos++;
		cantidadOperadoresTotales += texto.split(operadores[i]).length - 1;
	}

	//OPERADORES TOTALES

	//OPERANDOS UNICOS Y TOTALES.
	var aAnalizar = codigoMetodo.split(' ');
	var hasta = codigoMetodo.split(' ').length;
	for (let j = 0; j < hasta; j++) {
		//Si no es un operador y todavia no esta en el array de operandos unicos.
		if (operadores.indexOf(aAnalizar[j]) === -1 && operandosUnicos.indexOf(aAnalizar[j]) === -1) {
			operandosUnicos.push(aAnalizar[j]);
			cantidadOperandosUnicos++;
		}
		//Si no es un operador.
		if (operadores.indexOf(aAnalizar[j]) === -1)
			cantidadOperandosTotales++;
	}
	var longitudHalstead = parseInt(cantidadOperadoresUnicos * Math.log2(cantidadOperadoresUnicos) + cantidadOperandosUnicos * Math.log2(cantidadOperandosUnicos));
	var volumenHalstead = parseFloat((cantidadOperadoresTotales + cantidadOperandosTotales) * Math.log2(cantidadOperadoresUnicos + cantidadOperandosUnicos)).toFixed(2);
	return [longitudHalstead, volumenHalstead];
}

export default analizarCodigo;