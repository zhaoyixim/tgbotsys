import { http } from '@/utils/http/axios';
/**
 * 出价列表 */
export function getBidTableList(params) {
    return http.request({
      url: '/gamegetLists',
      method: 'post',
      params,
    });
  }
  /**修改出价参数 */
  export function updataBidData(params) {
    return http.request({
      url: '/trademanager/updatabid',
      method: 'post',
      params,
    });
  }
export function getGameItemList(params) {
    return http.request({
      url: '/gameitemlists',
      method: 'post',
      params,
    });
  }
export function getItemMatchUidList(params) {
    return http.request({
      url: '/getmatchitems',
      method: 'post',
      params,
    });
  }


export function updateClassOpen(params) {
    return http.request({
      url: '/matchupdateopen',
      method: 'post',
      params,
    });
  }
  export function updateClassClose(params) {
      return http.request({
        url: '/matchupdateclose',
        method: 'post',
        params,
      });
    }
  //bot
  
  
  export function getBotSettingList(params) {
      return http.request({
        url: '/getbotsettings',
        method: 'post',
        params,
      });
    }
    
    export function updateBotSetting(params) {
        return http.request({
          url: '/openorclosebotset',
          method: 'post',
          params,
        });
      }
  export function deleteClassItem(params) {
      return http.request({
        url: '/deleteclassitem',
        method: 'post',
        params,
      });
    }
        
      