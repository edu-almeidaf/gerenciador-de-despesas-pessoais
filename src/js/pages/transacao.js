import $ from 'jquery';
import { Auth } from '../core/auth.js';
import { Feedback } from '../components/feedback.js';
import { Button } from '../components/button.js';
import { Input } from '../components/input.js';
import { Usuario } from '../modules/usuario.js';

const API_URL = 'http://localhost:3001';

/**
 * Padrões REGEX para validação
 */
const Patterns = {
  descricao: /^[a-zA-ZÀ-ÿ0-9\s.,!?()-]+$/,
  valorMonetario: /^\d{1,3}(\.\d{3})*(,\d{2})?$/,
  dataISO: /^\d{4}-\d{2}-\d{2}$/
};

let centavosGlobal = 0;

/**
 * Converte valor formatado (1.234,56) para número (1234.56)
 * @param {string} valorFormatado - Valor com máscara
 * @returns {number} - Valor numérico
 */
function converterParaNumero(valorFormatado) {
  if (!valorFormatado) return 0;
  return parseFloat(valorFormatado.replace(/\./g, '').replace(',', '.')) || 0;
}

/**
 * Formata centavos para exibição (ex: 159 -> "1,59")
 * @param {number} cents - Valor em centavos
 * @returns {string} - Valor formatado
 */
function formatarCentavos(cents) {
  const valor = (cents / 100).toFixed(2);
  return valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

  if (valorStr.includes(',') && !Patterns.valorMonetario.test(valorStr)) {
    return { valido: false, mensagem: 'Formato de valor inválido', valor: 0 };
  }

  return { valido: true, mensagem: '', valor };
}

/**
 * Converte string de data ISO para Date no fuso horário local
 * Evita problemas de timezone ao parsear datas YYYY-MM-DD
 * @param {string} dataISO - Data no formato YYYY-MM-DD
 * @returns {Date}
 */
