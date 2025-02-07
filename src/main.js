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
  /*La variable panel, alojara la informacion de la petición
    Las intersecciones .
    Y el valor resultado.
  */
  const panel = document.createElement('div');
  panel.classList.add('panel_datos_grafica');

  const panel_interseccion = document.createElement('ul');
  panel_interseccion.classList.add('panel_datos_grafica-intersecciones');

  const panel_grafica_valor = document.createElement('ul');
  panel_grafica_valor.classList.add('panel_datos_grafica__valor');

  informacion.allIntersections.forEach((interseccion, i) => {
    const item_punto_interseccion = document.createElement('li');

    item_punto_interseccion.innerHTML = `<strong>Interseccion #${
      i + 1
    }: </strong>(${interseccion.x},${interseccion.y}) `;
    panel_interseccion.appendChild(item_punto_interseccion);
  });

  let indice;

  const item_valor_interseccion_resultado = document.createElement('li');
  const item_valor_resultado = document.createElement('li');
  if (tipo == 'max') {
    indice = informacion.maxIndex;
    item_valor_resultado.innerHTML = `Valor maximo : ${informacion.maxValue}`;
  } else {
    indice = informacion.minIndex;
    item_valor_resultado.innerHTML = `Valor minimo : ${informacion.minValue}`;
  }

  item_valor_interseccion_resultado.innerHTML = `Interseccion resultado (${informacion.allIntersections[indice].x}, ${informacion.allIntersections[indice].y})`;

  console.log(
    `DATOS DE LA PETICION:
     - intersecciones: ${informacion.allIntersections}
     - valor_maximo : ${informacion.maxValue}
     - valor_minimo : ${informacion.minValue}
     - indice del valor_minimo : ${informacion.minIndex}
     - indice del valor_maximo : ${informacion.maxIndex}

     - indice prueba ${indice}
     - interseccion resultado (${informacion.allIntersections[indice].x}, ${informacion.allIntersections[indice].y})
    `
  );

  console.log(informacion.allIntersections[indice]);

  panel_grafica_valor.innerHTML = ``;
  panel_grafica_valor.appendChild(item_valor_interseccion_resultado);
  panel_grafica_valor.appendChild(item_valor_resultado);

  panel.appendChild(panel_grafica_valor);
  panel.appendChild(panel_interseccion);

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
  input.type = 'number';
  input.required = true;
  input.id = `${tipo}_input_${i + 1}`;
  input.classList.add('funcion_objetivo_input'); // Añadir clase para identificar los inputs de la función objetivo

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
  seccion_datos_grafica.innerHTML = ' ';
  seccion_datos_grafica.appendChild(panel_datos_grafica);

  graficar(funcion_objetivo_enviar, informacion);

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

window.validar_numeros = function validar_numeros(valor_nuevo) {
  if (!valor_nuevo || !valor_nuevo.value) {
    console.error('valor_nuevo no es un input válido ' + valor_nuevo.value);
    return '';
  }

  valor_nuevo.value = valor_nuevo.value.replace(/[^0-9./]/g, '');

  let partes = valor_nuevo.value.split('/');

  if (partes.length > 2) {
    valor_nuevo.value = partes[0] + '/' + partes[1];
  }

  for (let j = 0; j < partes.length; j++) {
    let subPartes = partes[j].split('.');
    if (subPartes.length > 2) {
      partes[j] = subPartes[0] + '.' + subPartes.slice(1).join('');
    }
  }

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

  for (let i = 0; i < cantidadVariables; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.required = true;
    input.id = `restriccion_${indice}_${i + 1}`;

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
  inputResultado.type = 'number';
  inputResultado.required = true;
  inputResultado.id = `restriccion_${indice}_resultado`;

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

  const cantidad_variables = parseInt(inputCantidadVariables.value);

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

  const createTable = (phaseResponses, phaseName) => {
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
          cell.textContent = value.toFixed(2); // Redondear a 2 decimales
          rowElement.appendChild(cell);
        });
        table.appendChild(rowElement);
      });

      // Agregar fila Z
      const zRow = document.createElement('tr');
      response.z.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = value.toFixed(2);
        zRow.appendChild(cell);
      });
      table.appendChild(zRow);

      // Agregar CX
      const cxRow = document.createElement('tr');
      const cxCell = document.createElement('td');
      cxCell.colSpan = headers.length;
      cxCell.textContent = 'Cx: ' + JSON.stringify(response.cx);
      cxRow.appendChild(cxCell);
      table.appendChild(cxRow);

      // Agregar CJ
      const cjRow = document.createElement('tr');
      const cjCell = document.createElement('td');
      cjCell.colSpan = headers.length;
      cjCell.textContent = 'Cj: ' + JSON.stringify(response.cj);
      cjRow.appendChild(cjCell);
      table.appendChild(cjRow);

      modalBody.appendChild(table);
    });
  };

  createTable(data.firstPhaseResponses, 'First Phase Responses');
  createTable(data.secondPhaseResponses, 'Second Phase Responses');

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
