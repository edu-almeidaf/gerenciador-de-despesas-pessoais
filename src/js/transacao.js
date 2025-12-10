import $ from 'jquery';
import 'jquery-mask-plugin';
import { Auth, Feedback, Button } from './auth.js';

const API_URL = 'http://localhost:3001';

/**
 * Padrões REGEX para validação
 */
const Patterns = {
  // Descrição: letras, números, espaços, acentos e pontuação básica
  descricao: /^[a-zA-ZÀ-ÿ0-9\s.,!?()-]+$/,
  // Valor monetário formatado: 1.234,56
  valorMonetario: /^\d{1,3}(\.\d{3})*(,\d{2})?$/,
  // Data no formato ISO: YYYY-MM-DD
  dataISO: /^\d{4}-\d{2}-\d{2}$/
};

$(document).ready(function() {
  // Verifica autenticação
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) {
    return;
  }

  // Inicializa máscara monetária no campo de valor
  inicializarMascaraMonetaria();

  // Inicializa data com a data atual
  inicializarDataAtual();

  // Inicializa validações em tempo real
  inicializarValidacoesTempoReal();

  // Handler do formulário
  $('#form-transacao').on('submit', function(e) {
    e.preventDefault();
    salvarTransacao(usuario.id);
  });

  // Atualiza avatar
  const iniciais = usuario.nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  $('.avatar-inicial').text(iniciais);
  $('#usuario-email').text(usuario.email);

  // Handler de logout
  $('#btn-logout').on('click', function(e) {
    e.preventDefault();
    $('main').addClass('animate-exit');
    setTimeout(function() {
      Auth.logout();
    }, 300);
  });

});

/**
 * Exibe erro inline abaixo do input
 */
