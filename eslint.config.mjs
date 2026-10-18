import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import importPlugin from 'eslint-plugin-import-x';
import { includeIgnoreFile } from '@eslint/compat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import prettierConfig from '@vue/eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

export default [
  includeIgnoreFile(gitignorePath),
  { ignores: ['dist/**', 'node_modules/**', 'bundle-analyze.html'] },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: tsconfigPath,
          extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json'],
        },
        node: {
          extensions: ['.js', '.ts', '.vue', '.json'],
        },
      },
      'import-x/extensions': ['.js', '.ts', '.vue', '.json'],
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: tsconfigPath,
        }),
      ],
    },
  },
  ...vueTsEslintConfig(),
  ...pluginVue.configs['flat/essential'],
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      'import-x/namespace': 'off',
      'import-x/no-unresolved': ['error', { ignore: ['\\?worker$'] }],
      // .vue 文件的默认导出由 Vue 编译器保证，import 插件无法可靠解析
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'no-console': 'warn',
      'no-debugger': 'off',
      'no-unused-vars': 'off',
      // unplugin-auto-import 注入的 API 不会被 ESLint 识别
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/valid-v-slot': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
