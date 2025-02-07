import { Response } from './Response.js';
import { PhaseResponse } from './Response.js';

// Radio buttons destinados al tipo de ejercicio Maximización o Minimización
const radioButtonMaximo = document.getElementById('maximizacion');
const radioButtonMin = document.getElementById('minimizacion');

// Radio buttons destinados al metodo
const radiobutton_metodoGrafico = document.getElementById('metodoGrafico');
const radiobuttonmetodoDosPasos = document.getElementById('metodoDosPasos');

// seccion de la función objetivo
const seccionFuncionObjetivo = document.getElementById('funcionObjetivo');

// Campos pertenecientes a la funcion objetivo del metodo grafico
const campos_funcion_objetivo_grafico =
  document.getElementById('graficoCampos');

// Campos pertenecientes a la funcion objetivo del metodo dos faces
const campos_funcion_objetivo_dosFases =
  document.getElementById('dosFasesCampos');

// Sección de restricciones
const seccionRestricciones = document.getElementById('restricciones');
const imputCantidadRestricciones = document.getElementById(
  'cantidadRestricciones'
);

// Sección de la cantidad de variables
const seccionVariables = document.getElementById('variables');
const inputCantidadVariables = document.getElementById('cantidadDeVariables');

// Seccion para los datos de la grafica
const seccion_datos_grafica = document.querySelector('.data_graphics__data');

// Botones
const generarFuncionObjetivo = document.getElementById(
  'generarFuncionObjetivo'
);
const generarRestricciones = document.getElementById('generarRestricciones');
const camposRestricciones = document.getElementById('camposRestricciones');

// Formulario
const formulario = document.getElementById('dynamicForm');

let tipo = ''; //max o min
let metodo = ''; //grafico o dosfases

// Array que permitira guardar las restricciones transformadas
// para enviarlas a la peticion.
let restricciones__transformadas = [];

/*
  Funciones necesarias
*/

/* 
Crea la información asociada al resultado de la petición
*/
const crear_panel_informacion_graficos = (informacion) => {
  const panel = document.createElement('div');
  panel.classList.add('panel_datos_grafica');

  const titulo = document.createElement('p');
  titulo.classList.add('titulo');
  titulo.innerHTML = 'Resultados de la Intersección';
  panel.appendChild(titulo);

  let indice;
  const item_valor_interseccion_resultado = document.createElement('p');
  const item_valor_resultado = document.createElement('p');

  if (tipo == 'max') {
    indice = informacion.maxIndex;
    item_valor_resultado.innerHTML = `Valor máximo: ${informacion.maxValue}`;
  } else {
    indice = informacion.minIndex;
    item_valor_resultado.innerHTML = `Valor mínimo: ${informacion.minValue}`;
  }

  const interseccion = informacion.allIntersections[indice];
  item_valor_interseccion_resultado.innerHTML = `Intersección resultado: X<sub>1</sub> = ${interseccion.x}, X<sub>2</sub> = ${interseccion.y}`;

  console.log(
    `DATOS DE LA PETICION:
     - intersecciones: ${informacion.allIntersections}
     - valor_maximo : ${informacion.maxValue}
     - valor_minimo : ${informacion.minValue}
     - indice del valor_minimo : ${informacion.minIndex}
     - indice del valor_maximo : ${informacion.maxIndex}

     - indice prueba ${indice}
     - interseccion resultado (${interseccion.x}, ${interseccion.y})
    `
  );

  console.log(interseccion);

  panel.appendChild(item_valor_interseccion_resultado);
  panel.appendChild(item_valor_resultado);

  return panel;
};

/* Eventos de cuando se seleccione un radiobutton 
   ya sea Maximización o Minimización
*/

//Maximización
radioButtonMaximo.addEventListener('change', () => {
  tipo = 'max';
});

// Minimización
radioButtonMin.addEventListener('change', () => {
  tipo = 'min';
});

/* Mostrar campos según el radiobutton del método seleccionado Metodo grafico / Metodo dos pasos
 */

