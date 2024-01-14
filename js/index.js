try {
  //!                Variables Locales
  const TipoAvisos = {
    information: "info",
    warning: "warning",
    error: "error",
  };
  const tipoCard = {
    information: "information",
    winner: "winner",
    loser: "loser",
  };
  let cardInterval = setInterval(0);
  let avisoTimeout = setTimeout(0);

  let numeroEncontrar = 0;
  const premio = [0];
  let nivel = 1;
  let puntosAcumulados = 0;
  let puntosGanar = 0;

  const $input = document.querySelector("form fieldset label input");
  const $btnSubmit = document.getElementById("btnSubmit");

  //! --         Variables Locales

  addEventListener("DOMContentLoaded", () => {
    explicacionJuego();
    iniciaRonda();
  });
  addEventListener("click", (e) => {
    if (e.target === document.getElementById("btnHelp")) {
      explicacionJuego();
    } else if (e.target === document.getElementById("btnCloseCard")) {
      makeCard(null, null, null, true, null);
    } else if (e.target === $btnSubmit) {
      if ($input.value.length > 0) {
        if (parseInt($input.value) === numeroEncontrar) {
          winner();
          iniciaRonda();
        } else {
          loser();
        }
      }
    }
  });

  $input.addEventListener("input", () => {
    if ($input.value.length === 0) {
      $btnSubmit.disabled = true;
      makeAviso(null, null, null, true);
    } else if (parseInt($input.value) > parseInt($input.getAttribute("max"))) {
      $btnSubmit.disabled = true;
      makeAviso(
        `El valor introducido debe ser inferior o Igual al maximo establecido: ${$input.getAttribute(
          "max"
        )}`,
        TipoAvisos.error,
        3
      );
    } else if (parseInt($input.value) < parseInt($input.getAttribute("min"))) {
      $btnSubmit.disabled = true;
      makeAviso(
        `El valor introducido debe ser mayor o Igual al minimo establecido: ${$input.getAttribute(
          "min"
        )}`,
        TipoAvisos.error,
        3
      );
    } else {
      $btnSubmit.disabled = false;
      makeAviso(null, null, null, true);
    }
  });
  //!                   F U N C I O N E S
  function explicacionJuego() {
    makeCard(
      tipoCard.information,
      "Funcionamiento del JUEGO",
      6,
      false,
      " - El juego consiste en adivinar un numero generado aleatoriamente, entre un rango determinado con una cantidad de intentos determinada.",
      " - Los intentos seran calculados en base a la longitud de lrango de valores posibles.",
      " - A mayor Dificultad mayor cantidad de intentos y premios.",
      " - Cada vez que no aciertes, sete eliminara un intento y un premio.",
      " - Si logras encontrar el numero, obtendras el premio establecido y pasaras a otra ronda."
    );
  }

  function makeAviso(
    message = null,
    tipo = null,
    tiempo = null,
    cancelar = false
  ) {
    clearTimeout(avisoTimeout);

    const $aviso = document.getElementById("aviso");
    $aviso.classList.remove(...$aviso.classList);
    $aviso.textContent = " ";
    if (cancelar) return;
    message = message === null ? " Message Undefined" : message;
    tipo = tipo === null ? TipoAvisos.information : tipo;
    tiempo = tiempo === null || typeof tiempo !== "number" ? 3 : tiempo;

    $aviso.classList.add("aviso");
    $aviso.classList.add(tipo);
    $aviso.textContent = message;
    avisoTimeout = setTimeout(() => {
      $aviso.classList.remove(...$aviso.classList);
      $aviso.textContent = " ";
      clearTimeout(avisoTimeout);
    }, tiempo * 1000);
  }

  function makeCard(
    tipo = null,
    title = null,
    segundos = 3,
    cancelar = false,
    ...description
  ) {
    const $card = document.getElementById("card");
    const $otrosElementos = document.querySelectorAll("body > *:not(#card)");
    $card.classList.remove(...$card.classList);

    if (cancelar) {
      $card.classList.remove(...$card.classList);
      $otrosElementos.forEach((elemento) => {
        if (elemento.tagName.toLowerCase() !== "script") {
          elemento.style.display = "flex";
        }
      });
      clearInterval(cardInterval);
      // alert("Card Ocultada");
      return;
    }
    tipo = tipo === null ? tipoCard.information : tipo;
    title = title === null ? "TITLE UNDEFINED" : title;
    description =
      description.length > 0 ? description : "DESCRIPTION UNDEFINED";

    const $title = document.querySelector("#card h3");
    $title.textContent = title;

    const $description = document.querySelector("#card p");
    const $contador = document.querySelector("#card p[role=alert] span");
    $card.classList.add("card");
    $card.classList.add(tipo);
    $otrosElementos.forEach((elemento) => {
      if (elemento.tagName.toLowerCase() !== "script") {
        elemento.style.display = "none";
      }
    });
    $description.textContent = "";
    description.forEach((text) => {
      $description.innerHTML += `${text} <br>`;
    });

    cardInterval = setInterval(() => {
      if (segundos <= 0) {
        $card.classList.remove(...$card.classList);
        $otrosElementos.forEach((elemento) => {
          if (elemento.tagName.toLowerCase() !== "script") {
            elemento.style.display = "flex";
          }
        });
        $description.textContent = "";
        clearInterval(cardInterval);
      }
      --segundos;
      $contador.textContent = segundos;
    }, 1000);
  }

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
    actualizaValores();
    makeAviso("Partida Cargada", TipoAvisos.information, 3);
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
    document.querySelector("#puntosGanar span").textContent = puntosGanar;
    document.querySelector("#intentosRestantes span").textContent =
      premio.length;
  }

  function winner() {
    actualizaValores();
    makeAviso(
      `Felicidades Has Acertado....+${puntosGanar} 🏆`,
      TipoAvisos.information,
      8
    );

    document.querySelector("#nivel span").textContent = nivel;
    puntosAcumulados += puntosGanar;
    document.querySelector("#puntosAcumulados span").textContent =
      puntosAcumulados;
    ++nivel;
    makeCard(
      tipoCard.winner,
      "Felicidades has ganado",
      7,
      false,
      `Nivel Superado`,
      `+🏆${puntosGanar}`,
      `Puntos acumulados: ${puntosAcumulados}`,
      `Niveles superados: ${nivel > 1 ? nivel - 1 : 0}`
    );
  }

  function loser() {
    premio.pop();
    if (premio.length === 0) {
      makeCard(
        tipoCard.loser,
        "Has perdido. ",
        8,
        false,
        "Ya no te quedan intentos",
        `Niveles superados: ${nivel > 1 ? nivel - 1 : 0}`,
        `Puntos Acumulados: ${puntosAcumulados}`
      );
      iniciaRonda();
      makeAviso(
        `Felicidades Has Acertado....+${puntosGanar} 🏆`,
        TipoAvisos.information,
        2
      );
      return;
    }

    const numeroIngresado = parseInt($input.value);
    makeAviso(
      `El numero a ingresar es   ${
        numeroIngresado < numeroEncontrar ? "mayor🎈" : "menor↙️"
      }`,
      TipoAvisos.warning,
      3
    );

    actualizaValores();
  }
} catch (error) {
  alert(
    `Ha ocurrido un error de nuestra parte :( [${error}]. Intentaremos Reiniciar el sistema.... Si el problema persiste, contacta a soporte.`
  );
  console.error(
    `Ha ocurrido un error de nuestra parte :( [${error} :${error.stack}]. Intentaremos Reiniciar el sistema.... Si el problema persiste, contacta a soporte.`
  );
  iniciaRonda();
}
