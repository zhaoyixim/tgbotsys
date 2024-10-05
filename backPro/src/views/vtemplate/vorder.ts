import { h } from 'vue';
import { NAvatar } from 'naive-ui';
 const OrderSts = {
  1:"支付成功",
  2:"转账验证",
  3:"等待支付",
  4:"验证超时",
  5:"订单取消",
  11:"提现中",
  12:"提现成功",
  13:"提现失败",
  14:"提现取消",
  21:"兑换中",
  22:"兑换成功",
  23:"兑换失败",
  24:"兑换取消"
}

export const columns = [
  {
    title: '用ID',
    key: 'cuid',
    width: 100,
  },
  {
    title: '游戏ID',
    key: 'item_id',
    width: 100,
  },
  {
    title: '中奖号',
    key: 'reword_num',
    width: 100,
  },

  {
    title: 'U',
    key: 'reword_U',
    width: 380,
  },
  
  {
    title: '创建时间',
    key: 'create_at',
    width: 200,
  }
];
