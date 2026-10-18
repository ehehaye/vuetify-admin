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
      vuetify({ autoImport: { labs: true } }),
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
    },
    resolve: {
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
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/vuetify/')) return 'vuetify';
            if (
              id.includes('node_modules/vue/') ||
              id.includes('node_modules/vue-router/') ||
              id.includes('node_modules/pinia/')
            ) {
              return 'vue';
            }
            if (id.includes('node_modules/axios/')) return 'axios';
          },
        },
      },
    },
  };
});