// Metodo grafico
radiobutton_metodoGrafico.addEventListener('change', () => {
  metodo = 'grafico';

  camposRestricciones.innerHTML = '';
  campos_funcion_objetivo_dosFases.innerHTML = ` `;

  seccionFuncionObjetivo.classList.remove('hidden'); //Sección de la funcion objetivo destinada al metodo de dos faces

  campos_funcion_objetivo_grafico.classList.remove('hidden');
  seccionRestricciones.classList.remove('hidden');

  seccionVariables.classList.add('hidden'); // Campo de variables destinado al metodo de dos faces
});

// Metodo dos pasos
radiobuttonmetodoDosPasos.addEventListener('change', () => {
  metodo = 'dosFases';
  inputCantidadVariables.required;

  //Ocultar secciones de la función objetivo
  campos_funcion_objetivo_grafico.classList.add('hidden'); // Ocultar campos específicos del método gráfico
  seccionFuncionObjetivo.classList.add('hidden');

  seccionRestricciones.classList.add('hidden');
  camposRestricciones.innerHTML = '';

  seccionVariables.classList.remove('hidden');

  //restricciones.classList.remove('hidden');
});

/*
  La funcion "crearCampos", permite crear el input individual de una funcion objetivo (destinado al coeficiente que acompaña la constante),
  junto a su simbolo (que puede ser "+" o "-").

  Esta se usa para la función objetivo del metodo de dos faces.
*/
const crearCampos = (campo, i, numero_variables, tipo) => {
  const input = document.createElement('input');
  input.type = 'text'; // Cambiar a 'text' para permitir fracciones
  input.required = true;
  input.id = `${tipo}_input_${i + 1}`;
  input.classList.add('funcion_objetivo_input'); // Añadir clase para identificar los inputs de la función objetivo

  // Agregar evento input para validar fracciones
  input.addEventListener('input', () => {
    validar_numeros(input);
  });

  campo.appendChild(input);

  if (i < numero_variables - 1 || tipo === 'restriccion') {
    const simbolo = document.createElement('select');
    simbolo.required = true;

    const opcionSuma = document.createElement('option');
    opcionSuma.value = '+';
    opcionSuma.textContent = '+';

    const opcionResta = document.createElement('option');
    opcionResta.value = '-';
    opcionResta.textContent = '-';

    simbolo.appendChild(opcionSuma);
    simbolo.appendChild(opcionResta);

    if (i === numero_variables - 1 && tipo === 'restriccion') {
      const opcionIgual = document.createElement('option');
      opcionIgual.value = '=';
      opcionIgual.textContent = '=';

      const opcionMayorIgual = document.createElement('option');
      opcionMayorIgual.value = '>=';
      opcionMayorIgual.textContent = '≥';

      const opcionMenorIgual = document.createElement('option');
      opcionMenorIgual.value = '<=';
      opcionMenorIgual.textContent = '≤';

      simbolo.appendChild(opcionIgual);
      simbolo.appendChild(opcionMayorIgual);
      simbolo.appendChild(opcionMenorIgual);
    }

    campo.appendChild(simbolo);
  }
};

