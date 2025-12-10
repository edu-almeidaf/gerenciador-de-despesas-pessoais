import $ from 'jquery';
import { Auth } from './auth.js';

const API_URL = 'http://localhost:3001';
const COTACAO_API = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL';

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

  // Carrega dados do dashboard
  carregarTransacoes(usuario.id);
  carregarCotacoes();

  // Handler de logout
  $('#btn-logout').on('click', function(e) {
    e.preventDefault();
    
    // Animação de saída
    $('main').addClass('animate-exit');
    
    setTimeout(function() {
      Auth.logout();
    }, 300);
  });
});

/**
 * Carrega transações do usuário e atualiza o dashboard
 * @param {number} usuarioId - ID do usuário logado
 */
function carregarTransacoes(usuarioId) {
  $.ajax({
    url: `${API_URL}/transacoes`,
    method: 'GET',
    dataType: 'json'
  })
  .then(function(todasTransacoes) {
    // Filtra transações do usuário (garante comparação numérica)
    const transacoes = todasTransacoes.filter(t => 
      Number(t.usuarioId) === Number(usuarioId)
    );
    
    // Ordena por data (mais recente primeiro)
    transacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // Calcula totais
    const totais = calcularTotais(transacoes);
    
    // Atualiza cards
    atualizarCards(totais);
    
    // Renderiza últimas 10 transações
    renderizarTransacoes(transacoes.slice(0, 10));
    
    // Animação de entrada dos cards
    animarCards();
  })
  .catch(function(error) {
    console.error('Erro ao carregar transações:', error);
    $('#tabela-transacoes').html(`
      <tr>
        <td colspan="2" class="text-center text-zinc-500 py-8">
          <p>Erro ao carregar transações.</p>
          <p class="text-xs mt-1">Verifique se o servidor está rodando.</p>
        </td>
      </tr>
    `);
  });
}

/**
 * Calcula totais de receitas, despesas e saldo
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Totais calculados
 */
function calcularTotais(transacoes) {
  const receitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);
    
  const despesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);
    
  const saldo = receitas - despesas;
  
  return { receitas, despesas, saldo };
}

/**
 * Atualiza os cards com os valores calculados
 * @param {Object} totais - Objeto com receitas, despesas e saldo
 */
function atualizarCards(totais) {
  $('#card-saldo').text(formatarMoeda(totais.saldo));
  $('#card-receitas').text(formatarMoeda(totais.receitas));
  $('#card-despesas').text(formatarMoeda(totais.despesas));
  
  // Muda cor do saldo se negativo
  if (totais.saldo < 0) {
    $('#card-saldo').addClass('text-red-600');
  } else {
    $('#card-saldo').removeClass('text-red-600');
  }
}

/**
 * Renderiza a tabela de transações
 * @param {Array} transacoes - Lista de transações (máximo 10)
 */
function renderizarTransacoes(transacoes) {
  const $tbody = $('#tabela-transacoes');
  
  if (transacoes.length === 0) {
    $tbody.html(`
      <tr>
        <td colspan="2" class="text-center text-zinc-500 py-8">
          <p>Nenhuma transação encontrada.</p>
          <a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">
            Adicionar primeira transação
          </a>
        </td>
      </tr>
    `);
    return;
  }
  
  const html = transacoes.map(transacao => {
    const isReceita = transacao.tipo === 'receita';
    const valorClass = isReceita ? 'text-green-600' : 'text-red-600';
    const valorPrefixo = isReceita ? '+' : '-';
    
    return `
      <tr class="hover">
        <td>
          <div class="flex flex-col">
            <span class="font-medium text-zinc-950 text-sm">${transacao.descricao}</span>
            <span class="text-xs text-zinc-500">${transacao.categoria}</span>
          </div>
        </td>
        <td class="text-right ${valorClass} font-medium text-sm">
          ${valorPrefixo} ${formatarMoeda(transacao.valor)}
        </td>
      </tr>
    `;
  }).join('');
  
  $tbody.html(html);
}

/**
 * Carrega cotações de moedas da API
 */
function carregarCotacoes() {
  // Mostra loading
  $('#cotacao-usd, #cotacao-eur').text('...');
  $('#cotacao-usd-mobile, #cotacao-eur-mobile').text('...');
  
  $.ajax({
    url: COTACAO_API,
    method: 'GET',
    dataType: 'json',
    timeout: 10000
  })
  .then(function(data) {
    const usd = parseFloat(data.USDBRL.bid);
    const eur = parseFloat(data.EURBRL.bid);
    
    // Atualiza desktop
    $('#cotacao-usd').text(formatarMoeda(usd));
    $('#cotacao-eur').text(formatarMoeda(eur));
    
    // Atualiza mobile
    $('#cotacao-usd-mobile').text(formatarMoeda(usd));
    $('#cotacao-eur-mobile').text(formatarMoeda(eur));
    
    // Atualiza variação (se disponível)
    const variacaoUsd = parseFloat(data.USDBRL.pctChange);
    const variacaoEur = parseFloat(data.EURBRL.pctChange);
    
    atualizarVariacao('#variacao-usd', variacaoUsd);
    atualizarVariacao('#variacao-eur', variacaoEur);
  })
  .catch(function(error) {
    console.error('Erro ao carregar cotações:', error);
    $('#cotacao-usd, #cotacao-eur').text('--');
    $('#cotacao-usd-mobile, #cotacao-eur-mobile').text('--');
  });
}

/**
 * Atualiza indicador de variação da cotação
 * @param {string} selector - Seletor do elemento
 * @param {number} variacao - Percentual de variação
 */
function atualizarVariacao(selector, variacao) {
  const $el = $(selector);
  if (!$el.length) return;
  
  const isPositivo = variacao >= 0;
  const icon = isPositivo 
    ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
  
  $el
    .html(`${icon} ${Math.abs(variacao).toFixed(2)}%`)
    .removeClass('text-green-600')
    .removeClass('text-red-600')
    .addClass(isPositivo ? 'text-green-600' : 'text-red-600');
}

/**
 * Formata valor para moeda brasileira
 * @param {number} valor - Valor a formatar
 * @returns {string} - Valor formatado
 */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Animação de entrada dos cards
 */
function animarCards() {
  $('.card').each(function(index) {
    const $card = $(this);
    $card.css({
      'opacity': '0',
      'transform': 'translateY(20px)'
    });
    
    setTimeout(() => {
      $card.css({
        'transition': 'all 0.4s ease-out',
        'opacity': '1',
        'transform': 'translateY(0)'
      });
    }, 100 * index);
  });
}
