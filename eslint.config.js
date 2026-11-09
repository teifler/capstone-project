import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  { ignores: ['dist', 'coverage', 'storybook-static'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
  },
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      // Function components ignore propTypes from React 19 on.
      'react/prop-types': 'off',
      // role="list" is kept on purpose: Safari/VoiceOver drops list
      // semantics from lists styled with list-style: none.
      'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'] }],
    },
  },
  {
    files: ['*.config.js', '.storybook/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
