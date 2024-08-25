import { resolve } from 'path'
import VersionGitPlugin from 'vite-plugin-git-version'
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'v-x',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [], // 在这里列出外部依赖
      output: {
        preserveModules: true,
        exports: 'named'
      }
    },
  },
  plugins: [
    VersionGitPlugin()
  ],
})