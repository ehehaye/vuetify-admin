import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import vuetify from 'vite-plugin-vuetify';
import path from 'node:path';
import eslint from 'vite-plugin-eslint';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const isProd = mode === 'production';

  return {
    plugins: [
      {
        name: 'md-icon-inject',
        transformIndexHtml(html) {
          return html.replace(
            /<link rel="stylesheet" href="md-icons-to-be-replaced">/,
            `<link rel="stylesheet" href="${process.env.VITE_MD_ICON_HREF}">`,
          );
        },
      },
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './auto-imports.d.ts',
      }),
      eslint({
        cache: false,
        exclude: ['**/node_modules/**', '**/dist/**'],
      }),
      vue(),
      vueJsx(),
      vuetify(),
      Components({
        globs: ['src/components/**/index.vue'],
        dts: './types/components.d.ts',
        extensions: ['vue', 'tsx'],
      }),
      codeInspectorPlugin({
        bundler: 'vite',
      }),
      ...(isProd
        ? [
            viteCompression(),
            visualizer({
              template: 'treemap', // or sunburst
              open: false,
              gzipSize: true,
              brotliSize: true,
              filename: 'bundle-analyze.html',
            }),
          ]
        : []),
    ],
    optimizeDeps: {
      include: ['vue', 'pinia', 'axios-mock-adapter', 'radash', 'vue-router'],
      // https://stackoverflow.com/questions/75469067/vite-cypress-how-to-prevent-reloading-due-to-optimized-dependencies-causin
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue'],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, '/src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // https://vuetifyjs.com/zh-Hans/features/sass-variables/#section-67845efa602780fd
          api: 'modern-compiler',
        },
      },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const libs = ['axios', 'vuetify'];
            for (const lib of libs) {
              if (id.includes(`node_modules/${lib}/`)) {
                return lib;
              }
            }
          },
        },
      },
    },
  } as UserConfig;
});
