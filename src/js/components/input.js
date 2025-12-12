import $ from 'jquery';

/**
 * Exibe erro inline abaixo do input
 * @param {jQuery} $input - Elemento jQuery do input
 * @param {string} mensagem - Mensagem de erro a exibir
 */
function mostrarErro($input, mensagem) {
  const inputId = $input.attr('id');
  let $erro = $(`#${inputId}-erro`);

  if (!$erro.length) {
    $erro = $(`<span id="${inputId}-erro" class="text-xs text-red-500 mt-1"></span>`);
    $input.closest('.form-control').append($erro);
  }

  $erro.text(mensagem).removeClass('hidden');
  $input.addClass('input-error').removeClass('input-success');
}

/**
 * Remove erro inline do input
 * @param {jQuery} $input - Elemento jQuery do input
 */
function limparErro($input) {
  const inputId = $input.attr('id');
  $(`#${inputId}-erro`).addClass('hidden');
  $input.removeClass('input-error');
}

/**
 * Marca campo como válido
 * @param {jQuery} $input - Elemento jQuery do input
 */
function marcarValido($input) {
  limparErro($input);
  $input.addClass('input-success');
}

/**
 * Configura validação de campo com handlers de blur e input
 * @param {jQuery} $input - Elemento jQuery do input
 * @param {Function} funcaoValidacao - Função que recebe o valor e retorna {valido, mensagem}
 * @param {Object} estadoValidacao - Objeto de estado de validação
 * @param {string} estadoKey - Chave do estado a ser atualizada
 */
function configurarValidacao($input, funcaoValidacao, estadoValidacao, estadoKey) {
  $input.on('blur', function() {
    const valor = $(this).val();

    if (valor.length > 0) {
      const resultado = funcaoValidacao(valor);

      if (!resultado.valido) {
        mostrarErro($(this), resultado.mensagem);
        estadoValidacao[estadoKey] = false;
      } else {
        marcarValido($(this));
        estadoValidacao[estadoKey] = true;
      }
    }
  });

  $input.on('input', function() {
    limparErro($(this));
  });
}

/**
 * Configura efeito de foco nos inputs
 * @param {string} seletor - Seletor jQuery dos inputs
 */
function configurarEfeitoFoco(seletor) {
  $(seletor).on('focus', function() {
    $(this).closest('.form-control').addClass('scale-[1.01]');
  }).on('blur', function() {
    $(this).closest('.form-control').removeClass('scale-[1.01]');
  });
}

/**
 * Utilitários para manipulação de inputs
 */
export const Input = {
  mostrarErro,
  limparErro,
  marcarValido,
  configurarValidacao,
  configurarEfeitoFoco
};

