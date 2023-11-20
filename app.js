console.log("Curso de JS");

console.log("Curso de JS");

let inputNumero = document.getElementById("inputNumero");
let inputLimiteSuperior = document.getElementById("inputLimiteSuperior");
let calcularButton = document.getElementById("calcular-button");
let clearButton = document.getElementById("clear-button");
let ultimasCombinaciones = [];

/* Agrego Fetch y Asicronia */
calcularButton.addEventListener("click", async () => {
    try {
        let numero = parseInt(inputNumero.value);
        let limiteSuperior = parseInt(inputLimiteSuperior.value);

        let response = await fetch('./locSto.json'); // Ruta al JSON que cree para esta entrega final
        let data = await response.json();

        let tablaMultiplicar = [];

        /* ternario para el operador que se seleccione */
        let operatorValue = document.querySelector(".operation-button.active")?.value || "multiply";

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

            /* Usa el mapeo para obtener el simbolo correspondiente */
            let operatorSymbol = operatorSymbols[operatorValue];

            tablaMultiplicar.push(`${numero} ${operatorSymbol} ${i} = ${resultado}`);
        }

        let resultadosDiv = document.getElementById("resultados");
        resultadosDiv.innerHTML = tablaMultiplicar.join("<br>");

        inputNumero.value = numero;
        inputLimiteSuperior.value = limiteSuperior;

        /* Sweet Alert2 cuando haya error */
        Swal.fire({
            icon: 'success',
            title: 'Operación completada',
            text: 'La tabla se ha calculado correctamente.',
        });

        registrarCombinacion(numero, limiteSuperior, operatorValue);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al realizar la operación. Por favor, inténtalo de nuevo.',
        });
        console.error(error);
    }
});

/* Sweet Alert2 para confirmar borrado de datos en la tabla */
clearButton.addEventListener("click", () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto borrará todos los resultados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar!'
    }).then((result) => {
        if (result.isConfirmed) {
            let resultadosDiv = document.getElementById("resultados");
            resultadosDiv.innerHTML = '';
            inputNumero.value = '';
            inputLimiteSuperior.value = '';
            guardarResultadosEnLocalStorage();

            /* Sweet Alert2 para mensaje de exito */
            Swal.fire(
                'Borrado!',
                'Todos los resultados han sido eliminados.',
                'success'
            );
        }
    });
});

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

/* Aqui establezco la clase active en el boton para cuando el usuario haga click en alguno de los botones de operacion */
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

/* funcion para guardar resultados en el local storage */
function guardarResultadosEnLocalStorage() {
    localStorage.setItem('tablaMultiplicar', JSON.stringify(ultimasCombinaciones));
}

window.addEventListener('load', () => {
    if (localStorage.getItem('tablaMultiplicar')) {
        ultimasCombinaciones = JSON.parse(localStorage.getItem('tablaMultiplicar'));
        llenarListaDesplegable();
    }
});
