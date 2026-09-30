import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

// Configuración de ESLint (ESM).
// Solo usa paquetes ya presentes en package.json (sin plugins nuevos).
export default [
  // Excluye dependencias y logs generados.
  { ignores: ['node_modules/**', 'logs/**'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2024 },
    },
    rules: {
      // Todo log pasa por logger (nunca console.* en src ni scripts).
      'no-console': 'error',
      // Prohíbe eval implícito (seguridad).
      'no-implied-eval': 'error',
      // Convención camelCase del proyecto (propiedades de objeto excluidas).
      camelcase: ['error', { properties: 'never' }],
      // Permite parámetros con prefijo _ (ej. _req, _res, _next).
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Desactiva reglas de estilo que chocan con Prettier (siempre al final).
  prettierConfig,
];
