document.addEventListener('DOMContentLoaded', () => {
  // Elementos de pantalla
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const pantallaJuego = document.getElementById('pantalla-juego');
  const pantallaFinal = document.getElementById('pantalla-final');

  const btnJugar = document.getElementById('btn-jugar');
  const btnReiniciar = document.getElementById('btn-reiniciar');

  const celdas = document.querySelectorAll('.celda');
  const bandeja = document.getElementById('bandeja-piezas');

  let piezaArrastrada = null;
  let offsetX = 0;
  let offsetY = 0;
  let elementoClon = null;

  // Eventos de botones
  btnJugar.addEventListener('click', iniciarJuego);
  btnReiniciar.addEventListener('click', iniciarJuego);

  function iniciarJuego() {
    pantallaInicio.classList.remove('activa');
    pantallaFinal.classList.remove('activa');
    pantallaJuego.classList.add('activa');

    crearYMezclarPiezas();
  }

  function crearYMezclarPiezas() {
    // Limpiar tablero y bandeja
    celdas.forEach(celda => celda.innerHTML = '');
    bandeja.innerHTML = '';

    // Crear array con los índices de 0 a 8
    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Mezclar aleatoriamente
    indices.sort(() => Math.random() - 0.5);

    indices.forEach(i => {
      const pieza = document.createElement('div');
      pieza.classList.add('pieza');
      pieza.dataset.index = i;

      // Calcular posición del recorte de la imagen (3x3 grid)
      const col = i % 3;
      const fila = Math.floor(i / 3);
      pieza.style.backgroundPosition = `-${col * 93}px -${fila * 98}px`;

      // Habilitar interacción táctil / mouse
      agregarEventosArrastre(pieza);
      bandeja.appendChild(pieza);
    });
  }

  function agregarEventosArrastre(pieza) {
    // Soporte unificado para touch y mouse usando PointerEvents
    pieza.addEventListener('pointerdown', (e) => {
      piezaArrastrada = pieza;
      pieza.classList.add('arrastrando');

      // Clon visual para arrastrar en celulares
      elementoClon = pieza.cloneNode(true);
      elementoClon.style.position = 'fixed';
      elementoClon.style.zIndex = '1000';
      elementoClon.style.pointerEvents = 'none';
      elementoClon.style.width = pieza.offsetWidth + 'px';
      elementoClon.style.height = pieza.offsetHeight + 'px';
      
      document.body.appendChild(elementoClon);
      moverClon(e);

      document.addEventListener('pointermove', alMover);
      document.addEventListener('pointerup', alSoltar);
    });
  }

  function moverClon(e) {
    if (elementoClon) {
      elementoClon.style.left = (e.clientX - 46) + 'px';
      elementoClon.style.top = (e.clientY - 49) + 'px';
    }
  }

  function alMover(e) {
    if (piezaArrastrada) {
      moverClon(e);
    }
  }

  function alSoltar(e) {
    if (!piezaArrastrada) return;

    if (elementoClon) {
      elementoClon.remove();
      elementoClon = null;
    }

    piezaArrastrada.classList.remove('arrastrando');

    // Detectar en qué celda o si cayó en el tablero
    const elementoBajoCursor = document.elementFromPoint(e.clientX, e.clientY);
    const celdaDestino = elementoBajoCursor ? elementoBajoCursor.closest('.celda') : null;

    if (celdaDestino && celdaDestino.children.length === 0) {
      celdaDestino.appendChild(piezaArrastrada);
    } else {
      bandeja.appendChild(piezaArrastrada);
    }

    piezaArrastrada = null;
    document.removeEventListener('pointermove', alMover);
    document.removeEventListener('pointerup', alSoltar);

    verificarVictoria();
  }

  function verificarVictoria() {
    let correctas = 0;

    celdas.forEach(celda => {
      const pieza = celda.firstElementChild;
      if (pieza && pieza.dataset.index === celda.dataset.index) {
        correctas++;
      }
    });

    if (correctas === 9) {
      setTimeout(() => {
        pantallaJuego.classList.remove('activa');
        pantallaFinal.classList.add('activa');
      }, 300);
    }
  }
});