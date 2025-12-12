import $ from 'jquery';
import { Auth } from '../core/auth.js';
import { Usuario } from '../modules/usuario.js';

const API_URL = 'http://localhost:3001';
const ITENS_POR_PAGINA = 10;

let todasTransacoes = [];
let transacoesFiltradas = [];
let paginaAtual = 1;

/**
 * Debounce para otimizar eventos de input
 * @param {Function} func - Função a executar
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} str - String a escapar
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Formata valor para moeda brasileira
 * @param {number} valor - Valor a formatar
 * @returns {string}
 */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string}
 */
function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata data curta para mobile (DD/MM)
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string}
 */
function formatarDataCurta(data) {
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

/**
 * Mostra notificação toast
 * @param {string} mensagem - Mensagem a exibir
 * @param {string} tipo - 'success' ou 'error'
 */
function mostrarNotificacao(mensagem, tipo) {
  $('.toast-notificacao').remove();

  const bgClass = tipo === 'success' ? 'alert-success' : 'alert-error';

  const $toast = $(`
    <div class="toast toast-top toast-end toast-notificacao z-50">
      <div class="alert ${bgClass} shadow-lg">
        <span>${mensagem}</span>
      </div>
    </div>
  `);

  $('body').append($toast);

  setTimeout(() => {
    $toast.fadeOut(300, function() {
      $(this).remove();
    });
  }, 3000);
}

/**
 * Filtra transação por período
 * @param {string} dataTransacao - Data da transação (YYYY-MM-DD)
 * @param {string} periodo - Período selecionado
 * @returns {boolean}
 */
function filtrarPorPeriodo(dataTransacao, periodo) {
  const data = new Date(dataTransacao);
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  switch (periodo) {
  case 'este-mes':
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;

  case 'mes-passado': {
    const mesPassado = mesAtual === 0 ? 11 : mesAtual - 1;
    const anoMesPassado = mesAtual === 0 ? anoAtual - 1 : anoAtual;
    return data.getMonth() === mesPassado && data.getFullYear() === anoMesPassado;
  }

  case 'ultimos-3-meses': {
    const tresMesesAtras = new Date(hoje);
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
    return data >= tresMesesAtras;
  }

  case 'este-ano':
    return data.getFullYear() === anoAtual;

  default:
    return true;
  }
}

/**
 * Calcula quais páginas mostrar na paginação
 * @param {number} atual - Página atual
 * @param {number} total - Total de páginas
 * @returns {Array} - Array com números das páginas e "..."
 */
function calcularPaginasVisiveis(atual, total) {
  const paginas = [];
  const maxVisiveis = 5;

  if (total <= maxVisiveis) {
    for (let i = 1; i <= total; i++) {
      paginas.push(i);
    }
  } else {
    paginas.push(1);

    if (atual > 3) {
      paginas.push('...');
    }

    const inicio = Math.max(2, atual - 1);
    const fim = Math.min(total - 1, atual + 1);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    if (atual < total - 2) {
      paginas.push('...');
    }

    paginas.push(total);
  }

  return paginas;
}

/**
 * Exibe mensagem de erro ao carregar transações
 */
function exibirErroCarregamento() {
  $('#tabela-transacoes').html(`
    <tr>
      <td colspan="5" class="text-center py-8">
        <p class="text-red-500">Erro ao carregar transações.</p>
        <p class="text-zinc-500 text-sm mt-1">Verifique se o servidor está rodando.</p>
      </td>
    </tr>
  `);
}

/**
 * Exibe mensagem quando não há transações
 */
function exibirMensagemVazia() {
  const mensagem = todasTransacoes.length === 0
    ? 'Nenhuma transação cadastrada.'
    : 'Nenhuma transação encontrada com os filtros aplicados.';

  const linkAdicionar = todasTransacoes.length === 0
    ? '<a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">Adicionar primeira transação</a>'
    : '';

  $('#tabela-transacoes').html(`
    <tr>
      <td colspan="5" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto text-zinc-300 mb-3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <p class="text-zinc-500">${mensagem}</p>
        ${linkAdicionar}
      </td>
    </tr>
  `);
}

/**
 * Gera HTML de uma linha da tabela de transações
 * @param {Object} transacao - Dados da transação
 * @returns {string} - HTML da linha
 */
function gerarLinhaTransacao(transacao) {
  const isReceita = transacao.tipo === 'receita';
  const valorClass = isReceita ? 'text-green-600' : 'text-red-600';
  const valorPrefixo = isReceita ? '+' : '-';
  const badgeClass = isReceita ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const badgeText = isReceita ? 'Receita' : 'Despesa';
  const dataFormatada = formatarData(transacao.data);
  const dataCurta = formatarDataCurta(transacao.data);

  return `
    <tr class="hover:bg-zinc-50 transition-colors">
      <td class="pl-4 py-3">
        <div class="flex flex-col gap-0.5">
          <span class="font-semibold text-zinc-950 text-sm">${escapeHtml(transacao.descricao)}</span>
          <span class="text-xs text-zinc-500">${escapeHtml(transacao.categoria)} • <span class="md:hidden inline">${dataCurta}</span></span>
        </div>
      </td>
      <td class="text-sm text-zinc-600 hidden md:table-cell">${dataFormatada}</td>
      <td class="hidden md:table-cell text-center">
        <div class="badge badge-sm ${badgeClass} border-none text-xs">${badgeText}</div>
      </td>
      <td class="text-right pr-4 font-bold ${valorClass} text-sm">${valorPrefixo} ${formatarMoeda(transacao.valor)}</td>
      <td class="hidden md:table-cell text-center">
        <button class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 btn-excluir" data-id="${transacao.id}" title="Excluir transação">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  `;
}

/**
 * Renderiza a tabela de transações
 */
function renderizarTabela() {
  const $tbody = $('#tabela-transacoes');

  if (transacoesFiltradas.length === 0) {
    exibirMensagemVazia();
    return;
  }

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const transacoesPagina = transacoesFiltradas.slice(inicio, fim);

  const html = transacoesPagina.map(gerarLinhaTransacao).join('');
  $tbody.html(html);
}

/**
 * Gera HTML dos botões de paginação
 * @param {number} totalPaginas - Total de páginas
 * @returns {string} - HTML dos botões
 */
function gerarBotoesPaginacao(totalPaginas) {
  let html = '';

  html += `
    <button class="join-item btn btn-sm ${paginaAtual === 1 ? 'btn-disabled' : 'btn-ghost'}" 
            data-pagina="${paginaAtual - 1}" ${paginaAtual === 1 ? 'disabled' : ''}>«</button>
  `;

  const paginasVisiveis = calcularPaginasVisiveis(paginaAtual, totalPaginas);

  paginasVisiveis.forEach((pagina) => {
    if (pagina === '...') {
      html += '<button class="join-item btn btn-sm btn-disabled">...</button>';
    } else {
      const isAtiva = pagina === paginaAtual;
      html += `
        <button class="join-item btn btn-sm ${isAtiva ? 'bg-red-500 text-white border-none hover:bg-red-600' : 'btn-ghost'}" 
                data-pagina="${pagina}">${pagina}</button>
      `;
    }
  });

  html += `
    <button class="join-item btn btn-sm ${paginaAtual === totalPaginas ? 'btn-disabled' : 'btn-ghost'}" 
            data-pagina="${paginaAtual + 1}" ${paginaAtual === totalPaginas ? 'disabled' : ''}>»</button>
  `;

  return html;
}

/**
 * Handler para clique nos botões de paginação
 */
function handlePaginacaoClick() {
  const novaPagina = parseInt($(this).data('pagina'));
  if (novaPagina && novaPagina !== paginaAtual) {
    paginaAtual = novaPagina;
    renderizarTabela();
    renderizarPaginacao();

    $('html, body').animate({
      scrollTop: $('#tabela-transacoes').offset().top - 100
    }, 300);
  }
}

/**
 * Renderiza a paginação
 */
function renderizarPaginacao() {
  const totalPaginas = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA);
  const $paginacao = $('#paginacao');
  const $infoTotal = $('#info-total');

  const inicio = ((paginaAtual - 1) * ITENS_POR_PAGINA) + 1;
  const fim = Math.min(paginaAtual * ITENS_POR_PAGINA, transacoesFiltradas.length);

  if (transacoesFiltradas.length > 0) {
    $infoTotal.text(`Mostrando ${inicio}-${fim} de ${transacoesFiltradas.length} transações`);
  } else {
    $infoTotal.text('');
  }

  if (totalPaginas <= 1) {
    $paginacao.empty();
    return;
  }

  $paginacao.html(gerarBotoesPaginacao(totalPaginas));
  $paginacao.find('button:not(.btn-disabled)').on('click', handlePaginacaoClick);
}

