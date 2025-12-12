import{$ as n,A as v}from"./auth-Dh7lbV3Z.js";import{U as h}from"./usuario-BcV4MTD3.js";function w(){const t=v.verificarAutenticacao(!0);return t?(h.atualizarUIUsuario(t),h.configurarLogout(),t):null}n(document).ready(w);const $="http://localhost:3001",u=10;let d=[],c=[],r=1;function M(t,a){let e;return function(...s){const l=()=>{clearTimeout(e),t(...s)};clearTimeout(e),e=setTimeout(l,a)}}function g(t){const a=document.createElement("div");return a.textContent=t,a.innerHTML}function T(t){return t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function y(t){const[a,e,o]=t.split("-");return`${o}/${e}/${a}`}function A(t){const[,a,e]=t.split("-");return`${e}/${a}`}function x(t,a){n(".toast-notificacao").remove();const o=n(`
    <div class="toast toast-top toast-end toast-notificacao z-50">
      <div class="alert ${a==="success"?"alert-success":"alert-error"} shadow-lg">
        <span>${t}</span>
      </div>
    </div>
  `);n("body").append(o),setTimeout(()=>{o.fadeOut(300,function(){n(this).remove()})},3e3)}function C(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function E(t,a){const e=C(t),o=new Date,s=o.getMonth(),l=o.getFullYear();switch(a){case"este-mes":return e.getMonth()===s&&e.getFullYear()===l;case"mes-passado":{const i=s===0?11:s-1,p=s===0?l-1:l;return e.getMonth()===i&&e.getFullYear()===p}case"ultimos-3-meses":{const i=new Date(o);return i.setMonth(i.getMonth()-3),i.setHours(0,0,0,0),e>=i}case"este-ano":return e.getFullYear()===l;default:return!0}}function P(t,a){const e=[];if(a<=5)for(let s=1;s<=a;s++)e.push(s);else{e.push(1),t>3&&e.push("...");const s=Math.max(2,t-1),l=Math.min(a-1,t+1);for(let i=s;i<=l;i++)e.push(i);t<a-2&&e.push("..."),e.push(a)}return e}function k(){n("#tabela-transacoes").html(`
    <tr>
      <td colspan="5" class="text-center py-8">
        <p class="text-red-500">Erro ao carregar transações.</p>
        <p class="text-zinc-500 text-sm mt-1">Verifique se o servidor está rodando.</p>
      </td>
    </tr>
  `)}function z(){const t=d.length===0?"Nenhuma transação cadastrada.":"Nenhuma transação encontrada com os filtros aplicados.",a=d.length===0?'<a href="./adicionar-transacao.html" class="link text-red-500 text-sm mt-2 inline-block">Adicionar primeira transação</a>':"";n("#tabela-transacoes").html(`
    <tr>
      <td colspan="5" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto text-zinc-300 mb-3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <p class="text-zinc-500">${t}</p>
        ${a}
      </td>
    </tr>
  `)}function D(t){const a=t.tipo==="receita",e=a?"text-green-600":"text-red-600",o=a?"+":"-",s=a?"bg-green-100 text-green-700":"bg-red-100 text-red-700",l=a?"Receita":"Despesa",i=y(t.data),p=A(t.data);return`
    <tr class="hover:bg-zinc-50 transition-colors">
      <td class="pl-4 py-3">
        <div class="flex flex-col gap-0.5">
          <span class="font-semibold text-zinc-950 text-sm">${g(t.descricao)}</span>
          <span class="text-xs text-zinc-500">${g(t.categoria)} • <span class="md:hidden inline">${p}</span></span>
        </div>
      </td>
      <td class="text-sm text-zinc-600 hidden md:table-cell">${i}</td>
      <td class="hidden md:table-cell text-center">
        <div class="badge badge-sm ${s} border-none text-xs">${l}</div>
      </td>
      <td class="text-right pr-4 font-bold ${e} text-sm">${o} ${T(t.valor)}</td>
      <td class="hidden md:table-cell text-center">
        <button class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 btn-excluir" data-id="${t.id}" title="Excluir transação">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  `}function f(){const t=n("#tabela-transacoes");if(c.length===0){z();return}const a=(r-1)*u,e=a+u,s=c.slice(a,e).map(D).join("");t.html(s)}function L(t){let a="";return a+=`
    <button class="join-item btn btn-sm ${r===1?"btn-disabled":"btn-ghost"}" 
            data-pagina="${r-1}" ${r===1?"disabled":""}>«</button>
  `,P(r,t).forEach(o=>{o==="..."?a+='<button class="join-item btn btn-sm btn-disabled">...</button>':a+=`
        <button class="join-item btn btn-sm ${o===r?"bg-red-500 text-white border-none hover:bg-red-600":"btn-ghost"}" 
                data-pagina="${o}">${o}</button>
      `}),a+=`
    <button class="join-item btn btn-sm ${r===t?"btn-disabled":"btn-ghost"}" 
            data-pagina="${r+1}" ${r===t?"disabled":""}>»</button>
  `,a}function j(){const t=parseInt(n(this).data("pagina"));t&&t!==r&&(r=t,f(),m(),n("html, body").animate({scrollTop:n("#tabela-transacoes").offset().top-100},300))}function m(){const t=Math.ceil(c.length/u),a=n("#paginacao"),e=n("#info-total"),o=(r-1)*u+1,s=Math.min(r*u,c.length);if(c.length>0?e.text(`Mostrando ${o}-${s} de ${c.length} transações`):e.text(""),t<=1){a.empty();return}a.html(L(t)),a.find("button:not(.btn-disabled)").on("click",j)}function b(){const t=n("#filtro-busca").val().toLowerCase().trim(),a=n("#filtro-tipo").val(),e=n("#filtro-periodo").val(),o=t||a||e;n("#btn-limpar-filtros").toggleClass("hidden",!o),c=d.filter(s=>!(t&&!s.descricao.toLowerCase().includes(t)||a&&s.tipo!==a||e&&!E(s.data,e))),r=1,f(),m()}function F(){n("#filtro-busca").val(""),n("#filtro-tipo").val(""),n("#filtro-periodo").val(""),n("#btn-limpar-filtros").addClass("hidden"),c=[...d],r=1,f(),m()}async function V(t){try{d=(await n.ajax({url:`${$}/transacoes`,method:"GET",dataType:"json"})).filter(e=>Number(e.usuarioId)===Number(t)).sort((e,o)=>new Date(o.data)-new Date(e.data)),c=[...d],r=1,f(),m()}catch(a){console.error("Erro ao carregar transações:",a),k()}}async function N(t){try{await n.ajax({url:`${$}/transacoes/${t}`,method:"DELETE"}),d=d.filter(e=>e.id!==t),c=c.filter(e=>e.id!==t);const a=Math.ceil(c.length/u);r>a&&a>0&&(r=a),f(),m(),x("Transação excluída com sucesso!","success")}catch(a){console.error("Erro ao excluir transação:",a),x("Erro ao excluir transação. Tente novamente.","error")}}function I(t){const a=d.find(o=>o.id===t);if(!a)return;confirm(`Deseja realmente excluir a transação "${a.descricao}"?`)&&N(t)}function U(){const t=n(this).data("id");I(t)}function R(t){t.preventDefault()}function B(){n("#filtro-busca").on("input",M(b,300)),n("#filtro-tipo").on("change",b),n("#filtro-periodo").on("change",b),n("#btn-limpar-filtros").on("click",F),n("#form-filtros").on("submit",R),n("#tabela-transacoes").on("click",".btn-excluir",U),h.configurarLogout()}function H(){const t=v.verificarAutenticacao(!0);t&&(h.atualizarUIUsuario(t),V(t.id),B())}n(document).ready(H);
