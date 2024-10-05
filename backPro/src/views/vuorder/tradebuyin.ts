import { h } from 'vue';

export const columns = [
  {
    title: '操作用户',
    key: 'username',
    width: 50,
  },
  {
    title: '对象用户',
    key: 'tousername',
    width: 50,
    render(row) {
      return row.toUser.username       
    },
  },
  // {
  //   title: '收款码',
  //   key: 'imageFiles',
  //   width: 100,
  //   render(row) {
  //     return h("img", {
  //       src:row.imageFiles,       
  //     });        
  //  },
  // }, 
  {
    title: 'RMB金额',
    key: 'rmbNums',
    width: 50,
  },
  {
    title: 'U额度',
    key: 'usdtNums',
    width: 50,
  },
  
  {
    title: '用户收款码',
    key: 'payImages',
    width: 100,
    render(row) {     
      if(row.payImages) {
        let payImages = JSON.parse(row.payImages)
        return  h("img", {
          src:payImages[0],     
          height:60,width:80  
        });
      }     
   },
  },


  {
    title: '付款截图',
    key: 'imageFiles',
    width: 100,
    render(row) {
      if(row.imageFiles){
          let imageFiles = JSON.parse(row.imageFiles)
          if(imageFiles.length>0){
            let imgstringarr = []
            imageFiles.forEach(it => {
                imgstringarr.push(h("img", {
                  src:it,     
                  height:60,width:80  
                }));  
              });
            
              return  h("div",{class:"flex"},imgstringarr);
          }else{
            return "未上传";
          }
      }else{
        return "未上传";
      }
     
   },
  }, 

  {
    title: '状态标志',
    key: 'staFlag',
    width: 56,
    render(row) {        
       return "状态:"+row.staFlag;
   },
  },


  {
    title: '状态说明',
    key: 'staFlag',
    width: 300,
    render(row) {
      let addrow = ""
      if(row.staFlag == 1) {addrow = '新创建';}
      if(row.staFlag == 2) {addrow = '未付款--商户出售(用户卖出)-商户上传收款码';}
      if(row.staFlag == 3) {addrow = '已付款--商户出售(用户卖出)-商户上传收款码之后-(用户付款)-用户上传付款截图之后的状态-商户未确定是否收到款项';}
      if(row.staFlag == 4) {addrow = '已付款--用户买入-(用户付款)--用户上传付款截图之后状态';}
      if(row.staFlag == 9) {addrow = '已付款--订单完成';}  
      if(row.staFlag == 10) {addrow = '订单结束--后台强制完成';}       
      return addrow;
   },
  },


  {
    title: '创建时间',
    key: 'ctime',
    width: 150,
  },
];
