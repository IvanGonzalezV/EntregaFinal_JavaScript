console.log("Curso de JS");

let inputNumero = document.getElementById("inputNumero");
let inputLimiteSuperior = document.getElementById("inputLimiteSuperior");

let calcularButton = document.getElementById("calcular-button");

let operador = "multiply"; // Este Designa el Valor predeterminado (multiplicacion en esta app)

calcularButton.addEventListener("click", () => {
    let numero = parseInt(inputNumero.value);
    let limiteSuperior = parseInt(inputLimiteSuperior.value);

    let tablaMultiplicar = [];

    // Ternarios para el operador sque se selccione
    let operatorValue = document.querySelector(".operation-button.active")?.value || operador;

    for (let i = 1; i <= limiteSuperior; i++) {
    let resultado;
    switch (operatorValue) {
        case "sum":
            resultado = numero + i;
            break;
        case "subtract":
            resultado = numero - i;
            break;
        case "divide":
            resultado = numero / i;
            break;
        default:
            resultado = numero * i;
    }

    // Usa el mapeo para obtener el símbolo correspondiente
    let operatorSymbol = operatorSymbols[operatorValue];

    tablaMultiplicar.push(`${numero} ${operatorSymbol} ${i} = ${resultado}`);
}


    let resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = tablaMultiplicar.join("<br>");

    inputNumero.value = numero;
    inputLimiteSuperior.value = limiteSuperior;

    registrarCombinacion(numero, limiteSuperior, operatorValue);
});

let clearButton = document.getElementById("clear-button");

clearButton.addEventListener("click", () => {
    let resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = '';
    inputNumero.value = '';
    inputLimiteSuperior.value = '';
    guardarResultadosEnLocalStorage();
});

let ultimasCombinaciones = [];

function registrarCombinacion(numero, limiteSuperior, operatorValue) {
    ultimasCombinaciones.unshift({ numero, limiteSuperior, operator: operatorValue });
    llenarListaDesplegable();
}

function llenarListaDesplegable() {
    const select = document.getElementById("ultimas-combinaciones");
    select.innerHTML = '<option value="" disabled selected>Última Combinación</option>';
    for (const combinacion of ultimasCombinaciones) {
        const option = document.createElement("option");
        option.value = `${combinacion.numero} ${combinacion.operator} ${combinacion.limiteSuperior}`;
        option.text = `${combinacion.numero} ${combinacion.operator} ${combinacion.limiteSuperior}`;
        select.appendChild(option);
    }
}

// Aqui establezco la clase 'active' en el botón seleccionado cuando el usuario haga clic en alguno de los botons de operación
const operationButtons = document.querySelectorAll(".operation-button");
operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        operationButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

const operatorSymbols = {
    sum: '➕',
    subtract: '➖',
    multiply: '✖️',
    divide: '➗'
};

// Función para guardar resultados en el almacenamiento local (storage)
function guardarResultadosEnLocalStorage() {
    localStorage.setItem('tablaMultiplicar', JSON.stringify(ultimasCombinaciones));
}

window.addEventListener('load', () => {
    if (localStorage.getItem('tablaMultiplicar')) {
        ultimasCombinaciones = JSON.parse(localStorage.getItem('tablaMultiplicar'));
        llenarListaDesplegable();
    }
});



