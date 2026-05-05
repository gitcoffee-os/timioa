/**
 * Copyright (c) 2025-2099 GitCoffee All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isFastBuild = mode === 'fast';

  return {
    base: '/oa/',
    plugins: [vue()],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
        '~/*': resolve(__dirname, 'src/*'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      minify: isFastBuild ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      reportCompressedSize: true,
      cacheDir: './node_modules/.vite-cache',
      sourcemap: !isFastBuild,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },

        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          format: 'es',
          inlineDynamicImports: false,
          manualChunks: isFastBuild
            ? undefined
            : {
                vendor: ['vue', 'vue-router', 'pinia', 'ant-design-vue'],
                i18n: ['vue-i18n'],
                ui: ['@gitcoffee/timioa-ui'],
                utils: ['@gitcoffee/timioa-utils'],
                charts: ['echarts', 'vue-echarts'],
                calendar: ['@fullcalendar/core', '@fullcalendar/vue3', '@fullcalendar/daygrid', '@fullcalendar/timegrid']
              }
        }
      },
      assetsDir: 'assets'
    },
    server: {
      port: 5174,
      open: false,
      fs: {
        strict: false
      },
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**']
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/timioa/api')
        }
      }
    }
  };
});
