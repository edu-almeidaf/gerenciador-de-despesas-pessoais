import{$ as n,A as h}from"./auth-Dh7lbV3Z.js";n(document).ready(function(){const e=h.verificarAutenticacao(!0);if(!e)return;const t=e.nome.split(" ").map(a=>a[0]).slice(0,2).join("").toUpperCase();n(".avatar-inicial").text(t),n("#usuario-email").length&&n("#usuario-email").text(e.email),n("#btn-logout").on("click",function(a){a.preventDefault(),n("main").addClass("animate-exit"),setTimeout(function(){h.logout()},300)})});const $="http://localhost:3001",m=10;let u=[],d=[],r=1;n(document).ready(function(){const e=h.verificarAutenticacao(!0);e&&(A(e),P(e.id),n("#filtro-busca").on("input",L(b,300)),n("#filtro-tipo").on("change",b),n("#filtro-periodo").on("change",b),n("#btn-limpar-filtros").on("click",j),n("#form-filtros").on("submit",function(t){t.preventDefault()}),n("#btn-logout").on("click",function(t){t.preventDefault(),n("main").addClass("animate-exit"),setTimeout(function(){h.logout()},300)}),n("#tabela-transacoes").on("click",".btn-excluir",function(){const t=n(this).data("id");D(t)}))});function A(e){n("#usuario-email").text(e.email);const t=e.nome.split(" ").map(a=>a[0]).slice(0,2).join("").toUpperCase();n(".avatar-inicial").text(t)}function P(e){n.ajax({url:`${$}/transacoes`,method:"GET",dataType:"json"}).then(function(t){u=t.filter(a=>Number(a.usuarioId)===Number(e)).sort((a,i)=>new Date(i.data)-new Date(a.data)),d=[...u],r=1,f(),p()}).catch(function(t){console.error("Erro ao carregar transações:",t),n("#tabela-transacoes").html(`
        <tr>
          <td colspan="5" class="text-center py-8">
            <p class="text-red-500">Erro ao carregar transações.</p>
            <p class="text-zinc-500 text-sm mt-1">Verifique se o servidor está rodando.</p>
          </td>
        </tr>
      `)})}function b(){const e=n("#filtro-busca").val().toLowerCase().trim(),t=n("#filtro-tipo").val(),a=n("#filtro-periodo").val();e||t||a?n("#btn-limpar-filtros").removeClass("hidden"):n("#btn-limpar-filtros").addClass("hidden"),d=u.filter(s=>!(e&&!s.descricao.toLowerCase().includes(e)||t&&s.tipo!==t||a&&!k(s.data,a))),r=1,f(),p()}function j(){n("#filtro-busca").val(""),n("#filtro-tipo").val(""),n("#filtro-periodo").val(""),n("#btn-limpar-filtros").addClass("hidden"),d=[...u],r=1,f(),p()}function k(e,t){const a=new Date(e),i=new Date,s=i.getMonth(),o=i.getFullYear();switch(t){case"este-mes":return a.getMonth()===s&&a.getFullYear()===o;case"mes-passado":{const c=s===0?11:s-1,l=s===0?o-1:o;return a.getMonth()===c&&a.getFullYear()===l}case"ultimos-3-meses":{const c=new Date(i);return c.setMonth(c.getMonth()-3),a>=c}case"este-ano":return a.getFullYear()===o;default:return!0}}function f(){const e=n("#tabela-transacoes");if(d.length===0){const o=u.length===0?"Nenhuma transação cadastrada.":"Nenhuma transação encontrada com os filtros aplicados.";e.html(`
      <tr>
        <td colspan="5" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto text-zinc-300 mb-3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <p class="text-zinc-500">${o}</p>
          ${u.length===0?'<a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">Adicionar primeira transação</a>':""}
        </td>
      </tr>
    `);return}const t=(r-1)*m,a=t+m,s=d.slice(t,a).map(o=>{const c=o.tipo==="receita",l=c?"text-green-600":"text-red-600",g=c?"+":"-",w=c?"bg-green-100 text-green-700":"bg-red-100 text-red-700",T=c?"Receita":"Despesa",M=z(o.data),C=F(o.data);return`
      <tr class="hover:bg-zinc-50 transition-colors">
        <td class="pl-4 py-3">
          <div class="flex flex-col gap-0.5">
            <span class="font-semibold text-zinc-950 text-sm">${v(o.descricao)}</span>
            <span class="text-xs text-zinc-500">${v(o.categoria)} • <span class="md:hidden inline">${C}</span></span>
          </div>
        </td>
        <td class="text-sm text-zinc-600 hidden md:table-cell">${M}</td>
        <td class="hidden md:table-cell text-center">
          <div class="badge badge-sm ${w} border-none text-xs">${T}</div>
        </td>
        <td class="text-right pr-4 font-bold ${l} text-sm">${g} ${V(o.valor)}</td>
        <td class="hidden md:table-cell text-center">
          <button class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 btn-excluir" data-id="${o.id}" title="Excluir transação">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `}).join("");e.html(s)}function p(){const e=Math.ceil(d.length/m),t=n("#paginacao"),a=n("#info-total"),i=(r-1)*m+1,s=Math.min(r*m,d.length);if(d.length>0?a.text(`Mostrando ${i}-${s} de ${d.length} transações`):a.text(""),e<=1){t.empty();return}let o="";o+=`
    <button class="join-item btn btn-sm ${r===1?"btn-disabled":"btn-ghost"}" 
            data-pagina="${r-1}" ${r===1?"disabled":""}>«</button>
  `,y(r,e).forEach(l=>{l==="..."?o+='<button class="join-item btn btn-sm btn-disabled">...</button>':o+=`
        <button class="join-item btn btn-sm ${l===r?"bg-red-500 text-white border-none hover:bg-red-600":"btn-ghost"}" 
                data-pagina="${l}">${l}</button>
      `}),o+=`
    <button class="join-item btn btn-sm ${r===e?"btn-disabled":"btn-ghost"}" 
            data-pagina="${r+1}" ${r===e?"disabled":""}>»</button>
  `,t.html(o),t.find("button:not(.btn-disabled)").on("click",function(){const l=parseInt(n(this).data("pagina"));l&&l!==r&&(r=l,f(),p(),n("html, body").animate({scrollTop:n("#tabela-transacoes").offset().top-100},300))})}function y(e,t){const a=[];if(t<=5)for(let s=1;s<=t;s++)a.push(s);else{a.push(1),e>3&&a.push("...");const s=Math.max(2,e-1),o=Math.min(t-1,e+1);for(let c=s;c<=o;c++)a.push(c);e<t-2&&a.push("..."),a.push(t)}return a}function D(e){const t=u.find(i=>i.id===e);if(!t)return;confirm(`Deseja realmente excluir a transação "${t.descricao}"?`)&&E(e)}function E(e){n.ajax({url:`${$}/transacoes/${e}`,method:"DELETE"}).then(function(){u=u.filter(a=>a.id!==e),d=d.filter(a=>a.id!==e);const t=Math.ceil(d.length/m);r>t&&t>0&&(r=t),f(),p(),x("Transação excluída com sucesso!","success")}).catch(function(t){console.error("Erro ao excluir transação:",t),x("Erro ao excluir transação. Tente novamente.","error")})}function x(e,t){n(".toast-notificacao").remove();const i=n(`
    <div class="toast toast-top toast-end toast-notificacao z-50">
      <div class="alert ${t==="success"?"alert-success":"alert-error"} shadow-lg">
        <span>${e}</span>
      </div>
    </div>
  `);n("body").append(i),setTimeout(()=>{i.fadeOut(300,function(){n(this).remove()})},3e3)}function z(e){const[t,a,i]=e.split("-");return`${i}/${a}/${t}`}function F(e){const[,t,a]=e.split("-");return`${a}/${t}`}function V(e){return e.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function v(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function L(e,t){let a;return function(...s){const o=()=>{clearTimeout(a),e(...s)};clearTimeout(a),a=setTimeout(o,t)}}
