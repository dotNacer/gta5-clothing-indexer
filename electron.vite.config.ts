import { defineConfig } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [svelte(), tailwindcss()],
    resolve: {
      alias: {
        $lib: resolve('src/renderer/src/lib')
      }
    }
  }
})
