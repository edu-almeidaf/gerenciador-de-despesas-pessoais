/**
 * Módulo de Validação com Regex
 * Validações para formulários de autenticação
 */

const Validacao = {
  // Regex patterns
  patterns: {
    // Email: padrão RFC 5322 simplificado
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

    // Nome: letras (incluindo acentos), espaços e hífens
    nome: /^[a-zA-ZÀ-ÿ]+([\s'-][a-zA-ZÀ-ÿ]+)*$/
  },

  /**
   * Valida um email
   * @param {string} email
   * @returns {Object} { valido: boolean, mensagem: string }
   */
  validarEmail: function(email) {
    if (!email || email.trim() === '') {
      return { valido: false, mensagem: 'O e-mail é obrigatório' };
    }

    email = email.trim().toLowerCase();

    if (email.length > 254) {
      return { valido: false, mensagem: 'O e-mail é muito longo' };
    }

    if (!this.patterns.email.test(email)) {
      return { valido: false, mensagem: 'Digite um e-mail válido (ex: usuario@email.com)' };
    }

    // Verifica domínio
    const partes = email.split('@');
    if (partes[1] && !partes[1].includes('.')) {
      return { valido: false, mensagem: 'O domínio do e-mail parece inválido' };
    }

    return { valido: true, mensagem: '' };
  },

  /**
   * Valida um nome completo
   * @param {string} nome
   * @returns {Object} { valido: boolean, mensagem: string }
   */
  validarNome: function(nome) {
    if (!nome || nome.trim() === '') {
      return { valido: false, mensagem: 'O nome é obrigatório' };
    }

    nome = nome.trim();

    if (nome.length < 3) {
      return { valido: false, mensagem: 'O nome deve ter pelo menos 3 caracteres' };
    }

    if (nome.length > 100) {
      return { valido: false, mensagem: 'O nome é muito longo' };
    }

    if (!this.patterns.nome.test(nome)) {
      return { valido: false, mensagem: 'O nome deve conter apenas letras e espaços' };
    }

    // Verifica se tem pelo menos nome e sobrenome
    const palavras = nome.split(/\s+/).filter(p => p.length > 0);
    if (palavras.length < 2) {
      return { valido: false, mensagem: 'Digite seu nome completo (nome e sobrenome)' };
    }

    return { valido: true, mensagem: '' };
  },

  /**
   * Valida uma senha com diferentes níveis de força
   * @param {string} senha
   * @param {string} nivel - 'basico', 'medio', 'forte'
   * @returns {Object} { valido: boolean, mensagem: string, forca: number }
   */
  validarSenha: function(senha, nivel = 'medio') {
    if (!senha) {
      return { valido: false, mensagem: 'A senha é obrigatória', forca: 0 };
    }

    // Calcula força da senha
    let forca = 0;
    const feedback = [];

    // Comprimento
    if (senha.length >= 6) forca += 1;
    if (senha.length >= 8) forca += 1;
    if (senha.length >= 12) forca += 1;

    // Complexidade
    if (/[a-z]/.test(senha)) forca += 1;
    if (/[A-Z]/.test(senha)) forca += 1;
    if (/[0-9]/.test(senha)) forca += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha)) forca += 1;

    // Validação por nível
    if (nivel === 'basico') {
      if (senha.length < 6) {
        return { valido: false, mensagem: 'A senha deve ter pelo menos 6 caracteres', forca };
      }
    } else if (nivel === 'medio') {
      if (senha.length < 6) {
        feedback.push('pelo menos 6 caracteres');
      }
      if (!/[a-zA-Z]/.test(senha)) {
        feedback.push('pelo menos uma letra');
      }
      if (!/[0-9]/.test(senha)) {
        feedback.push('pelo menos um número');
      }

      if (feedback.length > 0) {
        return {
          valido: false,
          mensagem: `A senha deve conter: ${feedback.join(', ')}`,
          forca
        };
      }
    } else if (nivel === 'forte') {
      if (senha.length < 8) {
        feedback.push('pelo menos 8 caracteres');
      }
      if (!/[a-z]/.test(senha)) {
        feedback.push('uma letra minúscula');
      }
      if (!/[A-Z]/.test(senha)) {
        feedback.push('uma letra maiúscula');
      }
      if (!/[0-9]/.test(senha)) {
        feedback.push('um número');
      }
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha)) {
        feedback.push('um caractere especial (!@#$%...)');
      }

      if (feedback.length > 0) {
        return {
          valido: false,
          mensagem: `A senha deve conter: ${feedback.join(', ')}`,
          forca
        };
      }
    }

    return { valido: true, mensagem: '', forca };
  },

  /**
   * Valida confirmação de senha
   * @param {string} senha
   * @param {string} confirmacao
   * @returns {Object} { valido: boolean, mensagem: string }
   */
  validarConfirmacaoSenha: function(senha, confirmacao) {
    if (!confirmacao) {
      return { valido: false, mensagem: 'Confirme sua senha' };
    }

    if (senha !== confirmacao) {
      return { valido: false, mensagem: 'As senhas não coincidem' };
    }

    return { valido: true, mensagem: '' };
  },

  /**
   * Calcula e retorna informações sobre a força da senha
   * @param {string} senha
   * @returns {Object} { nivel: string, porcentagem: number, cor: string }
   */
  getForcaSenha: function(senha) {
    if (!senha || senha.length === 0) {
      return { nivel: '', porcentagem: 0, cor: '' };
    }

    let pontos = 0;

    // Comprimento
    if (senha.length >= 6) pontos += 1;
    if (senha.length >= 8) pontos += 1;
    if (senha.length >= 10) pontos += 1;
    if (senha.length >= 12) pontos += 1;

    // Tipos de caracteres
    if (/[a-z]/.test(senha)) pontos += 1;
    if (/[A-Z]/.test(senha)) pontos += 1;
    if (/[0-9]/.test(senha)) pontos += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha)) pontos += 2;

    // Penalidades
    if (/^[a-zA-Z]+$/.test(senha)) pontos -= 1; // Só letras
    if (/^[0-9]+$/.test(senha)) pontos -= 2; // Só números
    if (/(.)\1{2,}/.test(senha)) pontos -= 1; // Caracteres repetidos

    // Normaliza para porcentagem
    const maxPontos = 10;
    const porcentagem = Math.max(0, Math.min(100, (pontos / maxPontos) * 100));

    // Determina nível e cor
    let nivel, cor;
    if (porcentagem < 33) {
      nivel = 'Fraca';
      cor = 'error';
    } else if (porcentagem < 66) {
      nivel = 'Média';
      cor = 'warning';
    } else {
      nivel = 'Forte';
      cor = 'success';
    }

    return { nivel, porcentagem, cor };
  }
};

export { Validacao };

