import $ from 'jquery';

const API_URL = 'http://localhost:3001';

/**
 * Módulo de Autenticação
 * Gerencia login, cadastro e sessão do usuário
 */
const Auth = {
  /**
   * Realiza o login do usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise} - Promise com resultado do login
   */
  login: function(email, senha) {
    return $.ajax({
      url: `${API_URL}/usuarios`,
      method: 'GET',
      data: { email: email },
      dataType: 'json'
    }).then(function(usuarios) {
      if (usuarios.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      const usuario = usuarios[0];

      if (usuario.senha !== senha) {
        throw new Error('Senha incorreta');
      }

      // Salva sessão no localStorage
      const sessao = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        loggedAt: new Date().toISOString()
      };

      localStorage.setItem('usuario_sessao', JSON.stringify(sessao));

      return usuario;
    });
  },

  /**
   * Realiza o cadastro de um novo usuário
   * @param {Object} dados - Dados do usuário (nome, email, senha)
   * @returns {Promise} - Promise com resultado do cadastro
   */
  cadastrar: function(dados) {
    // Primeiro verifica se o email já existe
    return $.ajax({
      url: `${API_URL}/usuarios`,
      method: 'GET',
      data: { email: dados.email },
      dataType: 'json'
    }).then(function(usuarios) {
      if (usuarios.length > 0) {
        throw new Error('Este e-mail já está cadastrado');
      }

      // Se não existe, cria o novo usuário
      return $.ajax({
        url: `${API_URL}/usuarios`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          nome: dados.nome,
          email: dados.email,
          senha: dados.senha
        }),
        dataType: 'json'
      });
    }).then(function(novoUsuario) {
      // Após cadastro, faz login automático
      const sessao = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        loggedAt: new Date().toISOString()
      };

      localStorage.setItem('usuario_sessao', JSON.stringify(sessao));

      return novoUsuario;
    });
  },

  /**
   * Realiza o logout do usuário
   */
  logout: function() {
    localStorage.removeItem('usuario_sessao');
    window.location.href = './index.html';
  },

  /**
   * Verifica se há um usuário logado
   * @returns {Object|null} - Dados do usuário ou null
   */
  getUsuarioLogado: function() {
    const sessao = localStorage.getItem('usuario_sessao');
    if (sessao) {
      return JSON.parse(sessao);
    }
    return null;
  },

  /**
   * Verifica autenticação e redireciona se não logado
   * @param {boolean} requireAuth - Se true, redireciona para login se não autenticado
   */
  verificarAutenticacao: function(requireAuth = true) {
    const usuario = this.getUsuarioLogado();

    if (requireAuth && !usuario) {
      window.location.href = './index.html';
      return null;
    }

    return usuario;
  },

  /**
   * Redireciona para dashboard se já estiver logado
   * (Usado nas páginas de login/cadastro)
   */
  redirecionarSeLogado: function() {
    const usuario = this.getUsuarioLogado();
    if (usuario) {
      window.location.href = './dashboard.html';
    }
  }
};

/**
 * Utilitários para exibir mensagens de feedback
 */
const Feedback = {
  /**
   * Exibe mensagem de erro
   * @param {string} containerId - ID do container de mensagens
   * @param {string} mensagem - Mensagem a exibir
   */
  erro: function(containerId, mensagem) {
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
  },

  /**
   * Exibe mensagem de sucesso
   * @param {string} containerId - ID do container de mensagens
   * @param {string} mensagem - Mensagem a exibir
   */
  sucesso: function(containerId, mensagem) {
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
  },

  /**
   * Limpa/esconde a mensagem
   * @param {string} containerId - ID do container de mensagens
   */
  limpar: function(containerId) {
    $(`#${containerId}`).addClass('hidden').empty();
  }
};

/**
 * Utilitário para controlar estado do botão durante requisições
 */
const Button = {
  /**
   * Desabilita botão e mostra loading
   * @param {jQuery} $btn - Elemento jQuery do botão
   * @param {string} textoOriginal - Texto original do botão
   */
  loading: function($btn, textoOriginal) {
    $btn
      .data('texto-original', textoOriginal)
      .prop('disabled', true)
      .html(`
        <span class="loading loading-spinner loading-sm"></span>
        Aguarde...
      `);
  },

  /**
   * Restaura botão ao estado original
   * @param {jQuery} $btn - Elemento jQuery do botão
   */
  restaurar: function($btn) {
    const textoOriginal = $btn.data('texto-original') || 'Enviar';
    $btn
      .prop('disabled', false)
      .html(textoOriginal);
  }
};

// Exporta módulos
export { Auth, Feedback, Button };

