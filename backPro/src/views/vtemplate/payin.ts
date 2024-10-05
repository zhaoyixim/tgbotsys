import { NAvatar } from 'naive-ui';
import { h } from 'vue';
export const columns = [ 
  {
    title: '收款钱包地址',
    key: 'token',
    width: 200,
  },
  {
    title: '商户ID',
    key: 'mech_id',
    width: 100,
    render(row) {
       if(row.mech_id == 0) return "系统身份";
    },
  }, 
 
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      if(row.status == 1) return "启用";
      else if(row.status == 2) return "禁用";
   },
  }  
];
