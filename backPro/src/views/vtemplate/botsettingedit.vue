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
    import { editBotSetting } from "@/api/vtemp/lists";
    export default defineComponent({
      name: 'botsettingEdit',
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
             tgtoken: "",
             mech_id: "", 
             belongs:"", 
             cname:"", 
             cusername:"", 
             ctype:0,
             sta:1,
        });
        
        const formDataReadOnly = reactive({data:[
         {cname:"密钥token",ckey:"tgtoken",cvalue:"",disabled:false},
         {cname:"商户ID",ckey:"mech_id",cvalue:"",disabled:false},
         {cname:"所属(1系统所属,其他商户所属)",ckey:"belongs",cvalue:"",disabled:false},
         {cname:"机器人name",ckey:"cname",cvalue:"",disabled:false},                  
         {cname:"机器人名字",ckey:"cusername",cvalue:"",disabled:false},
         {cname:"使用类别",ckey:"ctype",cvalue:1,disabled:false},          
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
          formDataReadOnly.data[indexs].cvalue = items
        }
        const submitBtn = async() =>{
          let submitForm = {}
          let checkok = true
            formDataReadOnly.data.forEach(it=>{
              if(it.ckey != "is_limit_N" &&it.cvalue == 0){
                  message.success(it.ckey+'不能为0')
                  checkok=false
                  return false;
              }else{
                submitForm[it.ckey] = it.cvalue
              }              
            })
            
            if(!checkok){
               message.success('清按照要求输入')
               return ;
            }
            submitForm["belongs"] = parseInt(submitForm["belongs"])
            submitForm["mech_id"] = parseInt(submitForm["mech_id"])
            submitForm["sta"] = parseInt(submitForm["sta"])
            submitForm["ctype"] = parseInt(submitForm["ctype"])
            
            submitForm.id =  itemData.data.id
            let reb = await editBotSetting(submitForm)
            if(reb){
              message.success('添加成功')
              closeDrawer()
              context.emit("emitreloadTable")
            }           
        }       
  
        function openDrawer(items:Object) {
          console.log(items,"items")
          itemData.data = items   
          state.formParams.tgtoken = items.tgtoken
          state.formParams.mech_id = items.mech_id
          state.formParams.belongs = items.belongs
          state.formParams.cname = items.cname      
          state.formParams.cusername = items.cusername
          state.formParams.ctype = items.ctype
          state.formParams.sta = items.sta
          formDataReadOnly.data.forEach(it=>{           
             it.cvalue=itemData.data[it.ckey]                         
          })           
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
  