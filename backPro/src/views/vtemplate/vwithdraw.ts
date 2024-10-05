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
    title: '提现钱包',
    key: 'wallet_address',
    width: 220,    
  },
  
  {
    title: '手续费%',
    key: 'rate',
    width: 220,    
  },
  
  {
    title: '扣除手续费后的U',
    key: 'withdraw_U',
    width: 220,    
  },

  {
    title: '状态',
    key: 'sta',
    width: 220,
    render(row) {     
      if(row.sta  ==0 ){ 
        return "未验证"
      }else if(row.sta  ==1){
        return "提现申请";
      }else if(row.sta  ==2){
        return "提现成功";
      }else if(row.sta  ==3){
        return "提现失败";
      }    
   },
  }, 
  {
    title: '备注说明',
    key: 'result',
    //editComponent: 'NInput',
    // 默认必填校验
   // editRule: true,
   // edit: true,
    width: 400,
  },
];
