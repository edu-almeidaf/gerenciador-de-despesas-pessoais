import $ from 'jquery';
import { Auth } from './auth.js';

const API_URL = 'http://localhost:3001';
const COTACAO_API = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL';

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
 * Atualiza as informações do usuário na interface
 * @param {Object} usuario - Dados do usuário logado
 */
function atualizarInfoUsuario(usuario) {
  const primeiroNome = usuario.nome.split(' ')[0];
  const iniciais = extrairIniciais(usuario.nome);

  $('#usuario-nome').text(primeiroNome);
  $('#usuario-email').text(usuario.email);
  $('.avatar-inicial').text(iniciais);
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
 * Exibe mensagem de erro na tabela de transações
 */
function exibirErroTransacoes() {
  $('#tabela-transacoes').html(`
    <tr>
      <td colspan="2" class="text-center text-zinc-500 py-8">
        <p>Erro ao carregar transações.</p>
        <p class="text-xs mt-1">Verifique se o servidor está rodando.</p>
      </td>
    </tr>
  `);
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

/**
 * Carrega transações do usuário e atualiza o dashboard
 * @param {number} usuarioId - ID do usuário logado
 */
async function carregarTransacoes(usuarioId) {
  try {
    const todasTransacoes = await $.ajax({
      url: `${API_URL}/transacoes`,
      method: 'GET',
      dataType: 'json'
    });

    const transacoes = todasTransacoes.filter(t =>
      Number(t.usuarioId) === Number(usuarioId)
    );

    transacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    const totais = calcularTotais(transacoes);
    atualizarCards(totais);
    renderizarTransacoes(transacoes.slice(0, 10));
    animarCards();
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    exibirErroTransacoes();
  }
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
 * Exibe estado de loading nas cotações
 */
function exibirLoadingCotacoes() {
  $('#cotacao-usd, #cotacao-eur').text('...');
  $('#cotacao-usd-mobile, #cotacao-eur-mobile').text('...');
}

/**
 * Exibe erro nas cotações
 */
function exibirErroCotacoes() {
  $('#cotacao-usd, #cotacao-eur').text('--');
  $('#cotacao-usd-mobile, #cotacao-eur-mobile').text('--');
}

/**
 * Atualiza os valores das cotações na interface
 * @param {number} usd - Valor do dólar
 * @param {number} eur - Valor do euro
 */
function atualizarCotacoesUI(usd, eur) {
  $('#cotacao-usd').text(formatarMoeda(usd));
  $('#cotacao-eur').text(formatarMoeda(eur));
  $('#cotacao-usd-mobile').text(formatarMoeda(usd));
  $('#cotacao-eur-mobile').text(formatarMoeda(eur));
}

/**
 * Carrega cotações de moedas da API
 */
async function carregarCotacoes() {
  exibirLoadingCotacoes();

  try {
    const data = await $.ajax({
      url: COTACAO_API,
      method: 'GET',
      dataType: 'json',
      timeout: 10000
    });

    const usd = parseFloat(data.USDBRL.bid);
    const eur = parseFloat(data.EURBRL.bid);

    atualizarCotacoesUI(usd, eur);

    const variacaoUsd = parseFloat(data.USDBRL.pctChange);
    const variacaoEur = parseFloat(data.EURBRL.pctChange);

    atualizarVariacao('#variacao-usd', variacaoUsd);
    atualizarVariacao('#variacao-eur', variacaoEur);
  } catch (error) {
    console.error('Erro ao carregar cotações:', error);
    exibirErroCotacoes();
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
 * Configura os event listeners da página
 */
function configurarEventListeners() {
  $('#btn-logout').on('click', handleLogout);
}

/**
 * Inicializa o dashboard
 */
function init() {
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) return;

  atualizarInfoUsuario(usuario);
  carregarTransacoes(usuario.id);
  carregarCotacoes();
  configurarEventListeners();
}

/**
 * Módulo do Dashboard
 */
export const Dashboard = {
  init,
  formatarMoeda,
  calcularTotais
};

$(document).ready(init);
