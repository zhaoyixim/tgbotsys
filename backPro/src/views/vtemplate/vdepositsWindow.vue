<template>
    <n-drawer v-model:show="isDrawer" :width="width">
      <n-drawer-content :title="title" closable>
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="100"
        >
          <n-form-item label="类型" path="type">
            <span>操作信息项</span>
          </n-form-item>          
          <div style="margin-top: 15px;"></div>         
          <div v-for="(item,index) in formDataReadOnly" :key="index">
            <n-form-item :label="item.cname" path="item.ckey">
              <div v-if="item.ckey == 'desp'">
                <n-input placeholder="请输入拒绝原因"  v-model:value="reasonInput"  />
              </div>
              <div v-else><n-input placeholder="item.cname" v-model:value="item.cvalue" :disabled="item.disabled" /></div>
              
            </n-form-item>
          </div>          
           <div style="text-align: center;margin-top: 20px;">
            <n-button type="primary" :loading="checkLoading" @click="submitNetCheck">进行网络验证</n-button>
           </div>
           <div>
              <n-space>

              </n-space>
           </div>           

           <div style="text-align: center;margin-top: 20px;">
            <n-button type="primary" :loading="checkWalletLoading" @click="submitWalletCheck">获得用户的钱包余额</n-button>
            <div v-if="walletData.data.status">
               总TRX资产: {{walletData.data.totalAssetInTrx}} TRX<br>
               约等于=${{walletData.data.totalAssetInUsd}}
            </div>
          </div>
        </n-form>  
        <template #footer>
          <n-space>
            <n-button type="primary" :loading="subLoading" @click="formSubmit">提交</n-button>            
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </template>
  
  <script lang="ts">
    import { defineComponent, reactive, ref, toRefs } from 'vue';
    import { useMessage } from 'naive-ui';
    import { checkNetVerify,checkWalletVerify } from "@/api/vtemp/lists";
    const rules = {
      cname: {
        required: true,
        message: '请输入配置项名称',
        trigger: 'blur',
      },
      ckey: {
        required: true,
        message: '请输入配置项key(英文key)',
        trigger: 'blur',
      },
      cvalue: {
        required: true,
        message: '请输入配置value',
        trigger: 'blur',
      },
    };
    export default defineComponent({
      name: 'sliderWindow',
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
        const formRef: any = ref(null);
        const itemData = reactive({data:{}})
        const defaultValueRef = () => ({
          cname: '',  
          ckey: '',
          cvalue:'',
          cenable:true,
          cdelete:true,
          desp:'',
        });
        
        let formDataReadOnly = [
          {cname:"用户ID",ckey:"userId",cvalue:"",disabled:true},
          {cname:"用户名称",ckey:"username",cvalue:"",disabled:true},
          {cname:"网络类型",ckey:"netTypeLabel",cvalue:"",disabled:true},
          {cname:"充值数量",ckey:"nums",cvalue:"",disabled:true},
          {cname:"创建时间",ckey:"ctime",cvalue:"",disabled:true},
          {cname:"付款钱包地址",ckey:"walletAddress",cvalue:"",disabled:true},
          {cname:"付款hash",ckey:"payHash",cvalue:"",disabled:true},
          {cname:"网络验证",ckey:"netverify",cvalue:"",disabled:true},   
          {cname:"失败原因",ckey:"desp",cvalue:"",disabled:true},        
        ]      
        /**钱包数据 */
        const walletData = reactive({data:{}}); 
        /**验证数据 */
        
        /**排序值 */
        const sortNums = ref(0)
        /**默认值 */
        const optionsValue = ref(1)
        /**选项 */
        const options = [
          { label: "同意",value: 1},
          { label: "拒绝",value: 2}
        ]
        /*原因输入*/
        const reasonInput = ref(null)
        const state = reactive({
          isDrawer: false,
          subLoading: false,
          checkLoading:false,
          checkWalletLoading:false,
          formParams: defaultValueRef(),
          placement: 'right',
          alertText:
            '该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts 中设置，建议在生产环境关闭该布局预览功能。',
        });

        const submitNetCheck = () =>{
           // state.checkLoading = true
            checkNetVerify({depositId:itemData.data._id})
        }

        const submitWalletCheck = async() =>{
           // state.checkLoading = true
           walletData.data = await checkWalletVerify({depositId:itemData.data._id})
        }
  
        function openDrawer(data:Object) {
          itemData.data = data
          formDataReadOnly.forEach(it=>{           
            if(data[it.ckey]){             
              if(it.ckey == 'netverify'){
                if(data[it.ckey] ==0){it.cvalue = "未验证--等等验证-正在验证";}
                else if(data[it.ckey] ==1){it.cvalue = "验证成功--充值成功"; } 
                else if(data[it.ckey] ==2){it.cvalue = "验证失败--充值失败"; } 
              }else{
                it.cvalue = data[it.ckey]
              }  
            }
          })         
          state.isDrawer = true;
        }
  
        function closeDrawer() {
          state.isDrawer = false;
        }
  
        async function  formSubmit() {
          let data = {
            id: itemData.data._id,
            indexShow:optionsValue.value,
            disaggreeReason:reasonInput.value,
            sort:sortNums.value
          }
         
          // const res =await  updataBidData(data)      
          // if(res){
          //     message.success('添加成功');
          //     closeDrawer();  
          //     context.emit("emitreloadTable")
          // }else message.error('操作失败');    
        
        }  
       
  
        return {
          ...toRefs(state),
          walletData,
          formDataReadOnly,          
          options,
          optionsValue,
          formRef,
          reasonInput,
          sortNums,
          rules,
          submitNetCheck,
          submitWalletCheck,
          formSubmit,          
          openDrawer,
          closeDrawer,
        };
      },
    });
  </script>
  