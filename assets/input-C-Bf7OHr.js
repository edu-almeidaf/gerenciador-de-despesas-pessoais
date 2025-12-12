import{$ as o}from"./auth-Dh7lbV3Z.js";function d(s,n){o(`#${s}`).removeClass("hidden alert-success").addClass("alert-error").html(`
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${n}</span>
    `).hide().fadeIn(300)}function u(s,n){o(`#${s}`).removeClass("hidden alert-error").addClass("alert-success").html(`
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${n}</span>
    `).hide().fadeIn(300)}function f(s){o(`#${s}`).addClass("hidden").empty()}const w={erro:d,sucesso:u,limpar:f};function m(s,n){s.data("texto-original",n).prop("disabled",!0).html(`
      <span class="loading loading-spinner loading-sm"></span>
      Aguarde...
    `)}function h(s){const n=s.data("texto-original")||"Enviar";s.prop("disabled",!1).html(n)}const C={loading:m,restaurar:h};function l(s,n){const r=s.attr("id");let t=o(`#${r}-erro`);t.length||(t=o(`<span id="${r}-erro" class="text-xs text-red-500 mt-1"></span>`),s.closest(".form-control").append(t)),t.text(n).removeClass("hidden"),s.addClass("input-error").removeClass("input-success")}function e(s){const n=s.attr("id");o(`#${n}-erro`).addClass("hidden"),s.removeClass("input-error")}function c(s){e(s),s.addClass("input-success")}function p(s,n,r,t){s.on("blur",function(){const a=o(this).val();if(a.length>0){const i=n(a);i.valido?(c(o(this)),r[t]=!0):(l(o(this),i.mensagem),r[t]=!1)}}),s.on("input",function(){e(o(this))})}function g(s){o(s).on("focus",function(){o(this).closest(".form-control").addClass("scale-[1.01]")}).on("blur",function(){o(this).closest(".form-control").removeClass("scale-[1.01]")})}const x={mostrarErro:l,limparErro:e,marcarValido:c,configurarValidacao:p,configurarEfeitoFoco:g};export{C as B,w as F,x as I};
