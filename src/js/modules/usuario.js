import $ from 'jquery';
import { Auth } from '../core/auth.js';

/**
 * Extrai as iniciais do nome do usuário
 * @param {string} nome - Nome completo do usuário
 * @returns {string} - Iniciais em maiúsculo (máximo 2 letras)
 */
function extrairIniciais(nome) {
  return nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Extrai o primeiro nome do usuário
 * @param {string} nome - Nome completo do usuário
 * @returns {string} - Primeiro nome
 */
function extrairPrimeiroNome(nome) {
  return nome.split(' ')[0];
}

/**
 * Atualiza os elementos de UI do usuário na página
 * @param {Object} usuario - Dados do usuário logado
 * @param {Object} opcoes - Opções de atualização
 * @param {boolean} opcoes.atualizarNome - Se deve atualizar o nome (default: false)
 */
function atualizarUIUsuario(usuario, opcoes = {}) {
  const iniciais = extrairIniciais(usuario.nome);

  $('.avatar-inicial').text(iniciais);

  if ($('#usuario-email').length) {
    $('#usuario-email').text(usuario.email);
  }

  if (opcoes.atualizarNome && $('#usuario-nome').length) {
    $('#usuario-nome').text(extrairPrimeiroNome(usuario.nome));
  }
}

/**
 * Handler para logout do usuário
 * @param {Event} e - Evento de click
 */
function handleLogout(e) {
  e.preventDefault();

  $('main').addClass('animate-exit');

  setTimeout(function() {
    Auth.logout();
  }, 300);
}

/**
 * Configura o botão de logout na página
 */
function configurarLogout() {
  $('#btn-logout').on('click', handleLogout);
}

/**
 * Módulo de utilitários do usuário
 * Funções compartilhadas para UI e ações do usuário
 */
export const Usuario = {
  extrairIniciais,
  extrairPrimeiroNome,
  atualizarUIUsuario,
  handleLogout,
  configurarLogout
};

