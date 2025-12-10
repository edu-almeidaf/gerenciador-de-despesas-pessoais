import $ from 'jquery';
import { Auth } from './auth.js';

const API_URL = 'http://localhost:3001';
const ITENS_POR_PAGINA = 10;

// Estado da aplicação
let todasTransacoes = [];
let transacoesFiltradas = [];
let paginaAtual = 1;

$(document).ready(function() {
  // Verifica autenticação
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) {
    return;
  }

  // Atualiza informações do usuário no header
  atualizarInfoUsuario(usuario);

  // Carrega transações
  carregarTransacoes(usuario.id);

  // Event listeners dos filtros
  $('#filtro-busca').on('input', debounce(aplicarFiltros, 300));
  $('#filtro-tipo').on('change', aplicarFiltros);
  $('#filtro-periodo').on('change', aplicarFiltros);

  // Handler do botão limpar filtros
  $('#btn-limpar-filtros').on('click', limparFiltros);

  // Previne submit do form de filtros
  $('#form-filtros').on('submit', function(e) {
    e.preventDefault();
  });

  // Handler de logout
  $('#btn-logout').on('click', function(e) {
    e.preventDefault();
    $('main').addClass('animate-exit');
    setTimeout(function() {
      Auth.logout();
    }, 300);
  });

  // Delegação de eventos para botões de excluir
  $('#tabela-transacoes').on('click', '.btn-excluir', function() {
    const id = $(this).data('id');
    confirmarExclusao(id);
  });
});

/**
 * Atualiza informações do usuário no header
 * @param {Object} usuario - Dados do usuário
 */
function atualizarInfoUsuario(usuario) {
  $('#usuario-email').text(usuario.email);

  const iniciais = usuario.nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  $('.avatar-inicial').text(iniciais);
}

/**
 * Carrega transações do usuário
 * @param {number} usuarioId - ID do usuário
 */
function carregarTransacoes(usuarioId) {
  $.ajax({
    url: `${API_URL}/transacoes`,
    method: 'GET',
    dataType: 'json'
  })
    .then(function(dados) {
      // Filtra pelo usuário e ordena por data
      todasTransacoes = dados
        .filter(t => Number(t.usuarioId) === Number(usuarioId))
        .sort((a, b) => new Date(b.data) - new Date(a.data));

      transacoesFiltradas = [...todasTransacoes];
      paginaAtual = 1;

      renderizarTabela();
      renderizarPaginacao();
    })
    .catch(function(error) {
      console.error('Erro ao carregar transações:', error);
      $('#tabela-transacoes').html(`
        <tr>
          <td colspan="5" class="text-center py-8">
            <p class="text-red-500">Erro ao carregar transações.</p>
            <p class="text-zinc-500 text-sm mt-1">Verifique se o servidor está rodando.</p>
          </td>
        </tr>
      `);
    });
}

/**
 * Aplica os filtros nas transações
 */