generarFuncionObjetivo.addEventListener('click', () => {
  campos_funcion_objetivo_dosFases.innerHTML = '';

  const numero_variables = parseInt(inputCantidadVariables.value);

  for (let i = 0; i < numero_variables; i++) {
    crearCampos(
      campos_funcion_objetivo_dosFases,
      i,
      numero_variables,
      'funcion_objetivo'
    );
  }

  seccionFuncionObjetivo.classList.remove('hidden');
  campos_funcion_objetivo_dosFases.classList.remove('hidden');
  seccionRestricciones.classList.remove('hidden');
});

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  restricciones__transformadas.splice(0, restricciones__transformadas.length);

  alert(`El metodo seleccionado fue ${metodo}`);
  alert(`El tipo seleccionado fue ${tipo}`);

  let funcion_objetivo_enviar = '';

  const inputs_restricciones = Array.from(
    document.querySelectorAll('.restriccion')
  );
  console.log(inputs_restricciones);

  if (metodo == 'grafico') {
    const inputs_funcion_objetivo = Array.from(
      document.querySelectorAll('.funcion_objetivo_input')
    );

    inputs_funcion_objetivo.forEach((elemento, i) => {
      console.log(
        `Valor del input de la función objetivo ${i + 1}: ${elemento.value}`
      );
      funcion_objetivo_enviar = crearCadenaMetodoGrafico(
        funcion_objetivo_enviar,
        elemento.value,
        i
      );
    });

    inputs_restricciones.forEach((restriccion) => {
      const inputs = Array.from(restriccion.children);

      let restriccion_final = '';

      inputs.forEach((input, i) => {
        restriccion_final = crearCadenaMetodoGrafico(
          restriccion_final,
          input.value,
          i
        );
      });

      restricciones__transformadas.push(restriccion_final.trim());
    });
  } else {
    const inputs_funcion_objetivo = Array.from(
      document.querySelectorAll('#dosFasesCampos input')
    );

    inputs_funcion_objetivo.forEach((elemento, i) => {
      validar_numeros(elemento); // Validar fracciones antes de enviar

      console.log(
        `Valor del input de la función objetivo ${i + 1}: ${elemento.value}`
      );
      if (i === 0) {
        funcion_objetivo_enviar = `${elemento.value}x_${i + 1}`;
      } else {
        funcion_objetivo_enviar += ` + ${elemento.value}x_${i + 1}`;
      }
    });

    inputs_restricciones.forEach((restriccion) => {
      const inputs = Array.from(restriccion.children);

      let restriccion_final = '';
      let operador = '';

      inputs.forEach((input, i) => {
        if (input.tagName === 'INPUT') {
          validar_numeros(input); // Validar fracciones antes de enviar

          if (i < inputs.length - 1) {
            restriccion_final += `${input.value}x_${Math.floor(i / 2) + 1} `;
          } else {
            restriccion_final += `${input.value}`;
          }
        } else if (input.tagName === 'SELECT') {
          operador = input.options[input.selectedIndex].value;
          restriccion_final += `${operador} `;
        }
      });

      restricciones__transformadas.push(restriccion_final.trim());
    });
  }

  console.log(`restricciones transformadas: ${restricciones__transformadas}`);

  const informacion = await realizarPeticion(
    funcion_objetivo_enviar,
    restricciones__transformadas,
    tipo
  );

  const panel_datos_grafica = crear_panel_informacion_graficos(informacion);
  const resultPanel = document.getElementById('resultPanel');
  if (resultPanel) {
    resultPanel.innerHTML = '';
    resultPanel.appendChild(panel_datos_grafica);
  } else {
    console.error('El elemento resultPanel no se encontró en el DOM.');
  }

  seccion_datos_grafica.innerHTML = ' ';
  seccion_datos_grafica.appendChild(panel_datos_grafica);

  graficar(funcion_objetivo_enviar, informacion);

  // Agregar el botón dinámicamente
  const botonGenerarEnOtroMetodo = document.createElement('button');
  botonGenerarEnOtroMetodo.type = 'button';
  botonGenerarEnOtroMetodo.id = 'generarEnOtroMetodo';
  botonGenerarEnOtroMetodo.textContent = 'Generar en dos fases';
  botonGenerarEnOtroMetodo.addEventListener('click', async () => {
    const inputs_funcion_objetivo = Array.from(
      document.querySelectorAll('.funcion_objetivo_input')
    );

    let funcion_objetivo_enviar = '';

    inputs_funcion_objetivo.forEach((elemento, i) => {
      console.log(
        `Valor del input de la función objetivo ${i + 1}: ${elemento.value}`
      );
      funcion_objetivo_enviar = crearCadenaMetodoGrafico(
        funcion_objetivo_enviar,
        elemento.value,
        i
      );
    });

    const inputs_restricciones = Array.from(
      document.querySelectorAll('.restriccion')
    );

    let restricciones__transformadas = [];

    inputs_restricciones.forEach((restriccion) => {
      const inputs = Array.from(restriccion.children);

      let restriccion_final = '';

      inputs.forEach((input, i) => {
        restriccion_final = crearCadenaMetodoGrafico(
          restriccion_final,
          input.value,
          i
        );
      });

      restricciones__transformadas.push(restriccion_final.trim());
    });

    console.log(`restricciones transformadas: ${restricciones__transformadas}`);

    // Realizar una nueva petición al endpoint correspondiente
    const informacion = await realizarPeticionOtroMetodo(
      funcion_objetivo_enviar,
      restricciones__transformadas,
      tipo
    );

    mostrarResultados(informacion);
  });

  resultPanel.appendChild(botonGenerarEnOtroMetodo);

  alert(informacion);
});

