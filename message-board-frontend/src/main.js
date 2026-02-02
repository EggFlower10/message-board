import { createApp } from 'vue'
import App from './App.vue'
// 引入移动端适配核心代码
import 'amfe-flexible'
import router from './router'
import './assets/css/global.css'
// 引入 IconFont 样式
import './assets/iconfont/iconfont.css'
// 创建 Vue 实例并挂载
const app = createApp(App)
app.use(router) // 注册路由
app.mount('#app')