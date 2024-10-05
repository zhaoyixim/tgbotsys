import { http } from '@/utils/http/axios';

/**
 * @description: 删除图片
 */
export function deleImg(params) {
  return http.request({
    url: '/deleteImg',
    method: 'post',
    params
  });
}


/**
 * @description: 获得图片
 */
export function getImgs(params) {
  return http.request({
    url: '/sysgetImages',
    method: 'get',
    params
  });
}


/**
 * @description: 更新客服信息
 */
export function updateKefuImgs(params) {
  return http.request({
    url: '/upload/upKefuData',
    method: 'Post',
    params
  });
}