function mostrarErroInline($input, mensagem) {
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
 * Remove erro inline
 */
function limparErroInline($input) {
  const inputId = $input.attr('id');
  $(`#${inputId}-erro`).addClass('hidden');
  $input.removeClass('input-error');
}

/**
 * Marca campo como válido
 */
function marcarValido($input) {
  limparErroInline($input);
  $input.addClass('input-success');
}

/**
 * Inicializa validações em tempo real nos campos
 */
function inicializarValidacoesTempoReal() {
  // ========== VALIDAÇÃO DA DESCRIÇÃO ==========
  $('#descricao').on('blur', function() {
    const descricao = $(this).val().trim();
    const $input = $(this);

    if (descricao.length > 0) {
      const resultado = validarDescricao(descricao);

      if (!resultado.valido) {
        mostrarErroInline($input, resultado.mensagem);
      } else {
        marcarValido($input);
      }
    }
  });

  $('#descricao').on('input', function() {
    limparErroInline($(this));
  });

  // ========== VALIDAÇÃO DO VALOR ==========
  $('#valor').on('blur', function() {
    const valorStr = $(this).val();
    const $input = $(this);

    if (valorStr.length > 0) {
      const resultado = validarValor(valorStr);

      if (!resultado.valido) {
        mostrarErroInline($input, resultado.mensagem);
      } else {
        marcarValido($input);
      }
    }
  });

  // ========== VALIDAÇÃO DA CATEGORIA ==========
  $('#categoria').on('change', function() {
    const categoria = $(this).val();
    const $input = $(this);

    if (categoria) {
      marcarValido($input);
    }
  });
}

/**
 * Inicializa o campo de valor com comportamento estilo app de banco
 * Digita da direita para esquerda, sempre com 2 casas decimais
 */
function inicializarMascaraMonetaria() {
  const $valor = $('#valor');

  // Valor interno em centavos
  let centavos = 0;

  // Inicia com 0,00
  $valor.val(formatarCentavos(centavos));

  // Formata centavos para exibição (ex: 159 -> "1,59")
  function formatarCentavos(cents) {
    const valor = (cents / 100).toFixed(2);
    // Formata com separador de milhar brasileiro
    return valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Captura teclas para controle total
  $valor.on('keydown', function(e) {
    const key = e.key;

    // Permite: Tab, Enter, setas (navegação)
    if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      return true;
    }

    // Previne comportamento padrão
    e.preventDefault();

    // Backspace - remove último dígito
    if (key === 'Backspace') {
      centavos = Math.floor(centavos / 10);
      $valor.val(formatarCentavos(centavos));
      atualizarFeedback();
      return false;
    }

    // Delete - zera o valor
    if (key === 'Delete') {
      centavos = 0;
      $valor.val(formatarCentavos(centavos));
      atualizarFeedback();
      return false;
    }

    // Apenas números (0-9)
    if (/^[0-9]$/.test(key)) {
      // Limite máximo (999.999.999,99 = 99999999999 centavos)
      if (centavos > 9999999999) {
        return false;
      }

      // Adiciona dígito à direita
      centavos = centavos * 10 + parseInt(key);
      $valor.val(formatarCentavos(centavos));
      atualizarFeedback();
      return false;
    }

    return false;
  });

  // Previne colar texto
  $valor.on('paste', function(e) {
    e.preventDefault();
    const pastedText = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
    // Tenta extrair apenas números
    const numeros = pastedText.replace(/\D/g, '');
    if (numeros) {
      centavos = parseInt(numeros) || 0;
      // Limita ao máximo
      if (centavos > 99999999999) centavos = 99999999999;
      $valor.val(formatarCentavos(centavos));
      atualizarFeedback();
    }
  });

  // Atualiza feedback visual
  function atualizarFeedback() {
    limparErroInline($valor);
    if (centavos > 0) {
      $valor.removeClass('input-error').addClass('input-success');
    } else {
      $valor.removeClass('input-success').removeClass('input-error');
    }
  }

  // Ao focar, posiciona cursor no final
  $valor.on('focus', function() {
    const len = $(this).val().length;
    this.setSelectionRange(len, len);
  });

  // Expõe função para obter valor em centavos (para validação)
  $valor.data('getCentavos', function() {
    return centavos;
  });
}

/**
 * Inicializa o campo de data com a data atual
 */
function inicializarDataAtual() {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');

  $('#data-display').text(dataFormatada).removeClass('text-zinc-400').addClass('text-amber-900');
  $('#data-input').val(hoje.toISOString().split('T')[0]);
  $('#btn-limpar').removeClass('hidden');
}

/**
 * Converte valor formatado (1.234,56) para número (1234.56)
 * @param {string} valorFormatado - Valor com máscara
 * @returns {number} - Valor numérico
 */
function converterParaNumero(valorFormatado) {
  if (!valorFormatado) return 0;
  // Remove pontos de milhar e troca vírgula por ponto
  return parseFloat(valorFormatado.replace(/\./g, '').replace(',', '.')) || 0;
}

/**
 * Valida a descrição da transação
 * @param {string} descricao - Descrição a validar
 * @returns {Object} - { valido: boolean, mensagem: string }
 */
function validarDescricao(descricao) {
  if (!descricao || descricao.trim() === '') {
    return { valido: false, mensagem: 'A descrição é obrigatória' };
  }

  descricao = descricao.trim();

  if (descricao.length < 3) {
    return { valido: false, mensagem: 'A descrição deve ter pelo menos 3 caracteres' };
  }

  if (descricao.length > 100) {
    return { valido: false, mensagem: 'A descrição deve ter no máximo 100 caracteres' };
  }

  if (!Patterns.descricao.test(descricao)) {
    return { valido: false, mensagem: 'A descrição contém caracteres inválidos' };
  }

  return { valido: true, mensagem: '' };
}

/**
 * Valida o valor da transação
 * @param {string} valorStr - Valor formatado a validar
 * @returns {Object} - { valido: boolean, mensagem: string, valor: number }
 */
function validarValor(valorStr) {
  if (!valorStr || valorStr.trim() === '') {
    return { valido: false, mensagem: 'O valor é obrigatório', valor: 0 };
  }

  const valor = converterParaNumero(valorStr);

  if (isNaN(valor)) {
    return { valido: false, mensagem: 'Valor inválido', valor: 0 };
  }

  if (valor <= 0) {
    return { valido: false, mensagem: 'O valor deve ser maior que zero', valor: 0 };
  }

  if (valor > 999999999.99) {
    return { valido: false, mensagem: 'O valor máximo é R$ 999.999.999,99', valor: 0 };
  }

  // Valida formato com regex (opcional, já que a máscara garante)
  if (valorStr.includes(',') && !Patterns.valorMonetario.test(valorStr)) {
    return { valido: false, mensagem: 'Formato de valor inválido', valor: 0 };
  }

  return { valido: true, mensagem: '', valor };
}

/**
 * Valida a data da transação
 * @param {string} data - Data no formato ISO (YYYY-MM-DD)
 * @returns {Object} - { valido: boolean, mensagem: string }
 */
function validarData(data) {
  if (!data || data.trim() === '') {
    return { valido: false, mensagem: 'Selecione uma data para a transação' };
  }

  if (!Patterns.dataISO.test(data)) {
    return { valido: false, mensagem: 'Formato de data inválido' };
  }

  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) {
    return { valido: false, mensagem: 'Data inválida' };
  }

  // Não permite datas futuras muito distantes (mais de 1 ano)
  const umAnoFuturo = new Date();
  umAnoFuturo.setFullYear(umAnoFuturo.getFullYear() + 1);
  if (dataObj > umAnoFuturo) {
    return { valido: false, mensagem: 'A data não pode ser superior a 1 ano no futuro' };
  }

  // Não permite datas muito antigas (mais de 10 anos)
  const dezAnosAtras = new Date();
  dezAnosAtras.setFullYear(dezAnosAtras.getFullYear() - 10);
  if (dataObj < dezAnosAtras) {
    return { valido: false, mensagem: 'A data não pode ser superior a 10 anos no passado' };
  }

  return { valido: true, mensagem: '' };
}

