/**
 * Formata data de ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
 * @param {string} dataISO - Data no formato YYYY-MM-DD
 * @returns {string} - Data no formato DD/MM/YYYY
 */
function formatarData(dataISO) {
  const [year, month, day] = dataISO.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Atualiza o estado visual do calendário (selecionado ou vazio)
 * @param {HTMLElement} displaySpan - Elemento que exibe a data
 * @param {HTMLElement} btnLimpar - Botão de limpar
 * @param {boolean} temData - Se há uma data selecionada
 */
function atualizarEstadoVisual(displaySpan, btnLimpar, temData) {
  if (temData) {
    displaySpan.classList.remove('text-zinc-400');
    displaySpan.classList.add('text-zinc-950');
    btnLimpar.classList.remove('hidden');
  } else {
    displaySpan.textContent = 'Selecionar data...';
    displaySpan.classList.remove('text-zinc-950');
    displaySpan.classList.add('text-zinc-400');
    btnLimpar.classList.add('hidden');
  }
}

/**
 * Handler para seleção de data no calendário
 * @param {Event} event - Evento de change
 * @param {Object} elementos - Elementos do DOM
 */
function handleDateChange(event, elementos) {
  const { displaySpan, hiddenInput, btnLimpar } = elementos;
  const selectedDate = event.target.value;

  hiddenInput.value = selectedDate;
  displaySpan.textContent = formatarData(selectedDate);

  atualizarEstadoVisual(displaySpan, btnLimpar, true);

  hiddenInput.dispatchEvent(new Event('change'));

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

/**
 * Handler para prevenir comportamento padrão no mousedown do botão limpar
 * @param {Event} event - Evento de mousedown
 */
function handleLimparMousedown(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Handler para limpar a data selecionada
 * @param {Event} event - Evento de click
 * @param {Object} elementos - Elementos do DOM
 */
function handleLimparClick(event, elementos) {
  const { callyWidget, displaySpan, hiddenInput, btnLimpar } = elementos;

  event.stopPropagation();
  event.preventDefault();

  callyWidget.value = '';
  hiddenInput.value = '';

  atualizarEstadoVisual(displaySpan, btnLimpar, false);

  hiddenInput.dispatchEvent(new Event('change'));
}

/**
 * Obtém os elementos do DOM necessários para o calendário
 * @returns {Object|null} - Elementos do DOM ou null se não encontrados
 */
function obterElementos() {
  const callyWidget = document.getElementById('cally-widget');
  const displaySpan = document.getElementById('data-display');
  const hiddenInput = document.getElementById('data-input');
  const btnLimpar = document.getElementById('btn-limpar');

  if (!callyWidget) return null;

  return { callyWidget, displaySpan, hiddenInput, btnLimpar };
}

/**
 * Configura os event listeners do calendário
 * @param {Object} elementos - Elementos do DOM
 */
function configurarEventListeners(elementos) {
  const { callyWidget, btnLimpar } = elementos;

  callyWidget.addEventListener('change', (event) => {
    handleDateChange(event, elementos);
  });

  btnLimpar.addEventListener('mousedown', handleLimparMousedown);

  btnLimpar.addEventListener('click', (event) => {
    handleLimparClick(event, elementos);
  });
}

/**
 * Inicializa o componente de calendário
 */
function init() {
  const elementos = obterElementos();

  if (!elementos) return;

  configurarEventListeners(elementos);
}

/**
 * Módulo de Calendário
 */
export const Calendar = {
  init,
  formatarData
};

document.addEventListener('DOMContentLoaded', init);

