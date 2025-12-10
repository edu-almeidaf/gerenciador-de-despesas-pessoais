import $ from 'jquery';
import { Auth } from './auth.js';

$(document).ready(function() {
  // Verifica autenticação - redireciona se não logado
  const usuario = Auth.verificarAutenticacao(true);
  
  if (!usuario) {
    return; // Vai redirecionar
  }

  // Atualiza nome do usuário na saudação
  $('#usuario-nome').text(usuario.nome.split(' ')[0]);
  
  // Atualiza email no dropdown
  $('#usuario-email').text(usuario.email);
  
  // Atualiza iniciais do avatar
  const iniciais = usuario.nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  $('.avatar-inicial').text(iniciais);

  // Handler de logout
  $('#btn-logout').on('click', function(e) {
    e.preventDefault();
    
    // Animação de saída
    $('main').addClass('animate-exit');
    
    setTimeout(function() {
      Auth.logout();
    }, 300);
  });

  // Animação de entrada dos cards
  $('.card').each(function(index) {
    $(this).css({
      'opacity': '0',
      'transform': 'translateY(20px)'
    });
    
    setTimeout(() => {
      $(this).css({
        'transition': 'all 0.4s ease-out',
        'opacity': '1',
        'transform': 'translateY(0)'
      });
    }, 100 * index);
  });
});