function aplicarFiltros() {
  const busca = $('#filtro-busca').val().toLowerCase().trim();
  const tipo = $('#filtro-tipo').val();
  const periodo = $('#filtro-periodo').val();

  // Mostra/esconde botão de limpar filtros
  const temFiltroAtivo = busca || tipo || periodo;
  if (temFiltroAtivo) {
    $('#btn-limpar-filtros').removeClass('hidden');
  } else {
    $('#btn-limpar-filtros').addClass('hidden');
  }

  transacoesFiltradas = todasTransacoes.filter(transacao => {
    // Filtro de busca por descrição
    if (busca && !transacao.descricao.toLowerCase().includes(busca)) {
      return false;
    }

    // Filtro por tipo
    if (tipo && transacao.tipo !== tipo) {
      return false;
    }

    // Filtro por período
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
  // Reseta os valores dos filtros
  $('#filtro-busca').val('');
  $('#filtro-tipo').val('');
  $('#filtro-periodo').val('');

  // Esconde o botão de limpar
  $('#btn-limpar-filtros').addClass('hidden');

  // Restaura todas as transações
  transacoesFiltradas = [...todasTransacoes];
  paginaAtual = 1;

  renderizarTabela();
  renderizarPaginacao();
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
 * Renderiza a tabela de transações
 */
function renderizarTabela() {
  const $tbody = $('#tabela-transacoes');

  if (transacoesFiltradas.length === 0) {
    const mensagem = todasTransacoes.length === 0
      ? 'Nenhuma transação cadastrada.'
      : 'Nenhuma transação encontrada com os filtros aplicados.';

    $tbody.html(`
      <tr>
        <td colspan="5" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto text-zinc-300 mb-3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <p class="text-zinc-500">${mensagem}</p>
          ${todasTransacoes.length === 0 ? '<a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">Adicionar primeira transação</a>' : ''}
        </td>
      </tr>
    `);
    return;
  }

  // Calcula índices da página atual
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const transacoesPagina = transacoesFiltradas.slice(inicio, fim);

  const html = transacoesPagina.map(transacao => {
    const isReceita = transacao.tipo === 'receita';
    const valorClass = isReceita ? 'text-green-600' : 'text-red-600';
    const valorPrefixo = isReceita ? '+' : '-';
    const badgeClass = isReceita
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
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
  }).join('');

  $tbody.html(html);
}

/**
 * Renderiza a paginação
 */
function renderizarPaginacao() {
  const totalPaginas = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA);
  const $paginacao = $('#paginacao');
  const $infoTotal = $('#info-total');

  // Atualiza info total
  const inicio = ((paginaAtual - 1) * ITENS_POR_PAGINA) + 1;
  const fim = Math.min(paginaAtual * ITENS_POR_PAGINA, transacoesFiltradas.length);

  if (transacoesFiltradas.length > 0) {
    $infoTotal.text(`Mostrando ${inicio}-${fim} de ${transacoesFiltradas.length} transações`);
  } else {
    $infoTotal.text('');
  }

  // Se não há páginas ou só uma, esconde paginação
  if (totalPaginas <= 1) {
    $paginacao.empty();
    return;
  }

  let html = '';

  // Botão anterior
  html += `
    <button class="join-item btn btn-sm ${paginaAtual === 1 ? 'btn-disabled' : 'btn-ghost'}" 
            data-pagina="${paginaAtual - 1}" ${paginaAtual === 1 ? 'disabled' : ''}>«</button>
  `;

  // Números das páginas
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

  // Botão próximo
  html += `
    <button class="join-item btn btn-sm ${paginaAtual === totalPaginas ? 'btn-disabled' : 'btn-ghost'}" 
            data-pagina="${paginaAtual + 1}" ${paginaAtual === totalPaginas ? 'disabled' : ''}>»</button>
  `;

  $paginacao.html(html);

  // Event listener para botões de paginação
  $paginacao.find('button:not(.btn-disabled)').on('click', function() {
    const novaPagina = parseInt($(this).data('pagina'));
    if (novaPagina && novaPagina !== paginaAtual) {
      paginaAtual = novaPagina;
      renderizarTabela();
      renderizarPaginacao();

      // Scroll suave para o topo da tabela
      $('html, body').animate({
        scrollTop: $('#tabela-transacoes').offset().top - 100
      }, 300);
    }
  });
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
    // Sempre mostra primeira página
    paginas.push(1);

    if (atual > 3) {
      paginas.push('...');
    }

    // Páginas ao redor da atual
    const inicio = Math.max(2, atual - 1);
    const fim = Math.min(total - 1, atual + 1);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    if (atual < total - 2) {
      paginas.push('...');
    }

    // Sempre mostra última página
    paginas.push(total);
  }

  return paginas;
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
 * Exclui uma transação
 * @param {number} id - ID da transação
 */
function excluirTransacao(id) {
  $.ajax({
    url: `${API_URL}/transacoes/${id}`,
    method: 'DELETE'
  })
    .then(function() {
      // Remove da lista local
      todasTransacoes = todasTransacoes.filter(t => t.id !== id);
      transacoesFiltradas = transacoesFiltradas.filter(t => t.id !== id);

      // Ajusta página se necessário
      const totalPaginas = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA);
      if (paginaAtual > totalPaginas && totalPaginas > 0) {
        paginaAtual = totalPaginas;
      }

      renderizarTabela();
      renderizarPaginacao();

      // Feedback visual
      mostrarNotificacao('Transação excluída com sucesso!', 'success');
    })
    .catch(function(error) {
      console.error('Erro ao excluir transação:', error);
      mostrarNotificacao('Erro ao excluir transação. Tente novamente.', 'error');
    });
}

/**
 * Mostra notificação toast
 * @param {string} mensagem - Mensagem
 * @param {string} tipo - 'success' ou 'error'
 */
function mostrarNotificacao(mensagem, tipo) {
  // Remove notificação anterior se existir
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

  // Remove após 3 segundos
  setTimeout(() => {
    $toast.fadeOut(300, function() {
      $(this).remove();
    });
  }, 3000);
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

