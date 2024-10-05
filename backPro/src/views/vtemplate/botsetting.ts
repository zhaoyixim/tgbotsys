import { h } from 'vue';

export const columns = [
  {
    title: '密钥token',
    key: 'tgtoken',
    width: 250,
  },
  {
    title: '所属',
    key: 'belongs',
    width: 150, 
      render(row) {
         if(row.belongs == 1) {         
          return "系统所属"
         }else{
           return row.mech_id+"所属"
         }
      }, 
  },
  {
    title: '机器人name',
    key: 'cname',
    width: 150,   
  },
  {
    title: '机器人名字',
    key: 'cusername',
    width: 150,   
  },
  {
    title: '使用类别',
    key: 'ctype',
    width: 180,  
     render(row) {
        if(row.ctype == 1) {         
         return "siglebot使用"
        }else{
          return "群bot使用"
        }
     }, 
  },
  {
    title: '商户ID',
    key: 'mech_id',
    width: 150,   
  },
  
 
  {
    title: '启用',
    key: 'sta',
    width: 50,
    render(row) {
       if(row.sta == 1) {         
        return "正常"
       }else{
         return "禁用"
       }
    },    
  }  
];
