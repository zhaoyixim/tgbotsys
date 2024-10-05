import { http } from '@/utils/http/axios';

//获取table
export function getTableList(params) {
  return http.request({
    url: '/userlist',
    method: 'post',
    params,
  });
}

export function blockUser(params) {
    return http.request({
      url: '/user/setblackname',
      method: 'post',
      params,
    });
}


export function editTableItem(params) {
  return http.request({
    url: '/user/editUinqueKey',
    method: 'post',
    params,
  });
}
export function sureMechId(params) {
  return http.request({
    url: '/usersuremech',
    method: 'post',
    params,
  });
}




  

export function getWalletLists(params) {
  return http.request({
    url: '/getwalletlists',
    method: 'post',
    params,
  });
}
export function createWalletandMech(params) {
  return http.request({
    url: '/createwalletandmech',
    method: 'post',
    params,
  });
}
export function forbidWalletAndMech(params) {
  return http.request({
    url: '/forbidwallet',
    method: 'post',
    params,
  });
}

