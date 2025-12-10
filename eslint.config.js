import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
      }
    },
    rules: {
      // Regras de qualidade de código
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',

      // Regras de estilo
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { 'avoidEscape': true }],
      'indent': ['warn', 2],
      'comma-dangle': ['warn', 'only-multiline'],
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always'],

      // Boas práticas
      'eqeqeq': ['warn', 'smart'],
      'curly': ['warn', 'multi-line'],
      'no-var': 'error',
      'prefer-const': 'warn',
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.min.js'
    ]
  }
];

