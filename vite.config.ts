import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import vuetify from 'vite-plugin-vuetify';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import tailwindcss from '@tailwindcss/vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './types/auto-imports.d.ts',
      }),
      vue(),
      vuetify({
        autoImport: { labs: true },
        styles: { configFile: 'src/plugins/vuetify/settings.scss' },
      }),
      tailwindcss(),
      Components({
        globs: ['src/components/**/index.vue'],
        dts: './types/components.d.ts',
        extensions: ['vue'],
      }),
      ...(!isProd
        ? [
            codeInspectorPlugin({
              bundler: 'vite',
            }),
          ]
        : []),
      ...(isProd
        ? [
            viteCompression(),
            visualizer({
              template: 'treemap',
              open: false,
              gzipSize: true,
              brotliSize: true,
              filename: 'bundle-analyze.html',
            }),
          ]
        : []),
    ],
    optimizeDeps: {
      entries: ['./src/**/*.{vue,ts}'],
      // vite-plugin-vuetify 注入的是 `vuetify/components/XXX` 深层导入，
      // 依赖扫描器看不到这些注入代码，首次访问新页面时会触发重新预构建并报 504。
      include: ['vuetify/components/*', 'vuetify/directives'],
    },
    resolve: {
      mainFields: ['module', 'browser', 'jsnext:main', 'jsnext'],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vue',
                test: /node_modules[\\/](vue|vue-router|pinia)[\\/]/,
              },
              { name: 'axios', test: /node_modules[\\/]axios[\\/]/ },
            ],
          },
        },
      },
    },
  };
});
