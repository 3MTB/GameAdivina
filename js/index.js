//! getElements HTML
const $puntosAcumulados = document.querySelector("#puntosAcumulados strong");
const $nivel = document.querySelector("#nivel strong");
const $intentosRestantes = document.querySelector("#intentosRestantes strong");
const $puntosGanar = document.querySelector("#puntosGanar strong");
const $legend = document.querySelector("form fieldset legend strong");
const $aviso = document.querySelector(".avisos tbody");
const $input = document.querySelector("form fieldset label input");
const $btnSubmit = document.getElementById("btnSubmit");
const $btnHelp = document.getElementById("btnHelp");
const card = document.getElementById("card");
const $tablaPuntos = document.querySelector("#tablaPuntos tbody tr");

//! Card
const $card = document.getElementById("card");
const $infocard = document.querySelector("#card p");
const $titleCard = document.querySelector("#card h3");
const $contador = document.querySelector("#card p[role=alert] strong");
const otrosElementos = document.querySelectorAll("body > *:not(#card)");

//! Card

//! Card

//! getElements HTML

//! variables locales
let numeroEncontrar = 0;
const premio = [];
let nivel = 1;
let puntosAcumulados = 0;
let intentosRestantes = 0;
let puntosGanar = 0;
//! Variables Locales

addEventListener("DOMContentLoaded", () => {
  muestraCard(
    "information",
    "Explicacion del juego  <br><br>",
    `1- El juego es totalmente aleatorio....<br>2- Los intentos seran calculados en base a la dificultad de la ronda.<br>
 3- Para ganar, debes encontrar el numero antes de agotar tus intentos.<br>
   4- Cada vez que falles, se restara un intento y se eliminara el ultimo premio.`,
    10
  );
  iniciaRonda();
  // crear card explicado el juego
});

$input.addEventListener("input", () => {
  if ($input.value.length === 0) {
    $btnSubmit.disabled = true;
    while ($aviso.firstChild) {
      $aviso.removeChild($aviso.firstChild);
    }
  } else if (parseInt($input.value) > parseInt($input.getAttribute("max"))) {
    $btnSubmit.disabled = true;
    creaAviso(
      `El valor introducido debe ser menor o Igual al maximo establecido: ${$input.getAttribute(
        "max"
      )}`
    );
  } else if (parseInt($input.value) < parseInt($input.getAttribute("min"))) {
    $btnSubmit.disabled = true;
    creaAviso(
      `El valor introducido debe ser mayor o Igual al minimo establecido: ${$input.getAttribute(
        "min"
      )}`
    );
  } else {
    $btnSubmit.disabled = false;
    while ($aviso.firstChild) {
      $aviso.removeChild($aviso.firstChild);
    }
  }
});

addEventListener("click", (e) => {
  if (e.target === $btnSubmit) {
    if ($input.value.length > 0) {
      if (parseInt($input.value) === numeroEncontrar) {
        ganador();
        iniciaRonda();
      } else {
        perdedor();
      }
    }
    actualizaValores();
  } else if (e.target === $btnHelp) {
    muestraCard(
      "information",
      "Explicacion del juego  <br><br>",
      `1- El juego es totalmente aleatorio....<br>2- Los intentos seran calculados en base a la dificultad de la ronda.<br>
 3- Para ganar, debes encontrar el numero antes de agotar tus intentos.<br>
   4- Cada vez que falles, se restara un intento y se eliminara el ultimo premio.`,
      10
    );
  }
});

function iniciaRonda() {
  premio.length = 0;
  $input.value = "";
  $btnSubmit.disabled = true;
  generaNumeroEncontrar();
  const rango =
    parseInt($input.getAttribute("max")) - parseInt($input.getAttribute("min"));
  let longitudPremio = 0;
  if (rango >= 70) longitudPremio = 12;
  else if (rango >= 60) longitudPremio = 11;
  else if (rango >= 50) longitudPremio = 10;
  else if (rango >= 40) longitudPremio = 8;
  else if (rango >= 30) longitudPremio = 7;
  else if (rango >= 20) longitudPremio = 6;
  else if (rango >= 10) longitudPremio = 5;
  else if (rango >= 5) longitudPremio = 3;
  else if (rango >= 3) longitudPremio = 2;
  else longitudPremio = 1;
  generaPremio(longitudPremio);
  creaAviso("Partida Cargada");
  actualizaValores();
}

