<template>
    <n-drawer v-model:show="isDrawer" :width="width">
      <n-drawer-content :title="title" closable>
        <n-form   
          ref="formRef"
          label-placement="left"
          :label-width="100"
        >
          <n-form-item label="类型" path="type">
            <span>操作信息项</span>
          </n-form-item>          
          <div style="margin-top: 15px;"></div>         
          <div v-for="(item,index) in formDataReadOnly.data" :key="index">
            <n-form-item :label="item.cname" path="item.ckey">              
               <n-input placeholder="请输入" 
               v-model:value="item.cvalue"
               type="number"
               @input="(e)=>inputBindValue(e,index)" :disabled="item.disabled" />
            </n-form-item>
          </div>          
           <div style="text-align: center;margin-top: 20px;">
            <n-button type="primary"  @click="submitBtn">提交</n-button>
           </div>
          
          
        </n-form>     
      </n-drawer-content>
    </n-drawer>
  </template>
  
  <script lang="ts">
    import { defineComponent, reactive, ref, toRefs } from 'vue';
    import { useMessage } from 'naive-ui';
    import { addItemMatchData } from "@/api/vtemp/lists";
    export default defineComponent({
      name: 'classuidmatchAdd',
      components: {},
      emits: ['emitreloadTable'],
      props: {
        title: {
          type: String,
          default: '数据项',
        },
        width: {
          type: Number,
          default: 450,
        },       
      },
      setup(props,context) {
        const message = useMessage();
        const formRef = ref()
        const itemData = reactive({data:{}})
        const defaultValueRef = () => ({
          item_id: 0,  
          cuid: 0,
          card_N:0,
          remain_N:0,
          is_limit_N:0,
          sta:1,
        });
        
        const formDataReadOnly = reactive({data:[
          {cname:"类别ID",ckey:"item_id",cvalue:0,disabled:false},
          {cname:"商户ID",ckey:"cuid",cvalue:0,disabled:false},
          {cname:"可创建卡槽",ckey:"card_N",cvalue:0,disabled:false},
          {cname:"剩余卡槽",ckey:"remain_N",cvalue:0,disabled:false},                  
          {cname:"模式",ckey:"is_limit_N",cvalue:0,disabled:false},
          {cname:"是否启用(默认为1-展示)",ckey:"sta",cvalue:1,disabled:true},
        ]})        
        const state = reactive({
          isDrawer: false,
          subLoading: false,
          checkLoading:false,
          checkWalletLoading:false,
          formParams: defaultValueRef(),
          formDataReadOnly:formDataReadOnly,
          placement: 'right',
          alertText:
            '该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts 中设置，建议在生产环境关闭该布局预览功能。',
        });

        const inputBindValue = (items,indexs) => {
          formDataReadOnly.data[indexs].cvalue = parseInt(items,10)  
        }
        const submitBtn = async() =>{
          let submitForm = {}
          let checkok = true
            formDataReadOnly.data.forEach(it=>{
              if(it.ckey != "is_limit_N" && it.cvalue == 0){
                  message.success(it.ckey+'不能为0')
                  checkok=false
                  return false;
              }else{
                submitForm[it.ckey] = it.cvalue
              }              
            })
            console.log(submitForm,"submitForm")
            if(!checkok){
               message.success('清按照要求输入')
               return ;
            }
            
            let reb = await addItemMatchData(submitForm)
            if(reb){
              message.success('添加成功')
              closeDrawer()
              context.emit("emitreloadTable")
            }
           // state.checkLoading = true
            //checkNetVerify({depositId:itemData.data._id})
        }       
  
        function openDrawer(data:Object) {
          itemData.data = data          
          state.isDrawer = true;
        }
  
        function closeDrawer() {
          state.isDrawer = false;
        } 
        
       
  
        return {
          inputBindValue,
          ...toRefs(state),          
          formDataReadOnly,
          submitBtn,
          openDrawer,
          closeDrawer,
        };
      },
    });
  </script>
  