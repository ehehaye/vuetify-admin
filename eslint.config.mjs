import pluginVue from "eslint-plugin-vue";
import importPlugin from "eslint-plugin-import";
import { includeIgnoreFile } from "@eslint/compat";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath),
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      "import/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: __dirname,
        }),
      ],
    },
  },
  ...vueTsEslintConfig(),
  ...pluginVue.configs["flat/essential"],
  prettierConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    rules: {
      "import/namespace": "off",
      "no-console": "warn",
      "no-debugger": "off",
      "no-unused-vars": "off",
      // https://www.npmjs.com/package/unplugin-auto-import#eslint
      "no-undef": "off",
      "prettier/prettier": [
        "warn",
        {
          singleQuote: true,
        },
      ],
      "vue/multi-word-component-names": "off",
      "vue/valid-v-slot": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          directory: ".types/index.d.ts",
        },
      },
    },
  },
];
