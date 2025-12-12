import $ from 'jquery';
import { Auth } from './auth.js';
import { Feedback } from './feedback.js';
import { Button } from './button.js';
import { Validacao } from './validacao.js';
import { Input } from './input.js';
import { PasswordStrength } from './password-strength.js';

// Estado de validação dos campos
const estadoValidacao = {
  nome: false,
  email: false,
  senha: false,
  confirmaSenha: false
};

/**
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function verificarCamposObrigatorios() {
  const nome = $('#nome').val().trim();
  const email = $('#email').val().trim();
  const senha = $('#password').val();
  const confirmaSenha = $('#confirm-password').val();
  const termos = $('#termos').is(':checked');

  const todosPreenchidos = nome.length > 0 &&
                           email.length > 0 &&
                           senha.length > 0 &&
                           confirmaSenha.length > 0 &&
                           termos;

  $('#btn-submit').prop('disabled', !todosPreenchidos);
}

/**
 * Valida confirmação de senha
 */
function validarConfirmacaoSenha() {
  const senha = $('#password').val();
  const confirmaSenha = $('#confirm-password').val();
  const $input = $('#confirm-password');

  if (confirmaSenha.length > 0) {
    const resultado = Validacao.validarConfirmacaoSenha(senha, confirmaSenha);

    if (!resultado.valido) {
      Input.mostrarErro($input, resultado.mensagem);
      estadoValidacao.confirmaSenha = false;
    } else {
      Input.marcarValido($input);
      estadoValidacao.confirmaSenha = true;
    }
  }
}

/**
 * Handler para input de senha - atualiza força e requisitos
 */
function handleSenhaInput() {
  const senha = $(this).val();
  const $input = $(this);
  const $indicator = $('#senha-forca');
  const $requisitos = $('#senha-requisitos');

  Input.limparErro($input);

  if (senha.length === 0) {
    PasswordStrength.esconderIndicadores($indicator, $requisitos);
    estadoValidacao.senha = false;
    return;
  }

  // Calcula e exibe força da senha
  const forca = Validacao.getForcaSenha(senha);
  PasswordStrength.atualizarIndicador(senha, $indicator, forca);

  // Valida requisitos da senha (nível médio)
  const resultado = Validacao.validarSenha(senha, 'medio');
  estadoValidacao.senha = resultado.valido;

  // Atualiza requisitos visuais
  PasswordStrength.atualizarRequisitos(senha, $requisitos);

  // Revalida confirmação se já tiver valor
  const confirmaSenha = $('#confirm-password').val();
  if (confirmaSenha.length > 0) {
    validarConfirmacaoSenha();
  }
}

/**
 * Handler para blur de senha - valida e mostra erro se inválida
 */
function handleSenhaBlur() {
  const senha = $(this).val();
  const $input = $(this);

  if (senha.length > 0) {
    const resultado = Validacao.validarSenha(senha, 'medio');

    if (!resultado.valido) {
      Input.mostrarErro($input, resultado.mensagem);
    } else {
      Input.marcarValido($input);
    }
  }
}

/**
 * Handler para input de confirmação de senha
 */
function handleConfirmaSenhaInput() {
  Input.limparErro($(this));
  validarConfirmacaoSenha();
}

/**
 * Valida todos os campos do formulário
 * @returns {Object|null} - Dados validados ou null se inválido
 */
