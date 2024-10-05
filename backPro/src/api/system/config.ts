import { http } from '@/utils/http/axios';

/**
 * @description: 配置列表
 */
export function getWebConfigList(params) {
  return http.request({
    url: '/sysgetwebconfig',
    method: 'POST',
    params
  });
}

/**
 * @description: 配置列表
 */
export function addWebConfig(params) {
    return http.request({
      url: '/sysaddwebconfig',
      method: 'POST',
      params
    });
 }
/**
 * @description: 配置启用 禁用更新
 */
export function updateWebConfigOpen(params) {
  return http.request({
    url: '/updatewebconfigopen',
    method: 'POST',
    params
  });
}
export function updateWebConfigClose(params) {
  return http.request({
    url: '/updatewebconfigclose',
    method: 'POST',
    params
  });
}



/**
 * @description: 配置启用 禁用更新
 */
export function deletewebconfig(params) {
  return http.request({
    url: '/sys/deletewebconfig',
    method: 'POST',
    params
  });
}
/**
 * @description: 初始化配置
 */
export function initWebconfig() {
  return http.request({
    url: '/sys/initwebconfig',
    method: 'POST',    
  });
}

/**
 * @description: 清空配置
 */
export function clearWebconfig() {
  return http.request({
    url: '/sys/clearwebconfig',
    method: 'POST',    
  });
}


/**
 * @description: 更新配置
 */
export function updateconfig(params) {
  return http.request({
    url: '/updatesysconfig',
    method: 'POST',
    params    
  });
}


