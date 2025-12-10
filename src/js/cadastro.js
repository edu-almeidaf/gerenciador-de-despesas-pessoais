import $ from 'jquery';
import { Auth, Feedback, Button } from './auth.js';
import { Validacao } from './validacao.js';

$(document).ready(function() {
  // Redireciona se já estiver logado
  Auth.redirecionarSeLogado();

  // Estado de validação dos campos
  const estadoValidacao = {
    nome: false,
    email: false,
    senha: false,
    confirmaSenha: false
  };

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

  // ========== VALIDAÇÃO DO NOME ==========
  $('#nome').on('blur', function() {
    const nome = $(this).val();
    const $input = $(this);
    
    if (nome.length > 0) {
      const resultado = Validacao.validarNome(nome);
      
      if (!resultado.valido) {
        mostrarErroInline($input, resultado.mensagem);
        estadoValidacao.nome = false;
      } else {
        marcarValido($input);
        estadoValidacao.nome = true;
      }
    }
  });

  $('#nome').on('input', function() {
    limparErroInline($(this));
  });

  // ========== VALIDAÇÃO DO EMAIL ==========
  $('#email').on('blur', function() {
    const email = $(this).val();
    const $input = $(this);
    
    if (email.length > 0) {
      const resultado = Validacao.validarEmail(email);
      
      if (!resultado.valido) {
        mostrarErroInline($input, resultado.mensagem);
        estadoValidacao.email = false;
      } else {
        marcarValido($input);
        estadoValidacao.email = true;
      }
    }
  });

  $('#email').on('input', function() {
    limparErroInline($(this));
  });

  // ========== VALIDAÇÃO DA SENHA ==========
  $('#password').on('input', function() {
    const senha = $(this).val();
    const $input = $(this);
    const $indicator = $('#senha-forca');
    const $requisitos = $('#senha-requisitos');
    
    limparErroInline($input);
    
    if (senha.length === 0) {
      $indicator.css('display', 'none');
      $requisitos.addClass('hidden');
      estadoValidacao.senha = false;
      return;
    }
    
    // Mostra indicador de força
    $indicator.css('display', 'flex');
    
    // Calcula força da senha
    const forca = Validacao.getForcaSenha(senha);
    const $progress = $indicator.find('progress');
    const $texto = $indicator.find('span');
    
    $progress.val(forca.porcentagem);
    $progress.removeClass('progress-error')
             .removeClass('progress-warning')
             .removeClass('progress-success')
             .addClass(`progress-${forca.cor}`);
    $texto.text(forca.nivel)
          .removeClass('text-red-500')
          .removeClass('text-yellow-600')
          .removeClass('text-green-600');
    
    if (forca.cor === 'error') $texto.addClass('text-red-500');
    else if (forca.cor === 'warning') $texto.addClass('text-yellow-600');
    else $texto.addClass('text-green-600');
    
    // Valida requisitos da senha (nível médio)
    const resultado = Validacao.validarSenha(senha, 'medio');
    estadoValidacao.senha = resultado.valido;
    
    // Atualiza requisitos visuais
    atualizarRequisitos(senha);
    
    // Revalida confirmação se já tiver valor
    const confirmaSenha = $('#confirm-password').val();
    if (confirmaSenha.length > 0) {
      validarConfirmacaoSenha();
    }
  });

  $('#password').on('blur', function() {
    const senha = $(this).val();
    const $input = $(this);
    
    if (senha.length > 0) {
      const resultado = Validacao.validarSenha(senha, 'medio');
      
      if (!resultado.valido) {
        mostrarErroInline($input, resultado.mensagem);
      } else {
        marcarValido($input);
      }
    }
  });

  /**
   * Atualiza indicadores visuais dos requisitos de senha
   */
  function atualizarRequisitos(senha) {
    const $requisitos = $('#senha-requisitos');
    
    if (!$requisitos.length) return;
    
    $requisitos.removeClass('hidden');
    
    // Requisitos
    const req = {
      tamanho: senha.length >= 6,
      letra: /[a-zA-Z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)
    };
    
    // Atualiza cada requisito
    Object.keys(req).forEach(key => {
      const $item = $(`#req-${key}`);
      if ($item.length) {
        if (req[key]) {
          $item.removeClass('text-zinc-400').addClass('text-green-600');
          $item.find('svg').html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>');
        } else {
          $item.removeClass('text-green-600').addClass('text-zinc-400');
          $item.find('svg').html('<circle cx="12" cy="12" r="10"/>');
        }
      }
    });
  }

  // ========== VALIDAÇÃO DA CONFIRMAÇÃO DE SENHA ==========
  function validarConfirmacaoSenha() {
    const senha = $('#password').val();
    const confirmaSenha = $('#confirm-password').val();
    const $input = $('#confirm-password');
    
    if (confirmaSenha.length > 0) {
      const resultado = Validacao.validarConfirmacaoSenha(senha, confirmaSenha);
      
      if (!resultado.valido) {
        mostrarErroInline($input, resultado.mensagem);
        estadoValidacao.confirmaSenha = false;
      } else {
        marcarValido($input);
        estadoValidacao.confirmaSenha = true;
      }
    }
  }

  $('#confirm-password').on('input', function() {
    limparErroInline($(this));
    validarConfirmacaoSenha();
  });

  $('#confirm-password').on('blur', function() {
    validarConfirmacaoSenha();
  });

  // ========== SUBMIT DO FORMULÁRIO ==========
  $('#form-cadastro').on('submit', function(e) {
    e.preventDefault();
    
    const $form = $(this);
    const $btnSubmit = $form.find('button[type="submit"]');
    const nome = $('#nome').val().trim();
    const email = $('#email').val().trim();
    const senha = $('#password').val();
    const confirmaSenha = $('#confirm-password').val();
    const aceitaTermos = $('#termos').is(':checked');

    // Limpa mensagens anteriores
    Feedback.limpar('mensagem-feedback');
    $('.input').removeClass('input-error');

    // Validações com regex
    const nomeValidacao = Validacao.validarNome(nome);
    if (!nomeValidacao.valido) {
      Feedback.erro('mensagem-feedback', nomeValidacao.mensagem);
      $('#nome').addClass('input-error').focus();
      return;
    }

    const emailValidacao = Validacao.validarEmail(email);
    if (!emailValidacao.valido) {
      Feedback.erro('mensagem-feedback', emailValidacao.mensagem);
      $('#email').addClass('input-error').focus();
      return;
    }

    const senhaValidacao = Validacao.validarSenha(senha, 'medio');
    if (!senhaValidacao.valido) {
      Feedback.erro('mensagem-feedback', senhaValidacao.mensagem);
      $('#password').addClass('input-error').focus();
      return;
    }

    const confirmacaoValidacao = Validacao.validarConfirmacaoSenha(senha, confirmaSenha);
    if (!confirmacaoValidacao.valido) {
      Feedback.erro('mensagem-feedback', confirmacaoValidacao.mensagem);
      $('#confirm-password').addClass('input-error').focus();
      return;
    }

    if (!aceitaTermos) {
      Feedback.erro('mensagem-feedback', 'Você precisa aceitar os Termos de Uso para continuar');
      $('#termos').focus();
      return;
    }

    // Estado de loading
    Button.loading($btnSubmit, 'Criar conta');

    // Tenta fazer cadastro
    Auth.cadastrar({ nome, email, senha })
      .then(function(usuario) {
        Feedback.sucesso('mensagem-feedback', `Conta criada com sucesso! Bem-vindo(a), ${usuario.nome}!`);
        
        // Animação de saída e redirecionamento
        setTimeout(function() {
          $('main').addClass('animate-exit');
          setTimeout(function() {
            window.location.href = './dashboard.html';
          }, 300);
        }, 1000);
      })
      .catch(function(error) {
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
      });
  });

  // Efeito de foco nos inputs
  $('.input').on('focus', function() {
    $(this).closest('.form-control').addClass('scale-[1.01]');
  }).on('blur', function() {
    $(this).closest('.form-control').removeClass('scale-[1.01]');
  });
});
