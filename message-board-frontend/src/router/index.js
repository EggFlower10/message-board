import { createRouter, createWebHistory } from 'vue-router'
// 引入页面组件（后续创建）
import Index from '../pages/Index.vue'
import PcGuide from '../pages/PcGuide.vue'

const routes = [
    {
        path: '/',
        redirect: '/index' // 默认跳转到首页
    },
    {
        path: '/index',
        name: 'Index',
        component: Index // 留言板首页
    },
    {
        path: '/pc-guide',
        name: 'PcGuide',
        component: PcGuide // PC 端引导页
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router