function parsearDataLocal(dataISO) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
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

  const dataObj = parsearDataLocal(data);
  if (isNaN(dataObj.getTime())) {
    return { valido: false, mensagem: 'Data inválida' };
  }

  const umAnoFuturo = new Date();
  umAnoFuturo.setFullYear(umAnoFuturo.getFullYear() + 1);
  if (dataObj > umAnoFuturo) {
    return { valido: false, mensagem: 'A data não pode ser superior a 1 ano no futuro' };
  }

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

  $('.input, .select').removeClass('input-error').removeClass('input-success');
  Feedback.limpar('mensagem-feedback');

  const descricaoValidacao = validarDescricao(descricao);
  if (!descricaoValidacao.valido) {
    return { valido: false, mensagem: descricaoValidacao.mensagem, campo: '#descricao' };
  }

  const valorValidacao = validarValor(valorStr);
  if (!valorValidacao.valido) {
    return { valido: false, mensagem: valorValidacao.mensagem, campo: '#valor' };
  }

  const dataValidacao = validarData(data);
  if (!dataValidacao.valido) {
    return { valido: false, mensagem: dataValidacao.mensagem, campo: null };
  }

  const tipoValidacao = validarTipo(tipo);
  if (!tipoValidacao.valido) {
    return { valido: false, mensagem: tipoValidacao.mensagem, campo: null };
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
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function verificarCamposObrigatorios() {
  const descricao = $('#descricao').val().trim();
  const data = $('#data-input').val();

  const todosPreenchidos = descricao.length >= 3 &&
                           centavosGlobal > 0 &&
                           data.length > 0;

  $('#btn-submit').prop('disabled', !todosPreenchidos);
}

/**
 * Atualiza feedback visual do campo de valor
 * @param {jQuery} $valor - Elemento do campo de valor
 */
function atualizarFeedbackValor($valor) {
  Input.limparErro($valor);
  if (centavosGlobal > 0) {
    $valor.removeClass('input-error').addClass('input-success');
  } else {
    $valor.removeClass('input-success').removeClass('input-error');
  }
  verificarCamposObrigatorios();
}

/**
 * Inicializa o campo de valor com comportamento estilo app de banco
 */
function inicializarMascaraMonetaria() {
  const $valor = $('#valor');

  $valor.val(formatarCentavos(centavosGlobal));

  $valor.on('keydown', function(e) {
    const key = e.key;

    if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      return true;
    }

    e.preventDefault();

    if (key === 'Backspace') {
      centavosGlobal = Math.floor(centavosGlobal / 10);
      $valor.val(formatarCentavos(centavosGlobal));
      atualizarFeedbackValor($valor);
      return false;
    }

    if (key === 'Delete') {
      centavosGlobal = 0;
      $valor.val(formatarCentavos(centavosGlobal));
      atualizarFeedbackValor($valor);
      return false;
    }

    if (/^[0-9]$/.test(key)) {
      if (centavosGlobal > 9999999999) {
        return false;
      }

      centavosGlobal = centavosGlobal * 10 + parseInt(key);
      $valor.val(formatarCentavos(centavosGlobal));
      atualizarFeedbackValor($valor);
      return false;
    }

    return false;
  });

  $valor.on('paste', function(e) {
    e.preventDefault();
    const pastedText = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
    const numeros = pastedText.replace(/\D/g, '');
    if (numeros) {
      centavosGlobal = parseInt(numeros) || 0;
      if (centavosGlobal > 99999999999) centavosGlobal = 99999999999;
      $valor.val(formatarCentavos(centavosGlobal));
      atualizarFeedbackValor($valor);
    }
  });

  $valor.on('focus', function() {
    const len = $(this).val().length;
    this.setSelectionRange(len, len);
  });

  $valor.data('getCentavos', function() {
    return centavosGlobal;
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
 * Handler para blur da descrição
 */
function handleDescricaoBlur() {
  const descricao = $(this).val().trim();
  const $input = $(this);

  if (descricao.length > 0) {
    const resultado = validarDescricao(descricao);

    if (!resultado.valido) {
      Input.mostrarErro($input, resultado.mensagem);
    } else {
      Input.marcarValido($input);
    }
  }
}

/**
 * Handler para input da descrição
 */
function handleDescricaoInput() {
  Input.limparErro($(this));
}

/**
 * Handler para blur do valor
 */
function handleValorBlur() {
  const valorStr = $(this).val();
  const $input = $(this);

  if (valorStr.length > 0) {
    const resultado = validarValor(valorStr);

    if (!resultado.valido) {
      Input.mostrarErro($input, resultado.mensagem);
    } else {
      Input.marcarValido($input);
    }
  }
}

/**
 * Handler para change da categoria
 */
function handleCategoriaChange() {
  const categoria = $(this).val();

  if (categoria) {
    Input.marcarValido($(this));
  }
}

/**
 * Configura validações em tempo real nos campos
 */
function configurarValidacoesTempoReal() {
  $('#descricao').on('blur', handleDescricaoBlur);
  $('#descricao').on('input', handleDescricaoInput);
  $('#valor').on('blur', handleValorBlur);
  $('#categoria').on('change', handleCategoriaChange);
}

/**
 * Exibe animação de shake no formulário
 */
function exibirShakeFormulario() {
  $('#form-transacao').addClass('animate-shake');
  setTimeout(function() {
    $('#form-transacao').removeClass('animate-shake');
  }, 500);
}

/**
 * Trata sucesso ao salvar transação
 * @param {Object} transacao - Dados da transação salva
 */
function handleSalvarSucesso(transacao) {
  const tipoTexto = transacao.tipo === 'receita' ? 'Receita' : 'Despesa';
  Feedback.sucesso('mensagem-feedback', `${tipoTexto} adicionada com sucesso!`);

  setTimeout(function() {
    $('main').addClass('animate-exit');
    setTimeout(function() {
      window.location.href = './todas-transacoes.html';
    }, 300);
  }, 1000);
}

/**
 * Trata erro ao salvar transação
 * @param {Error} error - Erro ocorrido
 * @param {jQuery} $btnSubmit - Botão de submit
 */
function handleSalvarErro(error, $btnSubmit) {
  console.error('Erro ao salvar transação:', error);

  let mensagem = 'Erro ao salvar transação. Tente novamente.';
  if (error.statusText === 'error') {
    mensagem = 'Erro de conexão. Verifique se o servidor está rodando.';
  }

  Feedback.erro('mensagem-feedback', mensagem);
  Button.restaurar($btnSubmit);
}

/**
 * Salva a transação no banco de dados
 * @param {number} usuarioId - ID do usuário logado
 */
async function salvarTransacao(usuarioId) {
  const validacao = validarFormulario();

  if (!validacao.valido) {
    Feedback.erro('mensagem-feedback', validacao.mensagem);
    if (validacao.campo) {
      $(validacao.campo).addClass('input-error').focus();
    }
    exibirShakeFormulario();
    return;
  }

  const $btnSubmit = $('#form-transacao button[type="submit"]');
  Button.loading($btnSubmit, 'Salvar transação');

  const transacao = {
    usuarioId: usuarioId,
    descricao: validacao.dados.descricao,
    categoria: validacao.dados.categoria,
    valor: validacao.dados.valor,
    tipo: validacao.dados.tipo,
    data: validacao.dados.data
  };

  try {
    await $.ajax({
      url: `${API_URL}/transacoes`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(transacao),
      dataType: 'json'
    });

    handleSalvarSucesso(transacao);
  } catch (error) {
    handleSalvarErro(error, $btnSubmit);
  }
}

/**
 * Handler para submit do formulário
 * @param {Event} e - Evento de submit
 * @param {number} usuarioId - ID do usuário logado
 */
function handleSubmitTransacao(e, usuarioId) {
  e.preventDefault();
  salvarTransacao(usuarioId);
}

/**
 * Configura os event listeners da página
 * @param {Object} usuario - Dados do usuário logado
 */
function configurarEventListeners(usuario) {
  $('#descricao').on('input', verificarCamposObrigatorios);
  $('#data-input').on('change', verificarCamposObrigatorios);

  $('#form-transacao').on('submit', function(e) {
    handleSubmitTransacao(e, usuario.id);
  });

  Usuario.configurarLogout();
}

/**
 * Inicializa a página de adicionar transação
 */
function init() {
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) return;

  Usuario.atualizarUIUsuario(usuario);

  inicializarMascaraMonetaria();
  inicializarDataAtual();
  configurarValidacoesTempoReal();
  verificarCamposObrigatorios();
  configurarEventListeners(usuario);
}

/**
 * Módulo de Transação
 */
export const Transacao = {
  init,
  validarDescricao,
  validarValor,
  validarData,
  validarTipo
};

$(document).ready(init);

