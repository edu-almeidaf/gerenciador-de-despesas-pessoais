import{$ as e}from"./auth-Dh7lbV3Z.js";function o(n,s){e(`#${n}`).removeClass("hidden alert-success").addClass("alert-error").html(`
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${s}</span>
    `).hide().fadeIn(300)}function r(n,s){e(`#${n}`).removeClass("hidden alert-error").addClass("alert-success").html(`
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${s}</span>
    `).hide().fadeIn(300)}function t(n){e(`#${n}`).addClass("hidden").empty()}const c={erro:o,sucesso:r,limpar:t};function i(n,s){n.data("texto-original",s).prop("disabled",!0).html(`
      <span class="loading loading-spinner loading-sm"></span>
      Aguarde...
    `)}function l(n){const s=n.data("texto-original")||"Enviar";n.prop("disabled",!1).html(s)}const p={loading:i,restaurar:l};export{p as B,c as F};
