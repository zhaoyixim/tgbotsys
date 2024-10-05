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
    import { addItemData } from "@/api/vtemp/lists";
    export default defineComponent({
      name: 'classlistAdd',
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
          title: '',  
          cover: '',
          icon:'',
          path:'',
          url:'',     
          desp:"",
          is_show:1,
        });
        
        const formDataReadOnly = reactive({data:[
          {cname:"类别标题",ckey:"title",cvalue:"",disabled:false},
          {cname:"封面路径",ckey:"cover",cvalue:"",disabled:false},
          {cname:"图标",ckey:"icon",cvalue:"",disabled:false},
          {cname:"第二标题",ckey:"path",cvalue:"",disabled:false},                  
          {cname:"点击链接",ckey:"url",cvalue:"",disabled:false},
          {cname:"说明",ckey:"desp",cvalue:"",disabled:false},
          {cname:"是否展示(默认为1-展示)",ckey:"is_show",cvalue:1,disabled:true},
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
            formDataReadOnly.data.forEach(it=>{
              submitForm[it.ckey] = it.cvalue
            })
            submitForm.sta = 1
            let reb = await addItemData(submitForm)
            if(reb){
              context.emit("emitreloadTable")
              message.success('添加成功')
              closeDrawer()
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
  