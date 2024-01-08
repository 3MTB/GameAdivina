//! getElements HTML

// const $intentosRestantes = document.querySelector("#intentosRestantes span");
// const $puntosGanar = document.querySelector("#puntosGanar span");
// const $legend = document.querySelector("form fieldset legend span");
const $input = document.querySelector("form fieldset label input");
const $btnSubmit = document.getElementById("btnSubmit");
// const $btnHelp = document.getElementById("btnHelp");
// const card = document.getElementById("card");

// const $card = document.getElementById("card");
// const $infocard = document.querySelector("#card p");
// const $titleCard = document.querySelector("#card h3");
// const $contador = document.querySelector("#card p[role=alert] span");
// const otrosElementos = document.querySelectorAll("body > *:not(#card)");
// const $btnCloseCard = document.getElementById("btnCloseCard");

//! variables locales
let numeroEncontrar = 0;
const premio = [];
let nivel = 1;
let puntosAcumulados = 0;
let intentosRestantes = 0;
let puntosGanar = 0;
let avisoTimeout = setTimeout(()=>{},0);
//! Variables Locales
try {
  addEventListener("DOMContentLoaded", () => {
    muestraCard(
      "information",
      "Explicacion del juego",
      `1- El juego es totalmente aleatorio....
      <br>2- 
      Los intentos seran calculados en 
      base a la dificultad de la ronda
      .<br>
 3- Para ganar, debes encontrar el numero antes de agotar tus intentos.<br>
   4- Cada vez que falles, se 
   restara un intento y se eliminara el ultimo premio.`,
      10
    );

    iniciaRonda();
  });

  $input.addEventListener("input", () => {
    clearTimeout(avisoTimeout);
    if ($input.value.length === 0) {
      $btnSubmit.disabled = true;
      clearTimeout(avisoTimeout);
    } else if (parseInt($input.value) > parseInt($input.getAttribute("max"))) {
      $btnSubmit.disabled = true;
      creaAviso(
        `El valor introducido debe ser inferior o Igual al maximo establecido: ${$input.getAttribute(
          "max"
        )}`,
        "warning",
        3
      );
    } else if (parseInt($input.value) < parseInt($input.getAttribute("min"))) {
      $btnSubmit.disabled = true;
      creaAviso(
        `El valor introducido debe ser mayor o Igual al minimo establecido: ${$input.getAttribute(
          "min"
        )}`,
        "warning",
        3
      );
    } else {
      $btnSubmit.disabled = false;
      clearTimeout(avisoTimeout);

      // clearTimeout(avisoTimeout);
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
    } else if (e.target === document.getElementById("btnHelp")) {
      muestraCard(
        "information",
        "Explicacion del juego  <br><br>",
        `1- El juego es totalmente aleatorio....<br>2- Los intentos s eran calculados en base a la dificultad de la ronda.<br>
 3- Para ganar, debes encontrar el numero antes de agotar tus intentos.<br>
   4- Cada vez que falles, se restara un intento y se eliminara el ultimo premio.`,
        10
      );
    } else if (e.target === document.getElementById("btnCloseCard")) {
      muestraCard(null, " ", " ", 0, true);
    }
  });

  function iniciaRonda() {
    premio.length = 0;
    $input.value = "";
    $btnSubmit.disabled = true;
    generaNumeroEncontrar();
    const rango =
      parseInt($input.getAttribute("max")) -
      parseInt($input.getAttribute("min"));
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
    // creaAviso("Partida Cargada", "info", 4);
    actualizaValores();
  }

  function generaNumeroEncontrar() {
    let max = Math.round(Math.random() * (100 - 3) + 3);

    let min = Math.round(Math.random() * (max - 2));

    numeroEncontrar = Math.round(Math.random() * (max - min) + min);
    $input.setAttribute("max", max);
    $input.setAttribute("min", min);
    document.querySelector(
      "form fieldset legend span"
    ).textContent = `${min} - ${max}`;
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
    const $tablaPuntos = document.querySelector("#tablaPuntos tbody tr");
    // console.log($tablaPuntos);
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
    // console.log(document.querySelector("#puntosGanar strong"));
    // const $tablaPuntos = document.querySelector("#tablaPuntos theaad td #puntosGanar span")

    // document.querySelector("#puntosGanar span").textContent = puntosGanar;
    // document.querySelector("#intentosRestantes span").textContent =
    //   premio.length;
  }

  function ganador() {
    actualizaValores();
    creaAviso(
      `FELICIDADES HAS GANADO.... +${puntosGanar} puntos... `,
      "info",
      3
    );
    document.querySelector("#nivel span").textContent = nivel;
    puntosAcumulados += puntosGanar;
    document.querySelector("#puntosAcumulados span").textContent =
      puntosAcumulados;
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
        : "El numero ingresado es menor",
      "warning",
      4
    );
    premio.pop();

    actualizaValores();
    if (premio.length == 0) {
      creaAviso("Ya no te quedan intentos :😞 Game Over", "error", 4);
      muestraCard(
        "loser",
        "Has perdido 😞😞",
        `Nivel: ${nivel} Actual... Niveles superados: ${
          nivel > 1 ? nivel - 1 : 0
        }
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
    segundos = 3,
    cancelar = false
  ) {
    let cardInterval = setInterval(() => {}, 0);

    const $card = document.getElementById("card");
    const otrosElementos = document.querySelectorAll("body > *:not(#card)");
    if (cancelar) {
      $card.classList.remove(...$card.classList);
      otrosElementos.forEach((elemento) => {
        if (elemento.tagName.toLowerCase() !== "script") {
          elemento.style.display = "flex";
        }
      });
      clearInterval(cardInterval);
      return;
    }

    const $infocard = document.querySelector("#card p");
    const $titleCard = document.querySelector("#card h3");
    const $contador = document.querySelector("#card p[role=alert] span");

    otrosElementos.forEach((elemento) => {
      if (elemento.tagName.toLowerCase() !== "script") {
        elemento.style.display = "none";
      }
    });
    nameClass = nameClass === null ? "loser" : nameClass;
    $card.classList.remove(...$card.classList);

    $card.classList.add("card");
    $card.classList.add(nameClass);

    $titleCard.innerHTML = titleCard;
    $infocard.innerHTML = infoCard;

    cardInterval = setInterval(() => {
      if (segundos <= 0) {
        $card.classList.remove(...$card.classList);
        otrosElementos.forEach((elemento) => {
          if (elemento.tagName.toLowerCase() !== "script") {
            elemento.style.display = "flex";
          }
        });
        clearInterval(cardInterval);
      }
      --segundos;
      $contador.textContent = segundos;
    }, 1000);
  }
  function creaAviso(message = null, tipo = "info", tiempo = 2) {
    clearTimeout(avisoTimeout);
    if (message.length > 0 && message !== null) {
      const $aviso = document.getElementById("aviso");

      $aviso.classList.remove(...$aviso.classList);
      // $aviso.classList.remove("warning");
      // $aviso.classList.remove("error");

      $aviso.classList.add("aviso");
      $aviso.classList.add(tipo);
      $aviso.textContent = message;
      avisoTimeout = setTimeout(() => {
        $aviso.classList.remove(...$aviso.classList);
        // $aviso.classList.remove("info");
        // $aviso.classList.remove("warning");
        // $aviso.classList.remove("error");
        $aviso.setAttribute("hidden", true);
      }, tiempo * 1000);
    }
  }
} catch (error) {
  alert(
    `Ha ocurrido un error de nuestra parte :( [${error}]. Reiniciaremos el sistema.... Si el problema persiste, contacta a soporte.`
  );
  console.error(
    `Ha ocurrido un error de nuestra parte :( [${error}]. Reiniciaremos el sistema.... Si el problema persiste, contacta a soporte.`
  );
  iniciaRonda();
}
