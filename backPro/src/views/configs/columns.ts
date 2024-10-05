import { h } from 'vue';
import { NTag } from 'naive-ui';

export const columns = [  
  {
    title: '配置名称',
    key: 'cname',
  },
  {
    title: '配置key',
    key: 'ckey',
  },
  {
    title: '配置value',
    key: 'cvalue',
  },  
  
  {
    title: '商户ID',
    key: 'mech_id',
  }, 
   {
     title: '说明',
     key: 'desp',
   }, 
  {
    title: '创建时间',
    key: 'create_at',
  },
];