/**
 * Aplica os filtros nas transações
 */
function aplicarFiltros() {
  const busca = $('#filtro-busca').val().toLowerCase().trim();
  const tipo = $('#filtro-tipo').val();
  const periodo = $('#filtro-periodo').val();

  const temFiltroAtivo = busca || tipo || periodo;
  $('#btn-limpar-filtros').toggleClass('hidden', !temFiltroAtivo);

  transacoesFiltradas = todasTransacoes.filter(transacao => {
    if (busca && !transacao.descricao.toLowerCase().includes(busca)) {
      return false;
    }

    if (tipo && transacao.tipo !== tipo) {
      return false;
    }

    if (periodo && !filtrarPorPeriodo(transacao.data, periodo)) {
      return false;
    }

    return true;
  });

  paginaAtual = 1;
  renderizarTabela();
  renderizarPaginacao();
}

/**
 * Limpa todos os filtros e restaura a lista completa
 */
function limparFiltros() {
  $('#filtro-busca').val('');
  $('#filtro-tipo').val('');
  $('#filtro-periodo').val('');
  $('#btn-limpar-filtros').addClass('hidden');

  transacoesFiltradas = [...todasTransacoes];
  paginaAtual = 1;

  renderizarTabela();
  renderizarPaginacao();
}

/**
 * Carrega transações do usuário
 * @param {number} usuarioId - ID do usuário
 */