const mapResponseToJSObject = (response) => {
  const mapPhaseResponse = (phaseResponse) => {
    return {
      tableau: phaseResponse.tableau.map((row) =>
        row.map((value) => Math.round(value * 10) / 10)
      ),
      z: phaseResponse.z.map((value) => Math.round(value * 10) / 10),
      cx: Object.fromEntries(
        Object.entries(phaseResponse.cx).map(([key, value]) => [
          key,
          Math.round(value * 10) / 10,
        ])
      ),
      cj: Object.fromEntries(
        Object.entries(phaseResponse.cj).map(([key, value]) => [
          key,
          Math.round(value * 10) / 10,
        ])
      ),
    };
  };

  return {
    firstPhaseResponses: response.firstPhaseResponses.map(mapPhaseResponse),
    secondPhaseResponses: response.secondPhaseResponses.map(mapPhaseResponse),
  };
};

const realizarPeticion = async (funcionObjetivo, arrayRestricciones, tipo) => {
  let urlPeticion;
  if (metodo == 'grafico') {
    urlPeticion =
      'https://graphicalmethodapi-dmd3bca6e6dpenev.canadacentral-01.azurewebsites.net/graphical-method/linear-problem';
  } else {
    urlPeticion =
      'https://graphicalmethodapi-dmd3bca6e6dpenev.canadacentral-01.azurewebsites.net/graphical-method/two-phases';
  }

  const body_de_peticion = {
    objectiveFunctionText: funcionObjetivo,
    restrictionsText: arrayRestricciones,
    isMaximization: tipo === 'max',
  };
  console.log(body_de_peticion);

  const response = await fetch(urlPeticion, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body_de_peticion),
  });

  const data = await response.json();
  console.log(data);

  if (metodo != 'grafico') {
    const mappedObject = mapResponseToJSObject(data);
    console.log(mappedObject);
    mostrarResultados(mappedObject);
  }

  return data;
};

const realizarPeticionOtroMetodo = async (funcionObjetivo, arrayRestricciones, tipo) => {
  const urlPeticion = 'https://graphicalmethodapi-dmd3bca6e6dpenev.canadacentral-01.azurewebsites.net/graphical-method/two-phases';

  const body_de_peticion = {
    objectiveFunctionText: funcionObjetivo,
    restrictionsText: arrayRestricciones,
    isMaximization: tipo === 'max',
  };
  console.log(body_de_peticion);

  const response = await fetch(urlPeticion, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body_de_peticion),
  });

  const data = await response.json();
  console.log(data);

  const mappedObject = mapResponseToJSObject(data);
  console.log(mappedObject);

  return mappedObject;
};

const validar_numeros = (valor_nuevo) => {
  if (!valor_nuevo || !valor_nuevo.value) {
    console.error('valor_nuevo no es un input válido ' + valor_nuevo.value);
    return '';
  }

  // Permitir solo números, puntos, barras y guiones
  valor_nuevo.value = valor_nuevo.value.replace(/[^0-9./-]/g, '');

  // Dividir el valor en partes por la barra de fracción
  let partes = valor_nuevo.value.split('/');

  // Si hay más de una barra de fracción, mantener solo la primera
  if (partes.length > 2) {
    valor_nuevo.value = partes[0] + '/' + partes[1];
  }

  // Validar cada parte del número
  for (let j = 0; j < partes.length; j++) {
    let subPartes = partes[j].split('.');
    if (subPartes.length > 2) {
      partes[j] = subPartes[0] + '.' + subPartes.slice(1).join('');
    }
  }

  // Si el valor es una fracción, calcular el valor decimal
  if (partes.length === 2 && partes[1] !== '') {
    let numerador = parseFloat(partes[0]);
    let denominador = parseFloat(partes[1]);

    if (!isNaN(numerador) && !isNaN(denominador) && denominador !== 0) {
      valor_nuevo.value = (numerador / denominador).toFixed(2);
    }
  }

  console.log('Numero final ' + valor_nuevo.value);

  return valor_nuevo;
};

