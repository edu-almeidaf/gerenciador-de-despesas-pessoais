import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/gerenciador-de-despesas-pessoais/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        adicionarTransacao: resolve(__dirname, 'adicionar-transacao.html'),
        todasTransacoes: resolve(__dirname, 'todas-transacoes.html'),
      },
    },
  },
})