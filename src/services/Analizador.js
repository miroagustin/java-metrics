//Analiza el codigo y devuelve el array de objetos metodo para ser renderizado en la pagina codigo analizado
const regexMetodo = /((\bpublic\b)|(\bprivate\b))(.*)\((.*)\)/g
const analizarCodigo = (codigoCrudo) => {
	codigoCrudo = codigoCrudo.substr(0,codigoCrudo.lastIndexOf("}"));
	codigoCrudo = codigoCrudo.replace(/(\/\*([\s\S]*?)\*\/)/gm,'');
    let listaMetodos = [];
    let codigoSinComentarios = codigoCrudo.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
    let metodos = [...codigoSinComentarios.matchAll(regexMetodo)].map((match) => match[0]);
	let porcentajecomentariosTotal = calcularComentarios(codigoCrudo);
    for (let index = 0; index < metodos.length; index++) {
        const metodo = metodos[index];
        const proximoMetodo = index + 1 < metodos.length ? metodos[index + 1] : null;
        let codigoMetodo = codigoCrudo.split(metodo)[1];
        if (proximoMetodo)
            codigoMetodo = codigoMetodo.split(proximoMetodo)[0];

        codigoMetodo = codigoMetodo.substr(0,codigoMetodo.lastIndexOf("}"))
        codigoMetodo = codigoMetodo.substr(codigoMetodo.indexOf("{") + 1)
        let complejidad = complejidadCiclomatica(codigoMetodo);
        let halstead = halsteadMetodo(codigoMetodo);
		let porcentajeComentarios = calcularComentarios(codigoMetodo)

        let objetoMetodo = {
            nombre: metodo,
            codigo: codigoMetodo,
            complejidadCiclomatica: complejidad,
            longitudHalstead : halstead[0],
            volumenHalstead : halstead[1],
			porcentajeComentarios: porcentajeComentarios
        }
        listaMetodos.push(objetoMetodo);
    }
    return {metodos:listaMetodos,porcentajeComentariosTotal:porcentajecomentariosTotal};
}
function calcularComentarios(codigoMetodo) {
	var lineas_del_archivo = codigoMetodo.split('\n').length - 1;
	var lineas_comentarios_simples = codigoMetodo.split('//').length - 1;
	var porcentaje_lineas_comentadas = (parseFloat((parseInt(lineas_comentarios_simples)/parseInt(lineas_del_archivo))*100).toFixed(2))+"%";
	console.log(lineas_del_archivo);
	console.log(porcentaje_lineas_comentadas);
	console.log(lineas_comentarios_simples);
	if(!porcentaje_lineas_comentadas) porcentaje_lineas_comentadas = 0+"%";
	return porcentaje_lineas_comentadas;
}

function complejidadCiclomatica(texto)
{
	var codigoMetodo = texto.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
    var c = 0;
    c+=codigoMetodo.split('if').length - 1;
    c+=codigoMetodo.split('else').length - 1;
    c+=codigoMetodo.split('for').length - 1;
    c+=codigoMetodo.split('while').length - 1;
    c+=codigoMetodo.split('||').length - 1;
    c+=codigoMetodo.split('&&').length - 1;
    return c+1;
}
function halsteadMetodo(texto)
	{
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
		for (i = 0; i < operadores.length; i++) 
		{
			if(codigoMetodo.indexOf(operadores[i]) !=-1)
				cantidadOperadoresUnicos++;
			cantidadOperadoresTotales += texto.split(operadores[i]).length-1;
		}

		//OPERADORES TOTALES

		//OPERANDOS UNICOS Y TOTALES.
		var aAnalizar = codigoMetodo.split(' ');
		var hasta = codigoMetodo.split(' ').length;
		for (let j = 0; j < hasta; j++) 
		{
			//Si no es un operador y todavia no esta en el array de operandos unicos.
			if(operadores.indexOf(aAnalizar[j]) == -1 && operandosUnicos.indexOf(aAnalizar[j]) == -1)
			{
				operandosUnicos.push(aAnalizar[j]);
				cantidadOperandosUnicos++;
			}
			//Si no es un operador.
			if(operadores.indexOf(aAnalizar[j]) == -1)
				cantidadOperandosTotales++;
		}
		var longitudHalstead = parseInt(cantidadOperadoresUnicos*Math.log2(cantidadOperadoresUnicos)+cantidadOperandosUnicos*Math.log2(cantidadOperandosUnicos));
		var volumenHalstead  = parseFloat((cantidadOperadoresTotales+cantidadOperandosTotales)*Math.log2(cantidadOperadoresUnicos+cantidadOperandosUnicos)).toFixed(2);
		return [longitudHalstead, volumenHalstead];
	}
    
export default analizarCodigo;