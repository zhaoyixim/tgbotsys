import { http } from '@/utils/http/axios';

/**网络验证 */

export function checkNetVerify(params) {
  return http.request({
    url: '/table/netverify',
    method: 'post',
    params,
  });
}

/**网络验证 */

export function checkWalletVerify(params) {
  return http.request({
    url: '/table/walletverify',
    method: 'post',
    params,
  });
}

/**
 * 充值部分 */
export function getDepostTableList(params) {
  return http.request({
    url: '/depositList',
    method: 'post',
    params,
  });
}
/**更改编辑状态和数据 */
export function changeEditData(params){
  return http.request({
    url:"/table/depositEdit",
    method: 'post',
    params,
  })
}
/**
 * 交换部分 */

//获取table
export function getExchangeTableList(params) {
  return http.request({
    url: '/table/exchangeList',
    method: 'post',
    params,
  });
}
/**更改编辑状态和数据 */
export function exchangeEditData(params){
  return http.request({
    url:"/table/exchangeEdit",
    method: 'post',
    params,
  })
}
/**
 * 资产记录部分 */

//获取table
export function getFundTableList(params) {
  return http.request({
    url: '/table/fundList',
    method: 'post',
    params,
  });
}

/**
 * 订单部分 */

//获取table
export function getOrderTableList(params) {
  return http.request({
    url: '/torderList',
    method: 'post',
    params,
  });
}

/**提现部分 */
export function getWithdrawableList(params) {
  return http.request({
    url: '/tablewithdrawList',
    method: 'post',
    params,
  });
}

export function sureWithDraw(params) {
  return http.request({
    url: '/sureWithDraw',
    method: 'post',
    params,
  });
}


export function addItemData(params) {
  return http.request({
    url: '/additemdata',
    method: 'post',
    params,
  });
}
export function addItemMatchData(params) {
  return http.request({
    url: '/additemmatchdata',
    method: 'post',
    params,
  });
}

export function editItemMatchData(params) {
  return http.request({
    url: '/edititemmatchdata',
    method: 'post',
    params,
  });
}

export function addBotSetting(params) {
  return http.request({
    url: '/addbotsetting',
    method: 'post',
    params,
  });
}
export function editBotSetting(params) {
  return http.request({
    url: '/editbotsetting',
    method: 'post',
    params,
  });
}

export function editItemData(params) {
  return http.request({
    url: '/editclassitem',
    method: 'post',
    params,
  });
}