/**
 * Valida o tipo da transação
 * @param {string} tipo - Tipo (receita ou despesa)
 * @returns {Object} - { valido: boolean, mensagem: string }
 */
function validarTipo(tipo) {
  if (!tipo) {
    return { valido: false, mensagem: 'Selecione o tipo da transação' };
  }

  const tipoLower = tipo.toLowerCase();
  if (tipoLower !== 'receita' && tipoLower !== 'despesa') {
    return { valido: false, mensagem: 'Tipo de transação inválido' };
  }

  return { valido: true, mensagem: '' };
}

/**
 * Valida todos os campos do formulário
 * @returns {Object} - { valido: boolean, mensagem: string, dados: Object, campo: string }
 */
function validarFormulario() {
  const descricao = $('#descricao').val().trim();
  const valorStr = $('#valor').val();
  const data = $('#data-input').val();
  const tipo = $('input[name="tipo"]:checked').attr('aria-label');
  const categoria = $('#categoria').val() || 'Outros';

  // Limpa erros anteriores
  $('.input, .select').removeClass('input-error').removeClass('input-success');
  Feedback.limpar('mensagem-feedback');

  // Validação da descrição
  const descricaoValidacao = validarDescricao(descricao);
  if (!descricaoValidacao.valido) {
    return {
      valido: false,
      mensagem: descricaoValidacao.mensagem,
      campo: '#descricao'
    };
  }

  // Validação do valor
  const valorValidacao = validarValor(valorStr);
  if (!valorValidacao.valido) {
    return {
      valido: false,
      mensagem: valorValidacao.mensagem,
      campo: '#valor'
    };
  }

  // Validação da data
  const dataValidacao = validarData(data);
  if (!dataValidacao.valido) {
    return {
      valido: false,
      mensagem: dataValidacao.mensagem,
      campo: null
    };
  }

  // Validação do tipo
  const tipoValidacao = validarTipo(tipo);
  if (!tipoValidacao.valido) {
    return {
      valido: false,
      mensagem: tipoValidacao.mensagem,
      campo: null
    };
  }

  return {
    valido: true,
    mensagem: '',
    dados: {
      descricao,
      valor: valorValidacao.valor,
      data,
      tipo: tipo.toLowerCase(),
      categoria
    }
  };
}

/**
 * Salva a transação no banco de dados
 * @param {number} usuarioId - ID do usuário logado
 */
function salvarTransacao(usuarioId) {
  const validacao = validarFormulario();

  if (!validacao.valido) {
    Feedback.erro('mensagem-feedback', validacao.mensagem);
    if (validacao.campo) {
      $(validacao.campo).addClass('input-error').focus();
    }

    // Shake animation
    $('#form-transacao').addClass('animate-shake');
    setTimeout(function() {
      $('#form-transacao').removeClass('animate-shake');
    }, 500);
    return;
  }

  const $btnSubmit = $('#form-transacao button[type="submit"]');
  Button.loading($btnSubmit, 'Salvar transação');

  // Prepara dados para enviar
  const transacao = {
    usuarioId: usuarioId,
    descricao: validacao.dados.descricao,
    categoria: validacao.dados.categoria,
    valor: validacao.dados.valor,
    tipo: validacao.dados.tipo,
    data: validacao.dados.data
  };

  // Envia para a API
  $.ajax({
    url: `${API_URL}/transacoes`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(transacao),
    dataType: 'json'
  })
    .then(function() {
      const tipoTexto = transacao.tipo === 'receita' ? 'Receita' : 'Despesa';
      Feedback.sucesso('mensagem-feedback', `${tipoTexto} adicionada com sucesso!`);

      // Redireciona para o dashboard após sucesso
      setTimeout(function() {
        $('main').addClass('animate-exit');
        setTimeout(function() {
          window.location.href = './dashboard.html';
        }, 300);
      }, 1000);
    })
    .catch(function(error) {
      console.error('Erro ao salvar transação:', error);

      let mensagem = 'Erro ao salvar transação. Tente novamente.';
      if (error.statusText === 'error') {
        mensagem = 'Erro de conexão. Verifique se o servidor está rodando.';
      }

      Feedback.erro('mensagem-feedback', mensagem);
      Button.restaurar($btnSubmit);
    });
}
