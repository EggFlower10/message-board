import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入 Vant 按需引入插件
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    // 配置 Vant 按需引入
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  // 配置开发服务器（解决跨域，后续对接后端用）
  server: {
    port: 3000, // 前端运行端口
    open: true, // 启动后自动打开浏览器
    proxy: {
      // 代理后端接口，避免跨域
      '/api': {
        target: 'http://localhost:9980', // 后端 Egg.js 端口（作业要求 9980/9981）
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})