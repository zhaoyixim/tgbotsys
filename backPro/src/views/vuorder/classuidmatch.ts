import { h } from 'vue';

export const columns = [
  {
    title: '类别ID',
    key: 'item_id',
    width: 50,
  },
  {
    title: '商户UID',
    key: 'cuid',
    width: 50,   
  },
  {
    title: '可创建的卡槽',
    key: 'card_N',
    width: 50,   
  },
  {
    title: '剩余卡槽',
    key: 'remain_N',
    width: 150,   
  },
  {
    title: '模式',
    key: 'is_limit_N',
    width: 80,   
  },
 
  {
    title: '启用',
    key: 'sta',
    width: 50,
    render(row) {
       if(row.sta == 1) {         
        return "正常"
       }else{
         return "禁用"
       }
    },    
  }  
];
