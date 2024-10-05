import { h } from 'vue';
import { NAvatar } from 'naive-ui';

export const columns = [
  {
    title: '用户ID',
    key: 'cuid',
    width: 100,
  },
  {
    title: '用户名',
    key: 'cuname',
    width: 100,
  },
 
  {
    title: '数额',
    key: 'amount',
    width: 100,
  }, 
  
  {
    title: '创建时间',
    key: 'create_at',
    width: 220,
  },
  {
    title: '发送钱包',
    key: 'from_address',
    width: 220,    
  },  
  
  {
    title: '接受钱包',
    key: 'to_address',
    width: 220,
    
  },

];
