import $ from 'jquery';
import { Auth } from './auth.js';

/**
 * Script para páginas protegidas (que requerem autenticação)
 * Verifica se o usuário está logado e atualiza elementos comuns
 */
$(document).ready(function() {
  // Verifica autenticação - redireciona se não logado
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) {
    return; // Vai redirecionar para login
  }

  // Atualiza iniciais do avatar em todas as páginas
  const iniciais = usuario.nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  $('.avatar-inicial').text(iniciais);

  // Se houver dropdown de usuário, atualiza o email
  if ($('#usuario-email').length) {
    $('#usuario-email').text(usuario.email);
  }

  // Handler de logout (se existir na página)
  $('#btn-logout').on('click', function(e) {
    e.preventDefault();

    // Animação de saída
    $('main').addClass('animate-exit');

    setTimeout(function() {
      Auth.logout();
    }, 300);
  });
});

