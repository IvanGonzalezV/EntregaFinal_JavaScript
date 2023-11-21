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
    multiply: 'X',
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


/* NUEVO */
function iniciarModoQuiz() {
    Swal.fire({
        icon: 'info',
        title: 'Modo Quiz',
        text: 'Tienes 10 segundos para prepararte. ¡El quiz comenzará pronto!',
        timer: 10000,
        timerProgressBar: true,
        showConfirmButton: false
    }).then(() => {
        generarPreguntasQuiz();
    });
}

function generarPreguntasQuiz() {
    const preguntas = [];
    const operadores = ['sum', 'subtract', 'multiply', 'divide'];

    for (let i = 0; i < 12; i++) {
        const operador = operadores[Math.floor(Math.random() * operadores.length)];
        const numero1 = Math.floor(Math.random() * 10) + 1;
        const numero2 = Math.floor(Math.random() * 10) + 1;

        const pregunta = {
            numero1,
            numero2,
            operador,
            respuesta: calcularRespuesta(numero1, numero2, operador)
        };

        preguntas.push(pregunta);
    }

    // Reorganizar aleatoriamente el array de preguntas
    preguntas.sort(() => Math.random() - 0.5);

    realizarQuiz(preguntas);
}



function calcularRespuesta(numero1, numero2, operador) {
    switch (operador) {
        case 'sum':
            return numero1 + numero2;
        case 'subtract':
            return numero1 - numero2;
        case 'multiply':
            return numero1 * numero2;
        case 'divide':
            return numero1 / numero2;
        default:
            return 0;
    }
}

async function realizarQuiz(preguntas) {
    const resultadosQuizzDiv = document.getElementById('resultados-quizz');
    resultadosQuizzDiv.innerHTML = ''; // Limpiar div antes de mostrar los resultados del quiz

    for (const pregunta of preguntas) {
        const { value: respuestaUsuario } = await Swal.fire({
            icon: 'question',
            title: 'Pregunta',
            text: `Resuelve: ${pregunta.numero1} ${operatorSymbols[pregunta.operador]} ${pregunta.numero2}`,
            input: 'text',
            inputPlaceholder: 'Ingresa tu respuesta',
            showCancelButton: true,
            cancelButtonText: 'Saltar',
            confirmButtonText: 'Enviar'
        });

        if (respuestaUsuario === undefined) {
            // El usuario hizo clic en "Saltar"
            continue;
        }

        const esCorrecta = parseInt(respuestaUsuario) === pregunta.respuesta;

        const resultado = {
            pregunta: `${pregunta.numero1} ${operatorSymbols[pregunta.operador]} ${pregunta.numero2}`,
            respuestaUsuario,
            esCorrecta
        };

        mostrarResultadoQuizz(resultado);
    }
}


function mostrarResultadoQuizz(resultado) {
    const resultadosQuizzDiv = document.getElementById('resultados-quizz');
    const resultadoDiv = document.createElement('div');
    resultadoDiv.className = resultado.esCorrecta ? 'correcto' : 'incorrecto';
    resultadoDiv.innerHTML = `<p>${resultado.pregunta} = ${resultado.respuestaUsuario} (${resultado.esCorrecta ? 'Correcto' : 'Incorrecto'})</p>`;
    resultadosQuizzDiv.appendChild(resultadoDiv);
}

// Agregar el evento click para iniciar el modo quiz
const iniciarQuizButton = document.getElementById('iniciar-quiz-button');
iniciarQuizButton.addEventListener('click', iniciarModoQuiz);
