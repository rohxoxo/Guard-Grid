import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-console': 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'prettier/prettier': 'error'
    }
  },
  {
    ignores: [
      'dist/',
      'commitlint.config.js'
      // add more patterns as needed
    ]
  }
]
