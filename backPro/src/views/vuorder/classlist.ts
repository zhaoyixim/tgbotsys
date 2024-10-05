import { h } from 'vue';

export const columns = [
  {
    title: '类别ID',
    key: 'id',
    width: 50,
  },
  {
    title: '标题',
    key: 'title',
    width: 50,   
  },
  {
    title: '第二标题',
    key: 'path',
    width: 50,   
  },  
  {
    title: '封面',
    key: 'cover',
    width: 150,   
  },
  {
    title: '图标',
    key: 'icon',
    width: 80,   
  },
  {
    title: '点击跳转',
    key: 'url',
    width: 150,
  },
  {
    title: '说明',
    key: 'desp',
    width: 150,
  },
  
 
  {
    title: '启用',
    key: 'sta',
    width: 50,
    render(row) {
       if(row.sta == 1) {         
        return "启用"
       }else{
         return "未启用"
       }     
       
    },    
  }, 
  {
    title: '展示',
    key: 'is_show',
    width: 56,
    render(row) {    
      if(row.is_show ==1){
         return "展示";
      }
      if(row.sta ==2){
         return "不展示";
      }
      
   },
  },
  
];
