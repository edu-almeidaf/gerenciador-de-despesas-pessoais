/**
 * Desabilita botão e mostra loading
 * @param {jQuery} $btn - Elemento jQuery do botão
 * @param {string} textoOriginal - Texto original do botão
 */
function loading($btn, textoOriginal) {
  $btn
    .data('texto-original', textoOriginal)
    .prop('disabled', true)
    .html(`
      <span class="loading loading-spinner loading-sm"></span>
      Aguarde...
    `);
}

/**
 * Restaura botão ao estado original
 * @param {jQuery} $btn - Elemento jQuery do botão
 */
function restaurar($btn) {
  const textoOriginal = $btn.data('texto-original') || 'Enviar';
  $btn
    .prop('disabled', false)
    .html(textoOriginal);
}

/**
 * Utilitário para controlar estado do botão durante requisições
 */
export const Button = {
  loading,
  restaurar
};