function generaNumeroEncontrar(max = null, min = null) {
  max =
    max === null || isNaN(max) || max <= 0
      ? Math.round(Math.random() * 100)
      : Math.round(max);
  min =
    min === null || isNaN(min) || min < 0
      ? Math.round(Math.random() * max)
      : Math.round(min);
  numeroEncontrar = Math.round(Math.random() * (max - min) + min);
  $input.setAttribute("max", max);
  $input.setAttribute("min", min);
  $legend.textContent = `${min} - ${max}`;
}

function generaPremio(longitud = null) {
  longitud =
    longitud === null || longitud < 1 || isNaN(longitud) ? 5 : longitud;
  premio.length = 0;
  for (let p = 1; p <= longitud; p++) {
    premio.unshift(p * 10);
  }
}

function actualizaValores() {
  while ($tablaPuntos.firstChild) {
    $tablaPuntos.removeChild($tablaPuntos.firstChild);
  }
  puntosGanar = 0;
  premio.forEach((p) => {
    const hijo = document.createElement("td");
    hijo.textContent = p;
    $tablaPuntos.appendChild(hijo);
    puntosGanar += p;
  });
  $puntosGanar.textContent = puntosGanar;
  $intentosRestantes.textContent = premio.length;
}

function ganador() {
  actualizaValores();
  creaAviso(
    `FELICIDADES HAS GANADO.... +${puntosGanar} puntos... Proximo desafio coming soon....`
  );

  puntosAcumulados += puntosGanar;
  $nivel.textContent = nivel;
  $puntosAcumulados.textContent = puntosAcumulados;
  ++nivel;
  muestraCard(
    "winner",
    "Felicidades has ganado",
    `Nivel: ${nivel} Actual... Niveles superados: ${nivel > 1 ? nivel - 1 : 0}
  Puntos Acumulados: ${puntosAcumulados} +${puntosGanar} Puntos`,
    3
  );
}

function perdedor() {
  const numeroIngresado = parseInt($input.value);
  creaAviso(
    numeroIngresado > numeroEncontrar
      ? "El numero ingresado es mayor"
      : "El numero ingresado es menor"
  );
  premio.pop();
  actualizaValores();
  if (premio.length == 0) {
    creaAviso("Ya no te quedan intentos :😞 Game Over");
    muestraCard(
      "loser",
      "Has perdido 😞😞",
      `Nivel: ${nivel} Actual... Niveles superados: ${nivel > 1 ? nivel - 1 : 0}
  Puntos Acumulados: ${puntosAcumulados} +${puntosGanar} Puntos`,
      3
    );
    iniciaRonda();
  }
}

function muestraCard(
  nameClass = null,
  titleCard = "error",
  infoCard = "error",
  segundos = 3
) {
  const $card = document.getElementById("card");
  const $infocard = document.querySelector("#card p");
  const $titleCard = document.querySelector("#card h3");
  const $contador = document.querySelector("#card p[role=alert] strong");
  const otrosElementos = document.querySelectorAll("body > *:not(#card)");

  otrosElementos.forEach((elemento) => {
    if (elemento.tagName.toLowerCase() !== "script") {
      elemento.style.display = "none";
    }
  });
  nameClass = nameClass === null ? "loser" : nameClass;
  $card.removeAttribute("class");

  $card.classList.toggle("card");
  $card.classList.toggle(nameClass);

  $titleCard.innerHTML = titleCard;
  $infocard.innerHTML = infoCard;

  let interval = setInterval(() => {
    if (segundos <= 0) {
      $card.removeAttribute("class");
      otrosElementos.forEach((elemento) => {
        if (elemento.tagName.toLowerCase() !== "script") {
          elemento.style.display = "flex";
        }
      });
      clearInterval(interval);
    }
    --segundos;
    $contador.textContent = segundos;
  }, 1000);
}

function creaAviso(message) {
  if (message.length > 0) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.textContent = `- ${message}`;
    tr.append(td);
    $aviso.appendChild(tr);
  }
}
