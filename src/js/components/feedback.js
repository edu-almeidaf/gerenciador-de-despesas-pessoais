import $ from 'jquery';

/**
 * Exibe mensagem de erro
 * @param {string} containerId - ID do container de mensagens
 * @param {string} mensagem - Mensagem a exibir
 */
function erro(containerId, mensagem) {
  const $container = $(`#${containerId}`);
  $container
    .removeClass('hidden alert-success')
    .addClass('alert-error')
    .html(`
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${mensagem}</span>
    `)
    .hide()
    .fadeIn(300);
}

/**
 * Exibe mensagem de sucesso
 * @param {string} containerId - ID do container de mensagens
 * @param {string} mensagem - Mensagem a exibir
 */
function sucesso(containerId, mensagem) {
  const $container = $(`#${containerId}`);
  $container
    .removeClass('hidden alert-error')
    .addClass('alert-success')
    .html(`
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${mensagem}</span>
    `)
    .hide()
    .fadeIn(300);
}

/**
 * Limpa/esconde a mensagem
 * @param {string} containerId - ID do container de mensagens
 */
function limpar(containerId) {
  $(`#${containerId}`).addClass('hidden').empty();
}

/**
 * Utilitários para exibir mensagens de feedback
 */
export const Feedback = {
  erro,
  sucesso,
  limpar
};

