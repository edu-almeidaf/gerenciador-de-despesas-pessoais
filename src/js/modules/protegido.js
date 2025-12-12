import $ from 'jquery';
import { Auth } from '../core/auth.js';
import { Usuario } from './usuario.js';

/**
 * Inicializa a página protegida
 * Verifica autenticação e atualiza elementos comuns
 * @returns {Object|null} - Dados do usuário ou null se não autenticado
 */
function init() {
  const usuario = Auth.verificarAutenticacao(true);

  if (!usuario) return null;

  Usuario.atualizarUIUsuario(usuario);
  Usuario.configurarLogout();

  return usuario;
}

/**
 * Módulo para páginas protegidas
 * Gerencia autenticação e elementos comuns de UI
 */
export const Protegido = {
  init
};

$(document).ready(init);

