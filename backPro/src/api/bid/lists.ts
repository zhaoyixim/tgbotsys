import { http } from '@/utils/http/axios';
/**
 * 出价列表 */
export function getBidTableList(params) {
    return http.request({
      url: 'bidgetLists',
      method: 'post',
      params,
    });
}

/**修改出价参数 */
export function updataBidData(params) {
    return http.request({
      url: '/bidmanager/updatabid',
      method: 'post',
      params,
    });
}

/**强制完成 */
export function forceFinished(params) {
  return http.request({
    url: '/bidmanager/forcesure',
    method: 'post',
    params,
  });
}

export function getmessageLists(params){
  return http.request({
    url: '/trademanager/sigleNeedList',
    method: 'post',
    params,
  });
}
export function getAllMessageList(params){
  return http.request({
    url: '/trademanager/getMessageList',
    method: 'post',
    params,
  });
}
