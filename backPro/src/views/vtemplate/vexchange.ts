import { h } from 'vue';
import { NAvatar } from 'naive-ui';

export const columns = [
  {
    title: '用户名称',
    key: 'username',
    width: 100,
  },
  {
    title: '网络类型',
    key: 'netTypeLabel',
    width: 100,
  },
  {
    title: '充值数量',
    key: 'nums',
    width: 100,
  }, 
  
  {
    title: '创建时间',
    key: 'ctime',
    width: 220,
  },
  {
    title: '更新时间',
    key: 'uptime',
    width: 220,
    
  },     
  {
    title: '网络验证',
    key: 'netverify',
    editComponent: 'NSelect',
    editComponentProps: {
      options: [
        {
          label: '未验证-等待验证',
          value: 0,
        },
        {
          label: '验证成功-提现成功',
          value: 1,
        },
        {
          label: '验证失败-提现失败',
          value: 2,
        },
      ],
    },
    edit: true,
    width: 220,
    ellipsis: false,
  }, 
  {
    title: '备注说明',
    key: 'desp',
    editComponent: 'NInput',
    // 默认必填校验
   // editRule: true,
    edit: true,
    width: 400,
  },
];
