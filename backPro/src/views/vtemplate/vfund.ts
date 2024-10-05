const orderStsArr = {
  1:"正在使用-提交中",
  2:"计时中",
  3:"付款完成",
  4:"计时完未付款--关闭订单",
  5:"提现中",
  6:"提现完成",
  7:"提现失败",
  8:"冻结状态",
  9:"解冻状态",
  9:"提现取消",
  10:"交换取消"
}

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
    title: '数额',
    key: 'nums',
    width: 100,
  }, 

  {
    title: '地址',
    key: 'address',
    width: 330,
  },
  {
    title: '订单类型',
    key: 'paytype',
    width: 100,
    render(row) {
      if(row.paytype == 0) return "充值订单";
      else if(row.paytype == 1) return "提现订单";   
      else return "交换订单";      
   },
  }, 

  {
    title: '订单状态',
    key: 'paying',
    width: 100,
    render(row) {     
      return orderStsArr[row.paying];         
   },
  }, 
  {
    title: '提现加减标识',
    key: 'plus',
    width: 100,
    render(row) {
      if(row.plus == 0) return "提现出去";      
      else return "归还资产";      
   },
  }, 

  {
    title: '创建时间',
    key: 'ctime',
    width: 200,
  },
  {
    title: '更新时间',
    key: 'uptime',
    width: 200,
    
  },
  {
    title: '备注说明',
    key: 'desp',
    editComponent: 'NInput',
    // 默认必填校验
   // editRule: true,
    edit: true,
    width: 200,
  },
];