document.getElementById('enviar__datos').addEventListener('click', function () {
  const Numero_1 = document.getElementById('Numero_1');
  const Numero_2 = document.getElementById('Numero_2');
  const EntradaCantidadRestricciones = document.getElementById(
    'cantidadRestricciones'
  );

  validar_numeros(Numero_1);
  validar_numeros(Numero_2);

  const cantidad_restricciones = parseInt(
    EntradaCantidadRestricciones?.value,
    10
  );

  if (isNaN(cantidad_restricciones) || cantidad_restricciones < 1) {
    console.error('Cantidad de restricciones no válida.');
    return;
  }

  for (let i = 0; i < cantidad_restricciones; i++) {
    const restriccion1 = document.getElementById(`restriccion_${i + 1}_1`);
    const restriccion2 = document.getElementById(`restriccion_${i + 1}_2`);
    const restriccionR = document.getElementById(
      `restriccion_${i + 1}_resultado`
    );

    if (restriccion1) {
      validar_numeros(restriccion1);
    } else {
      console.warn(`No se encontró la restricción restriccion_${i + 1}_1`);
    }

    if (restriccion2) {
      validar_numeros(restriccion2);
    } else {
      console.warn(`No se encontró la restricción restriccion_${i + 1}_2`);
    }

    if (restriccionR) {
      validar_numeros(restriccionR);
    } else {
      console.warn(
        `No se encontró la restricción restriccion_${i + 1}_resultado`
      );
    }
  }
});

const crearCadenaMetodoGrafico = (cadena, valor_nuevo, i) => {
  if (i == 0) {
    cadena = cadena + `${valor_nuevo}x`;
  } else if (i == 2) {
    cadena = cadena + `${valor_nuevo}y`;
  } else {
    cadena = cadena + `${valor_nuevo}`;
  }

  return cadena;
};

const crearRestriccion = (indice, cantidadVariables) => {
  const restriccion = document.createElement('div');
  restriccion.classList.add('restriccion');
  restriccion.id = `restriccion${indice}`;

  // Si el método es gráfico, forzar la cantidad de variables a 2
  if (metodo === 'grafico') {
    cantidadVariables = 2;
  }

  for (let i = 0; i < cantidadVariables; i++) {
    const input = document.createElement('input');
    input.type = 'text'; // Cambiar a 'text' para permitir decimales y fracciones
    input.required = true;
    input.id = `restriccion_${indice}_${i + 1}`;

    // Agregar evento input para validar decimales y fracciones
    input.addEventListener('input', () => {
      validar_numeros(input);
    });

    const simbolo = document.createElement('select');
    simbolo.required = true;

    const opcionSuma = document.createElement('option');
    opcionSuma.value = '+';
    opcionSuma.textContent = '+';

    const opcionResta = document.createElement('option');
    opcionResta.value = '-';
    opcionResta.textContent = '-';

    simbolo.appendChild(opcionSuma);
    simbolo.appendChild(opcionResta);

    restriccion.appendChild(input);
    if (i < cantidadVariables - 1) {
      restriccion.appendChild(simbolo);
    }
  }

  const simboloFinal = document.createElement('select');
  simboloFinal.required = true;

  const opcionIgual = document.createElement('option');
  opcionIgual.value = '=';
  opcionIgual.textContent = '=';

  const opcionMayorIgual = document.createElement('option');
  opcionMayorIgual.value = '>=';
  opcionMayorIgual.textContent = '≥';

  const opcionMenorIgual = document.createElement('option');
  opcionMenorIgual.value = '<=';
  opcionMenorIgual.textContent = '≤';

  simboloFinal.appendChild(opcionIgual);
  simboloFinal.appendChild(opcionMayorIgual);
  simboloFinal.appendChild(opcionMenorIgual);

  const inputResultado = document.createElement('input');
  inputResultado.type = 'text'; // Cambiar a 'text' para permitir decimales y fracciones
  inputResultado.required = true;
  inputResultado.id = `restriccion_${indice}_resultado`;

  // Agregar evento input para validar decimales y fracciones
  inputResultado.addEventListener('input', () => {
    validar_numeros(inputResultado);
  });

  restriccion.appendChild(simboloFinal);
  restriccion.appendChild(inputResultado);

  return restriccion;
};

