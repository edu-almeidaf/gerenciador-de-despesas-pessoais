import $ from 'jquery';

const API_URL = 'http://localhost:3001';

/**
 * Cria e salva a sessão do usuário no localStorage
 * @param {Object} usuario - Dados do usuário (id, nome, email)
 */
function criarSessao(usuario) {
  const sessao = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    loggedAt: new Date().toISOString()
  };

  localStorage.setItem('usuario_sessao', JSON.stringify(sessao));
}

/**
 * Realiza o login do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} - Promise com dados do usuário
 */
async function login(email, senha) {
  const usuarios = await $.ajax({
    url: `${API_URL}/usuarios`,
    method: 'GET',
    data: { email },
    dataType: 'json'
  });

  if (usuarios.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const usuario = usuarios[0];

  if (usuario.senha !== senha) {
    throw new Error('Senha incorreta');
  }

  criarSessao(usuario);

  return usuario;
}

/**
 * Realiza o cadastro de um novo usuário
 * @param {Object} dados - Dados do usuário (nome, email, senha)
 * @returns {Promise<Object>} - Promise com dados do novo usuário
 */
async function cadastrar(dados) {
  const usuarios = await $.ajax({
    url: `${API_URL}/usuarios`,
    method: 'GET',
    data: { email: dados.email },
    dataType: 'json'
  });

  if (usuarios.length > 0) {
    throw new Error('Este e-mail já está cadastrado');
  }

  const novoUsuario = await $.ajax({
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

  criarSessao(novoUsuario);

  return novoUsuario;
}

/**
 * Realiza o logout do usuário
 */
function logout() {
  localStorage.removeItem('usuario_sessao');
  window.location.href = './index.html';
}

/**
 * Verifica se há um usuário logado
 * @returns {Object|null} - Dados do usuário ou null
 */
function getUsuarioLogado() {
  const sessao = localStorage.getItem('usuario_sessao');
  if (sessao) {
    return JSON.parse(sessao);
  }
  return null;
}

/**
 * Verifica autenticação e redireciona se não logado
 * @param {boolean} requireAuth - Se true, redireciona para login se não autenticado
 */
function verificarAutenticacao(requireAuth = true) {
  const usuario = this.getUsuarioLogado();

  if (requireAuth && !usuario) {
    window.location.href = './index.html';
    return null;
  }

  return usuario;
}

/**
 * Redireciona para dashboard se já estiver logado
 */
function redirecionarSeLogado() {
  const usuario = this.getUsuarioLogado();
  if (usuario) {
    window.location.href = './dashboard.html';
  }
}

/**
 * Módulo de Autenticação
 * Gerencia login, cadastro e sessão do usuário
 */
export const Auth = {
  login,
  cadastrar,
  logout,
  getUsuarioLogado,
  verificarAutenticacao,
  redirecionarSeLogado
};

