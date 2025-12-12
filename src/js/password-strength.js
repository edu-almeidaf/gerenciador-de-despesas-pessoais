import $ from 'jquery';

/**
 * Atualiza o indicador visual de força da senha
 * @param {string} senha - Senha digitada
 * @param {jQuery} $indicator - Elemento do indicador de força
 * @param {Object} forca - Objeto com {porcentagem, cor, nivel}
 */
function atualizarIndicador(senha, $indicator, forca) {
  if (senha.length === 0) {
    $indicator.css('display', 'none');
    return;
  }

  $indicator.css('display', 'flex');

  const $progress = $indicator.find('progress');
  const $texto = $indicator.find('span');

  $progress.val(forca.porcentagem);
  $progress
    .removeClass('progress-error')
    .removeClass('progress-warning')
    .removeClass('progress-success')
    .addClass(`progress-${forca.cor}`);

  $texto
    .text(forca.nivel)
    .removeClass('text-red-500')
    .removeClass('text-yellow-600')
    .removeClass('text-green-600');

  if (forca.cor === 'error') {
    $texto.addClass('text-red-500');
  } else if (forca.cor === 'warning') {
    $texto.addClass('text-yellow-600');
  } else {
    $texto.addClass('text-green-600');
  }
}

/**
 * Atualiza indicadores visuais dos requisitos de senha
 * @param {string} senha - Senha digitada
 * @param {jQuery} $requisitos - Elemento container dos requisitos
 */
function atualizarRequisitos(senha, $requisitos) {
  if (!$requisitos.length) return;

  $requisitos.removeClass('hidden');

  const requisitos = {
    tamanho: senha.length >= 6,
    letra: /[a-zA-Z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha)
  };

  Object.keys(requisitos).forEach(key => {
    const $item = $(`#req-${key}`);
    if ($item.length) {
      if (requisitos[key]) {
        $item.removeClass('text-zinc-400').addClass('text-green-600');
        $item.find('svg').html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>');
      } else {
        $item.removeClass('text-green-600').addClass('text-zinc-400');
        $item.find('svg').html('<circle cx="12" cy="12" r="10"/>');
      }
    }
  });
}

/**
 * Esconde o indicador de força e requisitos
 * @param {jQuery} $indicator - Elemento do indicador de força
 * @param {jQuery} $requisitos - Elemento container dos requisitos
 */
function esconderIndicadores($indicator, $requisitos) {
  $indicator.css('display', 'none');
  $requisitos.addClass('hidden');
}

/**
 * Utilitários para indicador de força de senha
 */
export const PasswordStrength = {
  atualizarIndicador,
  atualizarRequisitos,
  esconderIndicadores
};