generarRestricciones.addEventListener('click', () => {
  const cantidad_restricciones = parseInt(imputCantidadRestricciones.value);

  if (isNaN(cantidad_restricciones) || cantidad_restricciones <= 0) {
    alert('Por favor, ingrese una cantidad válida de restricciones.');
    return;
  }

  let cantidad_variables = parseInt(inputCantidadVariables.value);

  // Si el método es gráfico, forzar la cantidad de variables a 2
  if (metodo === 'grafico') {
    cantidad_variables = 2;
  }

  // Limpiar campos previos
  camposRestricciones.innerHTML = '';

  for (let i = 0; i < cantidad_restricciones; i++) {
    const restriccion = crearRestriccion(i + 1, cantidad_variables);
    camposRestricciones.appendChild(restriccion);
  }
});

const graficar = (funcionObjetivo, informacion) => {
  let elt = document.getElementById('calculator');
  elt.innerHTML = ` `;
  let calculator = Desmos.GraphingCalculator(elt);

  calculator.setBlank();

  informacion.allIntersections.forEach((interseccion, i) => {
    const punto_x = interseccion.x;
    const punto_y = interseccion.y;
    calculator.setExpression({
      id: `point${i + 1}`,
      latex: `(${punto_x},${punto_y})`,
      label: `Punto ${i + 1} `,
      showLabel: true,
    });
  });

  restricciones__transformadas.forEach((restriccion, i) => {
    // Reemplazar >= o <= por =
    restriccion = restriccion.replace(/(>=|<=|<|>)/, '=');
    calculator.setExpression({
      id: `func${i}`,
      latex: `${restriccion}`,
      label: `Restriccion`, // Etiqueta dinámica
      showLabel: true,
    });
  });

  if (tipo == 'max') {
    funcionObjetivo = funcionObjetivo + `= ${informacion.maxValue}`;
  } else {
    funcionObjetivo = funcionObjetivo + `= ${informacion.minValue}`;
  }
  calculator.setExpression({
    id: `funcOjetivo`,
    latex: `${funcionObjetivo}`,
    label: `F_objetivo`, // Etiqueta dinámica
    showLabel: true,
  });
};