function validarFormulario() {
  const nome = $('#nome').val().trim();
  const email = $('#email').val().trim();
  const senha = $('#password').val();
  const confirmaSenha = $('#confirm-password').val();
  const aceitaTermos = $('#termos').is(':checked');

  // Limpa mensagens anteriores
  Feedback.limpar('mensagem-feedback');
  $('.input').removeClass('input-error');

  // Validação do nome
  const nomeValidacao = Validacao.validarNome(nome);
  if (!nomeValidacao.valido) {
    Feedback.erro('mensagem-feedback', nomeValidacao.mensagem);
    $('#nome').addClass('input-error').focus();
    return null;
  }

  // Validação do email
  const emailValidacao = Validacao.validarEmail(email);
  if (!emailValidacao.valido) {
    Feedback.erro('mensagem-feedback', emailValidacao.mensagem);
    $('#email').addClass('input-error').focus();
    return null;
  }

  // Validação da senha
  const senhaValidacao = Validacao.validarSenha(senha, 'medio');
  if (!senhaValidacao.valido) {
    Feedback.erro('mensagem-feedback', senhaValidacao.mensagem);
    $('#password').addClass('input-error').focus();
    return null;
  }

  // Validação da confirmação de senha
  const confirmacaoValidacao = Validacao.validarConfirmacaoSenha(senha, confirmaSenha);
  if (!confirmacaoValidacao.valido) {
    Feedback.erro('mensagem-feedback', confirmacaoValidacao.mensagem);
    $('#confirm-password').addClass('input-error').focus();
    return null;
  }

  // Validação dos termos
  if (!aceitaTermos) {
    Feedback.erro('mensagem-feedback', 'Você precisa aceitar os Termos de Uso para continuar');
    $('#termos').focus();
    return null;
  }

  return { nome, email, senha };
}

/**
 * Trata sucesso no cadastro
 * @param {Object} usuario - Dados do usuário cadastrado
 */
function handleCadastroSucesso(usuario) {
  Feedback.sucesso('mensagem-feedback', `Conta criada com sucesso! Bem-vindo(a), ${usuario.nome}!`);

  // Animação de saída e redirecionamento
  setTimeout(function() {
    $('main').addClass('animate-exit');
    setTimeout(function() {
      window.location.href = './dashboard.html';
    }, 300);
  }, 1000);
}

/**
 * Trata erro no cadastro
 * @param {Error} error - Erro ocorrido
 * @param {jQuery} $form - Elemento do formulário
 * @param {jQuery} $btnSubmit - Elemento do botão de submit
 */
function handleCadastroErro(error, $form, $btnSubmit) {
  let mensagem = 'Erro ao criar conta. Tente novamente.';

  if (error.message === 'Este e-mail já está cadastrado') {
    mensagem = 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.';
    $('#email').addClass('input-error').focus();
  } else if (error.statusText === 'error') {
    mensagem = 'Erro de conexão. Verifique se o servidor está rodando.';
  }

  Feedback.erro('mensagem-feedback', mensagem);
  Button.restaurar($btnSubmit);

  // Shake animation no formulário
  $form.addClass('animate-shake');
  setTimeout(function() {
    $form.removeClass('animate-shake');
  }, 500);
}

/**
 * Handler para submit do formulário de cadastro
 * @param {Event} e - Evento de submit
 */
async function handleSubmitCadastro(e) {
  e.preventDefault();

  const $form = $(this);
  const $btnSubmit = $form.find('button[type="submit"]');

  const dadosValidados = validarFormulario();
  if (!dadosValidados) return;

  Button.loading($btnSubmit, 'Criar conta');

  try {
    const usuario = await Auth.cadastrar(dadosValidados);
    handleCadastroSucesso(usuario);
  } catch (error) {
    handleCadastroErro(error, $form, $btnSubmit);
  }
}

/**
 * Configura os event listeners da página
 */
function configurarEventListeners() {
  // Monitora mudanças nos campos para habilitar/desabilitar botão
  $('#nome, #email, #password, #confirm-password').on('input', verificarCamposObrigatorios);
  $('#termos').on('change', verificarCamposObrigatorios);

  // Validação do nome
  Input.configurarValidacao(
    $('#nome'),
    Validacao.validarNome,
    estadoValidacao,
    'nome'
  );

  // Validação do email
  Input.configurarValidacao(
    $('#email'),
    Validacao.validarEmail,
    estadoValidacao,
    'email'
  );

  // Validação da senha (tratamento especial com força de senha)
  $('#password').on('input', handleSenhaInput);
  $('#password').on('blur', handleSenhaBlur);

  // Validação da confirmação de senha
  $('#confirm-password').on('input', handleConfirmaSenhaInput);
  $('#confirm-password').on('blur', validarConfirmacaoSenha);

  // Submit do formulário
  $('#form-cadastro').on('submit', handleSubmitCadastro);

  // Efeito de foco nos inputs
  Input.configurarEfeitoFoco('.input');
}

/**
 * Inicializa a página de cadastro
 */
function init() {
  Auth.redirecionarSeLogado();

  configurarEventListeners();
}

$(document).ready(init);