async function carregarTransacoes(usuarioId) {
  try {
    const dados = await $.ajax({
      url: `${API_URL}/transacoes`,
      method: 'GET',
      dataType: 'json'
    });

    todasTransacoes = dados
      .filter(t => Number(t.usuarioId) === Number(usuarioId))
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    transacoesFiltradas = [...todasTransacoes];
    paginaAtual = 1;

    renderizarTabela();
    renderizarPaginacao();
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    exibirErroCarregamento();
  }
}

/**
 * Exclui uma transação
 * @param {number} id - ID da transação
 */
async function excluirTransacao(id) {
  try {
    await $.ajax({
      url: `${API_URL}/transacoes/${id}`,
      method: 'DELETE'
    });

    todasTransacoes = todasTransacoes.filter(t => t.id !== id);
    transacoesFiltradas = transacoesFiltradas.filter(t => t.id !== id);

    const totalPaginas = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA);
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      paginaAtual = totalPaginas;
    }

    renderizarTabela();
    renderizarPaginacao();
    mostrarNotificacao('Transação excluída com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    mostrarNotificacao('Erro ao excluir transação. Tente novamente.', 'error');
  }
}

/**
 * Confirma e executa exclusão de transação
 * @param {number} id - ID da transação
 */
function confirmarExclusao(id) {
  const transacao = todasTransacoes.find(t => t.id === id);
  if (!transacao) return;

  const confirmado = confirm(`Deseja realmente excluir a transação "${transacao.descricao}"?`);

  if (confirmado) {
    excluirTransacao(id);
  }
}

/**
 * Handler para clique no botão de excluir
 */
function handleExcluirClick() {
  const id = $(this).data('id');
  confirmarExclusao(id);
}

/**
 * Handler para submit do formulário de filtros
 * @param {Event} e - Evento de submit
 */
function handleFiltrosSubmit(e) {
  e.preventDefault();
}

/**
 * Configura os event listeners da página
 */
function configurarEventListeners() {
  $('#filtro-busca').on('input', debounce(aplicarFiltros, 300));
  $('#filtro-tipo').on('change', aplicarFiltros);
  $('#filtro-periodo').on('change', aplicarFiltros);
  $('#btn-limpar-filtros').on('click', limparFiltros);
  $('#form-filtros').on('submit', handleFiltrosSubmit);
  $('#tabela-transacoes').on('click', '.btn-excluir', handleExcluirClick);

  Usuario.configurarLogout();
}

/**
 * Inicializa a página de transações
 */
function init() {
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) return;

  Usuario.atualizarUIUsuario(usuario);
  carregarTransacoes(usuario.id);
  configurarEventListeners();
}

/**
 * Módulo de Transações
 */
export const Transacoes = {
  init,
  formatarMoeda,
  formatarData
};

$(document).ready(init);

