import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { OptionsSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

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
    path: '/webconfig',
    name: 'webconfig',
    redirect: '/webconfig/index',
    component: Layout,
    meta: {
      title: '系统设置',
      icon: renderIcon(OptionsSharp),
      sort: 1,
    },
    children: [
      {
        path: 'wconfig',
        name: 'wconfig',
        meta: {
          title: 'web配置',
        },
        component: () => import('@/views/configs/index.vue'),
      },
      {
        path: 'baseSetting',
        name: 'baseSetting',
        meta: {
          title: '基础设置',
        },
        component: () => import('@/views/configs/baseset/setting.vue'),
      },
      
      {
        path: 'payin',
        name: 'payin',
        meta: {
          title: '收款设置',
        },
        component: () => import('@/views/vtemplate/payin.vue'),
      },
      {
        path: 'botsetting',
        name: 'botsetting',
        meta: {
          title: '机器人设置',
        },
        component: () => import('@/views/vtemplate/botsetting.vue'),
      }

      // {
      //   path: 'merconfig',
      //   name: 'merconfig',
      //   meta: {
      //     title: '商家设置',
      //   },
      //   component: () => import('@/views/configs/merIndex.vue'),
      // }
    ],
  },
];

export default routes;
