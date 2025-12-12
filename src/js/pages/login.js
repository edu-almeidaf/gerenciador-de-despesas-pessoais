import $ from 'jquery';
import { Auth } from '../core/auth.js';
import { Validacao } from '../core/validacao.js';
import { Feedback } from '../components/feedback.js';
import { Button } from '../components/button.js';
import { Input } from '../components/input.js';

const estadoValidacao = {
  email: false
};

/**
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function verificarCamposObrigatorios() {
  const email = $('#email').val().trim();
  const senha = $('#password').val();

  const todosPreenchidos = email.length > 0 && senha.length > 0;

  $('#btn-submit').prop('disabled', !todosPreenchidos);
}

/**
 * Valida os campos do formulário de login
 * @returns {Object|null} - Dados validados ou null se inválido
 */
function validarFormulario() {
  const email = $('#email').val().trim();
  const senha = $('#password').val();

  Feedback.limpar('mensagem-feedback');
  $('.input').removeClass('input-error');

  const emailValidacao = Validacao.validarEmail(email);
  if (!emailValidacao.valido) {
    Feedback.erro('mensagem-feedback', emailValidacao.mensagem);
    $('#email').addClass('input-error').focus();
    return null;
  }

  if (!senha || senha.length < 1) {
    Feedback.erro('mensagem-feedback', 'Digite sua senha');
    $('#password').addClass('input-error').focus();
    return null;
  }

  return { email, senha };
}

/**
 * Trata sucesso no login
 * @param {Object} usuario - Dados do usuário logado
 */
function handleLoginSucesso(usuario) {
  Feedback.sucesso('mensagem-feedback', `Bem-vindo(a), ${usuario.nome}!`);

  setTimeout(function() {
    $('main').addClass('animate-exit');
    setTimeout(function() {
      window.location.href = './dashboard.html';
    }, 300);
  }, 800);
}

/**
 * Trata erro no login
 * @param {Error} error - Erro ocorrido
 * @param {jQuery} $form - Elemento do formulário
 * @param {jQuery} $btnSubmit - Elemento do botão de submit
 */
function handleLoginErro(error, $form, $btnSubmit) {
  let mensagem = 'Erro ao fazer login. Tente novamente.';

  switch (error.message) {
  case 'Usuário não encontrado':
    mensagem = 'E-mail não cadastrado. Verifique ou crie uma conta.';
    $('#email').addClass('input-error');
    break;

  case 'Senha incorreta':
    mensagem = 'Senha incorreta. Tente novamente.';
    $('#password').addClass('input-error').val('').focus();
    break;

  case 'error':
    mensagem = 'Erro de conexão. Verifique se o servidor está rodando.';
    break;
  }

  Feedback.erro('mensagem-feedback', mensagem);
  Button.restaurar($btnSubmit);

  $form.addClass('animate-shake');
  setTimeout(function() {
    $form.removeClass('animate-shake');
  }, 500);
}

/**
 * Handler para submit do formulário de login
 * @param {Event} e - Evento de submit
 */
async function handleSubmitLogin(e) {
  e.preventDefault();

  const $form = $(this);
  const $btnSubmit = $form.find('button[type="submit"]');

  const dadosValidados = validarFormulario();
  if (!dadosValidados) return;

  Button.loading($btnSubmit, 'Entrar');

  try {
    const usuario = await Auth.login(dadosValidados.email, dadosValidados.senha);
    handleLoginSucesso(usuario);
  } catch (error) {
    handleLoginErro(error, $form, $btnSubmit);
  }
}

/**
 * Configura os event listeners da página
 */
function configurarEventListeners() {
  $('#email, #password').on('input', verificarCamposObrigatorios);

  Input.configurarValidacao(
    $('#email'),
    Validacao.validarEmail,
    estadoValidacao,
    'email'
  );

  $('#form-login').on('submit', handleSubmitLogin);

  Input.configurarEfeitoFoco('.input');
}

/**
 * Inicializa a página de login
 */
function init() {
  Auth.redirecionarSeLogado();
  configurarEventListeners();
}

$(document).ready(init);

