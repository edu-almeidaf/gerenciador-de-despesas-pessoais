import{$ as a,A as l}from"./auth-Dh7lbV3Z.js";const u="http://localhost:3001",m="https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL";function c(t){return t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function x(t){return t.split(" ").map(e=>e[0]).slice(0,2).join("").toUpperCase()}function p(t){const e=t.nome.split(" ")[0],r=x(t.nome);a("#usuario-nome").text(e),a("#usuario-email").text(t.email),a(".avatar-inicial").text(r)}function f(t){const e=t.filter(o=>o.tipo==="receita").reduce((o,n)=>o+n.valor,0),r=t.filter(o=>o.tipo==="despesa").reduce((o,n)=>o+n.valor,0),s=e-r;return{receitas:e,despesas:r,saldo:s}}function h(t){a("#card-saldo").text(c(t.saldo)),a("#card-receitas").text(c(t.receitas)),a("#card-despesas").text(c(t.despesas)),t.saldo<0?a("#card-saldo").addClass("text-red-600"):a("#card-saldo").removeClass("text-red-600")}function g(t){const e=a("#tabela-transacoes");if(t.length===0){e.html(`
      <tr>
        <td colspan="2" class="text-center text-zinc-500 py-8">
          <p>Nenhuma transação encontrada.</p>
          <a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">
            Adicionar primeira transação
          </a>
        </td>
      </tr>
    `);return}const r=t.map(s=>{const o=s.tipo==="receita",n=o?"text-green-600":"text-red-600",d=o?"+":"-";return`
      <tr class="hover">
        <td>
          <div class="flex flex-col">
            <span class="font-medium text-zinc-950 text-sm">${s.descricao}</span>
            <span class="text-xs text-zinc-500">${s.categoria}</span>
          </div>
        </td>
        <td class="text-right ${n} font-medium text-sm">
          ${d} ${c(s.valor)}
        </td>
      </tr>
    `}).join("");e.html(r)}function v(){a("#tabela-transacoes").html(`
    <tr>
      <td colspan="2" class="text-center text-zinc-500 py-8">
        <p>Erro ao carregar transações.</p>
        <p class="text-xs mt-1">Verifique se o servidor está rodando.</p>
      </td>
    </tr>
  `)}function b(){a(".card").each(function(t){const e=a(this);e.css({opacity:"0",transform:"translateY(20px)"}),setTimeout(()=>{e.css({transition:"all 0.4s ease-out",opacity:"1",transform:"translateY(0)"})},100*t)})}async function C(t){try{const r=(await a.ajax({url:`${u}/transacoes`,method:"GET",dataType:"json"})).filter(o=>Number(o.usuarioId)===Number(t));r.sort((o,n)=>new Date(n.data)-new Date(o.data));const s=f(r);h(s),g(r.slice(0,10)),b()}catch(e){console.error("Erro ao carregar transações:",e),v()}}function i(t,e){const r=a(t);if(!r.length)return;const s=e>=0,o=s?'<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';r.html(`${o} ${Math.abs(e).toFixed(2)}%`).removeClass("text-green-600").removeClass("text-red-600").addClass(s?"text-green-600":"text-red-600")}function w(){a("#cotacao-usd, #cotacao-eur").text("..."),a("#cotacao-usd-mobile, #cotacao-eur-mobile").text("...")}function y(){a("#cotacao-usd, #cotacao-eur").text("--"),a("#cotacao-usd-mobile, #cotacao-eur-mobile").text("--")}function R(t,e){a("#cotacao-usd").text(c(t)),a("#cotacao-eur").text(c(e)),a("#cotacao-usd-mobile").text(c(t)),a("#cotacao-eur-mobile").text(c(e))}async function T(){w();try{const t=await a.ajax({url:m,method:"GET",dataType:"json",timeout:1e4}),e=parseFloat(t.USDBRL.bid),r=parseFloat(t.EURBRL.bid);R(e,r);const s=parseFloat(t.USDBRL.pctChange),o=parseFloat(t.EURBRL.pctChange);i("#variacao-usd",s),i("#variacao-eur",o)}catch(t){console.error("Erro ao carregar cotações:",t),y()}}function E(t){t.preventDefault(),a("main").addClass("animate-exit"),setTimeout(function(){l.logout()},300)}function L(){a("#btn-logout").on("click",E)}function $(){const t=l.verificarAutenticacao(!0);t&&(p(t),C(t.id),T(),L())}a(document).ready($);
