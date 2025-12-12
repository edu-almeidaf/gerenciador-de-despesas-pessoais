import{$ as n,A as v}from"./auth-Dh7lbV3Z.js";import{U as h}from"./usuario-BcV4MTD3.js";function w(){const t=v.verificarAutenticacao(!0);return t?(h.atualizarUIUsuario(t),h.configurarLogout(),t):null}n(document).ready(w);const $="http://localhost:3001",u=10;let d=[],i=[],r=1;function M(t,e){let a;return function(...s){const l=()=>{clearTimeout(a),t(...s)};clearTimeout(a),a=setTimeout(l,e)}}function p(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function T(t){return t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function y(t){const[e,a,o]=t.split("-");return`${o}/${a}/${e}`}function A(t){const[,e,a]=t.split("-");return`${a}/${e}`}function x(t,e){n(".toast-notificacao").remove();const o=n(`
    <div class="toast toast-top toast-end toast-notificacao z-50">
      <div class="alert ${e==="success"?"alert-success":"alert-error"} shadow-lg">
        <span>${t}</span>
      </div>
    </div>
  `);n("body").append(o),setTimeout(()=>{o.fadeOut(300,function(){n(this).remove()})},3e3)}function C(t,e){const a=new Date(t),o=new Date,s=o.getMonth(),l=o.getFullYear();switch(e){case"este-mes":return a.getMonth()===s&&a.getFullYear()===l;case"mes-passado":{const c=s===0?11:s-1,b=s===0?l-1:l;return a.getMonth()===c&&a.getFullYear()===b}case"ultimos-3-meses":{const c=new Date(o);return c.setMonth(c.getMonth()-3),a>=c}case"este-ano":return a.getFullYear()===l;default:return!0}}function E(t,e){const a=[];if(e<=5)for(let s=1;s<=e;s++)a.push(s);else{a.push(1),t>3&&a.push("...");const s=Math.max(2,t-1),l=Math.min(e-1,t+1);for(let c=s;c<=l;c++)a.push(c);t<e-2&&a.push("..."),a.push(e)}return a}function P(){n("#tabela-transacoes").html(`
    <tr>
      <td colspan="5" class="text-center py-8">
        <p class="text-red-500">Erro ao carregar transações.</p>
        <p class="text-zinc-500 text-sm mt-1">Verifique se o servidor está rodando.</p>
      </td>
    </tr>
  `)}function k(){const t=d.length===0?"Nenhuma transação cadastrada.":"Nenhuma transação encontrada com os filtros aplicados.",e=d.length===0?'<a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">Adicionar primeira transação</a>':"";n("#tabela-transacoes").html(`
    <tr>
      <td colspan="5" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto text-zinc-300 mb-3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <p class="text-zinc-500">${t}</p>
        ${e}
      </td>
    </tr>
  `)}function z(t){const e=t.tipo==="receita",a=e?"text-green-600":"text-red-600",o=e?"+":"-",s=e?"bg-green-100 text-green-700":"bg-red-100 text-red-700",l=e?"Receita":"Despesa",c=y(t.data),b=A(t.data);return`
    <tr class="hover:bg-zinc-50 transition-colors">
      <td class="pl-4 py-3">
        <div class="flex flex-col gap-0.5">
          <span class="font-semibold text-zinc-950 text-sm">${p(t.descricao)}</span>
          <span class="text-xs text-zinc-500">${p(t.categoria)} • <span class="md:hidden inline">${b}</span></span>
        </div>
      </td>
      <td class="text-sm text-zinc-600 hidden md:table-cell">${c}</td>
      <td class="hidden md:table-cell text-center">
        <div class="badge badge-sm ${s} border-none text-xs">${l}</div>
      </td>
      <td class="text-right pr-4 font-bold ${a} text-sm">${o} ${T(t.valor)}</td>
      <td class="hidden md:table-cell text-center">
        <button class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 btn-excluir" data-id="${t.id}" title="Excluir transação">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  `}function f(){const t=n("#tabela-transacoes");if(i.length===0){k();return}const e=(r-1)*u,a=e+u,s=i.slice(e,a).map(z).join("");t.html(s)}function j(t){let e="";return e+=`
    <button class="join-item btn btn-sm ${r===1?"btn-disabled":"btn-ghost"}" 
            data-pagina="${r-1}" ${r===1?"disabled":""}>«</button>
  `,E(r,t).forEach(o=>{o==="..."?e+='<button class="join-item btn btn-sm btn-disabled">...</button>':e+=`
        <button class="join-item btn btn-sm ${o===r?"bg-red-500 text-white border-none hover:bg-red-600":"btn-ghost"}" 
                data-pagina="${o}">${o}</button>
      `}),e+=`
    <button class="join-item btn btn-sm ${r===t?"btn-disabled":"btn-ghost"}" 
            data-pagina="${r+1}" ${r===t?"disabled":""}>»</button>
  `,e}function D(){const t=parseInt(n(this).data("pagina"));t&&t!==r&&(r=t,f(),m(),n("html, body").animate({scrollTop:n("#tabela-transacoes").offset().top-100},300))}function m(){const t=Math.ceil(i.length/u),e=n("#paginacao"),a=n("#info-total"),o=(r-1)*u+1,s=Math.min(r*u,i.length);if(i.length>0?a.text(`Mostrando ${o}-${s} de ${i.length} transações`):a.text(""),t<=1){e.empty();return}e.html(j(t)),e.find("button:not(.btn-disabled)").on("click",D)}function g(){const t=n("#filtro-busca").val().toLowerCase().trim(),e=n("#filtro-tipo").val(),a=n("#filtro-periodo").val(),o=t||e||a;n("#btn-limpar-filtros").toggleClass("hidden",!o),i=d.filter(s=>!(t&&!s.descricao.toLowerCase().includes(t)||e&&s.tipo!==e||a&&!C(s.data,a))),r=1,f(),m()}function F(){n("#filtro-busca").val(""),n("#filtro-tipo").val(""),n("#filtro-periodo").val(""),n("#btn-limpar-filtros").addClass("hidden"),i=[...d],r=1,f(),m()}async function L(t){try{d=(await n.ajax({url:`${$}/transacoes`,method:"GET",dataType:"json"})).filter(a=>Number(a.usuarioId)===Number(t)).sort((a,o)=>new Date(o.data)-new Date(a.data)),i=[...d],r=1,f(),m()}catch(e){console.error("Erro ao carregar transações:",e),P()}}async function V(t){try{await n.ajax({url:`${$}/transacoes/${t}`,method:"DELETE"}),d=d.filter(a=>a.id!==t),i=i.filter(a=>a.id!==t);const e=Math.ceil(i.length/u);r>e&&e>0&&(r=e),f(),m(),x("Transação excluída com sucesso!","success")}catch(e){console.error("Erro ao excluir transação:",e),x("Erro ao excluir transação. Tente novamente.","error")}}function I(t){const e=d.find(o=>o.id===t);if(!e)return;confirm(`Deseja realmente excluir a transação "${e.descricao}"?`)&&V(t)}function N(){const t=n(this).data("id");I(t)}function U(t){t.preventDefault()}function R(){n("#filtro-busca").on("input",M(g,300)),n("#filtro-tipo").on("change",g),n("#filtro-periodo").on("change",g),n("#btn-limpar-filtros").on("click",F),n("#form-filtros").on("submit",U),n("#tabela-transacoes").on("click",".btn-excluir",N),h.configurarLogout()}function B(){const t=v.verificarAutenticacao(!0);t&&(h.atualizarUIUsuario(t),L(t.id),R())}n(document).ready(B);
