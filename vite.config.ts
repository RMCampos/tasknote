import { ConfigEnv, defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }: ConfigEnv) => {
  const config: UserConfig = {
    define: {} as any,
    plugins: [
      react(),
      {
        name: 'build-html',
        apply: 'build',
        transformIndexHtml: (html) => {
          return {
            html,
            tags: [
              {
                tag: 'script',
                attrs: {
                  src: '/env.js'
                },
                injectTo: 'head'
              }
            ]
          }
        }
      }
    ],
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    server: {
      port: 5000
    },
    preview: {
      port: 5000
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };

  if (mode === 'development') {
    if (config.define) {
      config.define.global = {};
    }
  }

  return config;
});
