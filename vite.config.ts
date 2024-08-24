import { ConfigEnv, defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }: ConfigEnv) => {
  const config: UserConfig = {
    define: {} as any,
    plugins: [react()],
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
