import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { renderIcon } from '@/utils/index';
import { DocumentTextOutline } from '@vicons/ionicons5';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/vfund',
    name: 'vfund',
    redirect: '/vfund/vdeposits',
    component: Layout,
    meta: {
      title: '付款和提现',
      icon: renderIcon(DocumentTextOutline),
      sort: 3,
    },
    children: [      
      {
        path: 'vdeposits',
        name: 'vdeposits',
        meta: {
          title: '付款订单',
        },
        component: () => import('@/views/vtemplate/vdeposits.vue'),
      },
     
      {
        path: 'vwithdraw',
        name: 'vwithdraw',
        meta: {
          title: '提现记录',
        },
        component: () => import('@/views/vtemplate/vwithdraw.vue'),
      },
      {
        path: 'vorder-list',
        name: 'vorder-list',
        meta: {
          title: '中奖记录',
        },
        component: () => import('@/views/vtemplate/vorder.vue'),
      },     
    ],
  },
];

export default routes;
