import { h } from 'vue';

export const columns = [
  {
    title: '发布ID',
    key: 'id',
    width: 50,
  },
  {
    title: '类型ID',
    key: 'item_id',
    width: 50,   
  },
  {
    title: '用户ID',
    key: 'cuid',
    width: 50,   
  },
  {
    title: '用户',
    key: 'cuname',
    width: 80,   
  },
  {
    title: '标题',
    key: 'ctitle',
    width: 50,
  },
  {
    title: 'U总',
    key: 'total_U',
    width: 50,
  },
  {
    title: '已购买U',
    key: 'charged_U',
    width: 50,
  },
  {
    title: '次数',
    key: 'reword_count',
    width: 50,
    render(row) {
       if(row.reword_count) {         
        return "总"+row.reword_count+"("+row.paying_num+")"
       }     
    },    
  },
  {
    title: '单笔',
    key: 'pay_unit',
    width: 50,
  },  
  
  {
    title: '所有信息',
    key: 'reword_all',
    width: 100,
    render(row) {
      let str = ""
      if( row.reword1 &&row.reword_num1 ){
        str = str + "第1次设置为"+row.reword1+"("+row.reword_num1+")<br>";        
      }
      if( row.reword2 &&row.reword_num2 ){
        str = str + "第2次设置为"+row.reword2+"("+row.reword_num2+")<br>";        
      }
      if( row.reword3 &&row.reword_num3 ){
        str = str + "第3次设置为"+row.reword3+"("+row.reword_num3+")<br>";        
      }
      if( row.reword4 &&row.reword_num4 ){
        str = str + "第4次设置为"+row.reword4+"("+row.reword_num4+")<br>";        
      }
      if( row.reword5 &&row.reword_num5 ){
        str = str + "第5次设置为"+row.reword5+"("+row.reword_num5+")<br>";        
      }
      return str
    }
  },
  
 

  {
    title: '状态标志',
    key: 'sta',
    width: 56,
    render(row) {    
      if(row.sta ==1){
         return "进行中";
      }
      if(row.sta ==2){
         return "结束";
      }
      
   },
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 150,
  },
];