const mostrarResultados = (data) => {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = '';

  const createTable = (phaseResponses, phaseName, isSecondPhase = false) => {
    const phaseTitle = document.createElement('h3');
    phaseTitle.textContent = phaseName;
    modalBody.appendChild(phaseTitle);

    phaseResponses.forEach((response, index) => {
      const table = document.createElement('table');
      table.classList.add('result-table');

      // Obtener las claves de CJ como encabezados y agregar 'B' al final
      const headers = [...Object.keys(response.cj), 'B'];

      // Crear fila de encabezados
      const headerRow = document.createElement('tr');
      headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Agregar filas del tableau
      response.tableau.forEach((row) => {
        const rowElement = document.createElement('tr');
        row.forEach((value) => {
          const cell = document.createElement('td');
          cell.textContent = decimalToFraction(value); // Convertir a fracción
          rowElement.appendChild(cell);
        });
        table.appendChild(rowElement);
      });

      // Agregar fila Z
      const zRow = document.createElement('tr');
      zRow.classList.add('z-row'); // Agregar la clase z-row
      response.z.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = decimalToFraction(value); // Convertir a fracción
        zRow.appendChild(cell);
      });
      table.appendChild(zRow);

      // Crear tabla interna para Cx
      const cxTable = document.createElement('table');
      cxTable.classList.add('inner-table');
      const cxHeaderRow = document.createElement('tr');
      const cxHeaderKey = document.createElement('th');
      cxHeaderKey.textContent = 'Cx';
      const cxHeaderValue = document.createElement('th');
      cxHeaderValue.textContent = 'Coeficiente';
      cxHeaderRow.appendChild(cxHeaderKey);
      cxHeaderRow.appendChild(cxHeaderValue);
      cxTable.appendChild(cxHeaderRow);

      Object.entries(response.cx).forEach(([key, value]) => {
        const cxRow = document.createElement('tr');
        const cxKeyCell = document.createElement('td');
        cxKeyCell.textContent = key;
        const cxValueCell = document.createElement('td');
        cxValueCell.textContent = decimalToFraction(value); // Convertir a fracción
        cxRow.appendChild(cxKeyCell);
        cxRow.appendChild(cxValueCell);
        cxTable.appendChild(cxRow);
      });

      // Crear tabla interna para Cj
      const cjTable = document.createElement('table');
      cjTable.classList.add('inner-table');
      const cjHeaderRow = document.createElement('tr');
      const cjHeaderKey = document.createElement('th');
      cjHeaderKey.textContent = 'Cj';
      const cjHeaderValue = document.createElement('th');
      cjHeaderValue.textContent = 'Coeficiente';
      cjHeaderRow.appendChild(cjHeaderKey);
      cjHeaderRow.appendChild(cjHeaderValue);
      cjTable.appendChild(cjHeaderRow);

      Object.entries(response.cj).forEach(([key, value]) => {
        const cjRow = document.createElement('tr');
        const cjKeyCell = document.createElement('td');
        cjKeyCell.textContent = key;
        const cjValueCell = document.createElement('td');
        cjValueCell.textContent = decimalToFraction(value); // Convertir a fracción
        cjRow.appendChild(cjKeyCell);
        cjRow.appendChild(cjValueCell);
        cjTable.appendChild(cjRow);
      });

      // Agregar las tablas internas a la tabla principal
      const cxRow = document.createElement('tr');
      const cxCell = document.createElement('td');
      cxCell.colSpan = headers.length;
      cxCell.appendChild(cxTable);
      cxRow.appendChild(cxCell);
      table.appendChild(cxRow);

      const cjRow = document.createElement('tr');
      const cjCell = document.createElement('td');
      cjCell.colSpan = headers.length;
      cjCell.appendChild(cjTable);
      cjRow.appendChild(cjCell);
      table.appendChild(cjRow);

      // Mostrar la respuesta final si es la segunda fase
      if (isSecondPhase && index === phaseResponses.length - 1) {
        const finalResultRow = document.createElement('tr');
        const finalResultCell = document.createElement('td');
        finalResultCell.colSpan = headers.length;
        finalResultCell.textContent = 'Respuesta final: ' + decimalToFraction(response.z[response.z.length - 1]);
        finalResultCell.style.fontWeight = 'bold';
        finalResultRow.appendChild(finalResultCell);
        table.appendChild(finalResultRow);
      }

      modalBody.appendChild(table);
    });
  };

  createTable(data.firstPhaseResponses, 'First Phase Responses');
  createTable(data.secondPhaseResponses, 'Second Phase Responses', true);

  modal.style.display = 'block';

  const span = document.getElementsByClassName('close')[0];
  span.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
};

const decimalToFraction = (decimal) => {
  if (decimal % 1 === 0) {
    return decimal.toString();
  }

  const gcd = (a, b) => {
    if (b < 0.0000001) return a;
    return gcd(b, Math.floor(a % b));
  };

  const len = decimal.toString().length - 2;
  let denominator = Math.pow(10, len); // Cambiar const a let
  let numerator = decimal * denominator; // Cambiar const a let

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  return Math.floor(numerator) + '/' + Math.floor(denominator);
};
