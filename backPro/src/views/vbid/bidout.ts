import { h } from 'vue';
import { NAvatar } from 'naive-ui';

export const columns = [
  {
    title: '用户名称',
    key: 'username',
    width: 100,
  },
  {
    title: '交易手续费',
    key: 'fee',
    width: 50,
  },
  {
    title: '收款码',
    key: 'imageFiles',
    width: 100,
    render(row) {
      return h("img", {
        src:row.imageFiles,       
      });        
   },
  }, 
  
  {
    title: '买入/售出',
    key: 'bidType',
    width: 100,
    render(row) {
      if(row.bidType == 1) return "买入";     
      else return "售出";            
   },
  },
  {
    title: '动态/固定',
    key: 'bidPriceType',
    width: 100,
    render(row) {
      if(row.bidPriceType == 1) return "动态价格";     
      else return "固定价格";            
   },
  },     
  {
    title: '交易单价',
    key: 'bidPrice',    
    width: 100,
  }, 
  {
    title: '真实价格',
    key: 'realPrice',    
    width: 100,
  }, 

  {
    title: '交易方式',
    key: 'bidMethod',    
    width: 100,
  }, 

  {
    title: '要求保证金',
    key: 'askBailNums',    
    width: 100,
  }, 

  {
    title: '创建时间',
    key: 'ctime',    
    width: 100,
  }, 

  {
    title: '结束时间',
    key: 'orderEndTime',    
    width: 100,
  }, 

  {
    title: '交易说明文字',
    key: 'bidDesp',
    //editComponent: 'NInput',
    // 默认必填校验
   // editRule: true,
    //edit: true,
    width: 100,
  },
];
