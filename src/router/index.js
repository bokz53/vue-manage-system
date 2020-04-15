import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    // 企业管理
                    path: '/companyMgt',
                    component: () => import(/* webpackChunkName: "companyMgt" */ '../components/page/eess/CompanyMgt.vue'),
                    meta: { title: '企业管理' }
                },
                {
                    // 自定义权重
                    path: '/customWeight',
                    component: () => import(/* webpackChunkName: "customWeight" */ '../components/page/eess/CustomWeightMgt.vue'),
                    meta: { title: '自定义权重' }
                },
                {
                    // 指标展览
                    path: '/indexDisplay',
                    component: () => import(/* webpackChunkName: "indexDisplay" */ '../components/page/eess/IndexDisplay.vue'),
                    meta: { title: '指标展览' }
                },
                {
                    // 原始数据管理
                    path: '/rawDataMgt',
                    component: () => import(/* webpackChunkName: "rawDataMgt" */ '../components/page/eess/RawDataMgt.vue'),
                    meta: { title: '指标展览' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
