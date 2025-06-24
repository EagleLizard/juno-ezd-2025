import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import svelteEslint from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  pluginJs.configs.recommended,
  tsEslint.configs.recommended,
  svelteEslint.configs.recommended,
  {
    files: [
      '**/*.js',
      '**/*.svelte',
      '**/*.svelte.ts',
      '**/*.svelte.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      /*
        Following eslint-plugin-svelte README,
          see: https://github.com/sveltejs/eslint-plugin-svelte/blob/a0f5c172131200be0b9689d0001a73e88ef822eb/README.md?plain=1#L131
      _*/
      parserOptions: {
        projectService: true,
        extraFileExtensions: [ '.svelte' ],
        parser: tsEslint.parser,
        svelteConfig,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      indent: [
        'error',
        2,
        {
          'MemberExpression': 1,
          'SwitchCase': 1
        }
      ],
      semi: 'error',
      eqeqeq: [ 'error', 'always' ],
      // quotes: [ 'error', 'single' ],
      'no-octal': [ 'off' ],
      'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxBOF': 1 }],
      // 'no-unused-vars': [ 'warn' ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always', {
        objectsInArrays: false,
        arraysInArrays: false,
      }],
      '@stylistic/eol-last': [ 'error', 'always' ],
      '@stylistic/no-trailing-spaces': [ 'error' ],
      '@stylistic/max-len': [ 'warn', {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        // ignoreComments: true,
      }],
      '@stylistic/quotes': [ 'error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: 'avoidEscape',
      }],
      // '@stylistic/semi-spacing': [ 'error', { before: false }],
      /* TS */
      'prefer-const': [ 'off' ],
      'no-unused-vars': [ 'off' ],
      '@typescript-eslint/no-this-alias': [ 'warn' ],
      '@typescript-eslint/no-unused-vars': [ 'warn' ],
      /* React */
      // 'react/react-in-jsx-scope': [ 'off' ],
    },
  },
];

const tsConfig = tsEslint.config(config);

export default tsConfig;
