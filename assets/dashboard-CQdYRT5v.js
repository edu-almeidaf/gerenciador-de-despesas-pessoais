import{$ as e,A as i}from"./auth-CSSp3u3s.js";const u="http://localhost:3001",m="https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL";e(document).ready(function(){const t=i.verificarAutenticacao(!0);if(!t)return;e("#usuario-nome").text(t.nome.split(" ")[0]),e("#usuario-email").text(t.email);const a=t.nome.split(" ").map(o=>o[0]).slice(0,2).join("").toUpperCase();e(".avatar-inicial").text(a),p(t.id),v(),e("#btn-logout").on("click",function(o){o.preventDefault(),e("main").addClass("animate-exit"),setTimeout(function(){i.logout()},300)})});function p(t){e.ajax({url:`${u}/transacoes`,method:"GET",dataType:"json"}).then(function(a){const o=a.filter(s=>Number(s.usuarioId)===Number(t));o.sort((s,n)=>new Date(n.data)-new Date(s.data));const r=x(o);f(r),h(o.slice(0,10)),g()}).catch(function(a){console.error("Erro ao carregar transações:",a),e("#tabela-transacoes").html(`
      <tr>
        <td colspan="2" class="text-center text-zinc-500 py-8">
          <p>Erro ao carregar transações.</p>
          <p class="text-xs mt-1">Verifique se o servidor está rodando.</p>
        </td>
      </tr>
    `)})}function x(t){const a=t.filter(s=>s.tipo==="receita").reduce((s,n)=>s+n.valor,0),o=t.filter(s=>s.tipo==="despesa").reduce((s,n)=>s+n.valor,0),r=a-o;return{receitas:a,despesas:o,saldo:r}}function f(t){e("#card-saldo").text(c(t.saldo)),e("#card-receitas").text(c(t.receitas)),e("#card-despesas").text(c(t.despesas)),t.saldo<0?e("#card-saldo").addClass("text-red-600"):e("#card-saldo").removeClass("text-red-600")}function h(t){const a=e("#tabela-transacoes");if(t.length===0){a.html(`
      <tr>
        <td colspan="2" class="text-center text-zinc-500 py-8">
          <p>Nenhuma transação encontrada.</p>
          <a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">
            Adicionar primeira transação
          </a>
        </td>
      </tr>
    `);return}const o=t.map(r=>{const s=r.tipo==="receita",n=s?"text-green-600":"text-red-600",d=s?"+":"-";return`
      <tr class="hover">
        <td>
          <div class="flex flex-col">
            <span class="font-medium text-zinc-950 text-sm">${r.descricao}</span>
            <span class="text-xs text-zinc-500">${r.categoria}</span>
          </div>
        </td>
        <td class="text-right ${n} font-medium text-sm">
          ${d} ${c(r.valor)}
        </td>
      </tr>
    `}).join("");a.html(o)}function v(){e("#cotacao-usd, #cotacao-eur").text("..."),e("#cotacao-usd-mobile, #cotacao-eur-mobile").text("..."),e.ajax({url:m,method:"GET",dataType:"json",timeout:1e4}).then(function(t){const a=parseFloat(t.USDBRL.bid),o=parseFloat(t.EURBRL.bid);e("#cotacao-usd").text(c(a)),e("#cotacao-eur").text(c(o)),e("#cotacao-usd-mobile").text(c(a)),e("#cotacao-eur-mobile").text(c(o));const r=parseFloat(t.USDBRL.pctChange),s=parseFloat(t.EURBRL.pctChange);l("#variacao-usd",r),l("#variacao-eur",s)}).catch(function(t){console.error("Erro ao carregar cotações:",t),e("#cotacao-usd, #cotacao-eur").text("--"),e("#cotacao-usd-mobile, #cotacao-eur-mobile").text("--")})}function l(t,a){const o=e(t);if(!o.length)return;const r=a>=0,s=r?'<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';o.html(`${s} ${Math.abs(a).toFixed(2)}%`).removeClass("text-green-600").removeClass("text-red-600").addClass(r?"text-green-600":"text-red-600")}function c(t){return t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function g(){e(".card").each(function(t){const a=e(this);a.css({opacity:"0",transform:"translateY(20px)"}),setTimeout(()=>{a.css({transition:"all 0.4s ease-out",opacity:"1",transform:"translateY(0)"})},100*t)})}
