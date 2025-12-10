import $ from 'jquery';
import { Auth, Feedback, Button } from './auth.js';
import { Validacao } from './validacao.js';

$(document).ready(function() {
  // Redireciona se já estiver logado
  Auth.redirecionarSeLogado();

  // Verifica campos obrigatórios para habilitar botão
  function verificarCamposObrigatorios() {
    const email = $('#email').val().trim();
    const senha = $('#password').val();

    const todosPreenchidos = email.length > 0 && senha.length > 0;

    $('#btn-submit').prop('disabled', !todosPreenchidos);
  }

  // Monitora mudanças nos campos
  $('#email, #password').on('input', verificarCamposObrigatorios);

  // Validação em tempo real do email
  $('#email').on('blur', function() {
    const email = $(this).val();
    const $input = $(this);
    const $erroSpan = $('#email-erro');

    if (email.length > 0) {
      const resultado = Validacao.validarEmail(email);

      if (!resultado.valido) {
        $input.addClass('input-error').removeClass('input-success');
        if ($erroSpan.length) {
          $erroSpan.text(resultado.mensagem).removeClass('hidden');
        }
      } else {
        $input.removeClass('input-error').addClass('input-success');
        if ($erroSpan.length) {
          $erroSpan.addClass('hidden');
        }
      }
    }
  });

  // Remove erro ao digitar
  $('#email').on('input', function() {
    $(this).removeClass('input-error').removeClass('input-success');
    $('#email-erro').addClass('hidden');
  });

  // Handler do formulário de login
  $('#form-login').on('submit', function(e) {
    e.preventDefault();

    const $form = $(this);
    const $btnSubmit = $form.find('button[type="submit"]');
    const email = $('#email').val().trim();
    const senha = $('#password').val();

    // Limpa mensagens anteriores
    Feedback.limpar('mensagem-feedback');
    $('.input').removeClass('input-error');

    // Validação com regex
    const emailValidacao = Validacao.validarEmail(email);
    if (!emailValidacao.valido) {
      Feedback.erro('mensagem-feedback', emailValidacao.mensagem);
      $('#email').addClass('input-error').focus();
      return;
    }

    // Validação de senha (básica para login - só verifica se foi preenchida)
    if (!senha || senha.length < 1) {
      Feedback.erro('mensagem-feedback', 'Digite sua senha');
      $('#password').addClass('input-error').focus();
      return;
    }

    // Estado de loading
    Button.loading($btnSubmit, 'Entrar');

    // Tenta fazer login
    Auth.login(email, senha)
      .then(function(usuario) {
        Feedback.sucesso('mensagem-feedback', `Bem-vindo(a), ${usuario.nome}!`);

        // Animação de saída e redirecionamento
        setTimeout(function() {
          $('main').addClass('animate-exit');
          setTimeout(function() {
            window.location.href = './dashboard.html';
          }, 300);
        }, 800);
      })
      .catch(function(error) {
        let mensagem = 'Erro ao fazer login. Tente novamente.';

        if (error.message === 'Usuário não encontrado') {
          mensagem = 'E-mail não cadastrado. Verifique ou crie uma conta.';
          $('#email').addClass('input-error');
        } else if (error.message === 'Senha incorreta') {
          mensagem = 'Senha incorreta. Tente novamente.';
          $('#password').addClass('input-error').val('').focus();
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
      });
  });

  // Efeito de foco nos inputs
  $('.input').on('focus', function() {
    $(this).closest('.form-control').addClass('scale-[1.01]');
  }).on('blur', function() {
    $(this).closest('.form-control').removeClass('scale-[1.01]');
  });
});
