import { NAvatar } from 'naive-ui';
import { h } from 'vue';
export const columns = [ 
  {
    title: '用户ID',
    key: 'id',
    width: 100,
  },
  {
    title: '用户名称',
    key: 'cuname',
    width: 100,
  }, 
  {
    title: '总U值',
    key: 'total_U',   
    width: 200,    
  },
  {
    title: '额外的U值',
    key: 'extra_U',  
    width: 200,   
  },
  {
    title: '角色',
    key: 'is_mech',
    width: 100,
    render(row) {
      if(row.is_mech == 0) return "普通";
      else if(row.is_mech == 1) return "商";
   },
  },
  
  {
    title: '登录次数',
    key: 'login_times',
    width: 80,
  }, 
  {
    title: '登录IP',
    key: 'ips',
    width: 100,
  }, 
   {
    title: '地址',
    key: 'wallet_address',
    width: 100,    
  }, 
  
  {
    title: '头像',
    key: 'avatar',
    width: 100,
    render(row) {
      if(row.avatar){
        return h(NAvatar, {
          size: 48,
          src: row.avatar,
        });
      }else{
        return "";
      }
    
    },
   }, 
  {
    title: '登录时间',
    key: 'update_at',
    width: 120,
  },  
  {
    title: '创建时间',
    key: 'create_at',
    width: 120,
  },
];
