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
            <span>操作项</span>
          </n-form-item>

          <div v-for="(item,index) in operaData" :key="index">
            <n-form-item :label="item.cname" path="item.ckey">
              <div  v-if="item.numbered"><n-input-number placeholder="item.cname" :min="0" v-model:value="sortNums" /></div>
              <div v-else-if="item.selected">
                <n-space vertical style="width:200px">
                  <n-select v-model:value="optionsValue" :options="options"  />
                </n-space>
              </div>
              <div v-else-if="item.ckey == 'disaggreeReason'">
                <n-input placeholder="请输入拒绝原因"  v-model:value="reasonInput" :disabled="item.disabled" />
              </div>
              <div v-else><n-input placeholder="item.cname"  v-model:value="item.cvalue" :disabled="item.disabled" /></div>
            
            </n-form-item>
          </div>  
          <div style="margin-top: 15px;"></div>
          <n-form-item label="类型" path="type">
            <span >信息项</span>
          </n-form-item>
          <div style="margin-top: 5px;"></div>
          <div v-for="(item,index) in formDataReadOnly" :key="index">
            <n-form-item :label="item.cname" path="item.ckey">
              <n-input placeholder="item.cname" v-model:value="item.cvalue" :disabled="item.disabled" />
            </n-form-item>
          </div>       

        </n-form>
  
        <template #footer>
          <n-space>
            <n-button type="primary" :loading="subLoading" @click="formSubmit">提交</n-button>
            
            <n-button @click="forceFinish">强制结束订单</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </template>
  
  <script lang="ts">
    import { defineComponent, reactive, ref, toRefs } from 'vue';
    import { useDialog, useMessage } from 'naive-ui';
    import { updataBidData,forceFinished } from "@/api/bid/lists";
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
        const dialog = useDialog()
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
          {cname:"交易手续费",ckey:"fee",cvalue:"",disabled:true},
          {cname:"买入/售出",ckey:"bidType",cvalue:"",disabled:true},
          {cname:"动态/固定",ckey:"bidPriceType",cvalue:"",disabled:true},
          {cname:"交易单价",ckey:"bidPrice",cvalue:"",disabled:true},
          {cname:"交易单价计算出来之后的价格",ckey:"realPrice",cvalue:"",disabled:true},
          {cname:"交易方式",ckey:"bidMethod",cvalue:"",disabled:true},
          {cname:"交易限额-最大",ckey:"bidRmbMax",cvalue:"",disabled:true},
          {cname:"交易限额-最小",ckey:"bidRmbMin",cvalue:"",disabled:true},
          {cname:"交易时限-0表示无限",ckey:"validPeriod",cvalue:"",disabled:true},
          {cname:"交易次数-0表示无限",ckey:"bidTimes",cvalue:"",disabled:true},
          {cname:"要求保证金数量-保存的是序号",ckey:"askBailNums",cvalue:"",disabled:true},
          {cname:"订单开始作用日期",ckey:"orderStartDate",cvalue:"",disabled:true},
          {cname:"订单开始作用时间",ckey:"orderStartTime",cvalue:"",disabled:true},
          {cname:"订单结束作用日期",ckey:"orderEndDate",cvalue:"",disabled:true},
          {cname:"订单结束作用时间",ckey:"orderEndTime",cvalue:"",disabled:true},
          {cname:"订单标题",ckey:"bidTitle",cvalue:"",disabled:true},
          {cname:"选择出价标题",ckey:"bidPriceTitle",cvalue:"",disabled:true},
          {cname:"交易说明文字",ckey:"bidDesp",cvalue:"",disabled:true},
          {cname:"是否过时订单",ckey:"passedOrder",cvalue:"",disabled:true},
          {cname:"状态:1--正常-默认 2--删除  剩余的待定义",ckey:"sta",cvalue:"",disabled:true},
          {cname:"是否申请推送到首页",ckey:"recommentIndex", cvalue:false,disabled:true},
        ]
        let operaData = [ 
          {cname:"是否推送到首页",ckey:"indexShow",selected:true,cvalue:"",disabled:true}, 
          {cname:"拒绝申请推送到首页原因",ckey:"disaggreeReason",cvalue:"",disabled:false},
          {cname:"排序",ckey:"sort",numbered:true, cvalue:0},
        ]
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
          formParams: defaultValueRef(),
          placement: 'right',
          alertText:
            '该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts 中设置，建议在生产环境关闭该布局预览功能。',
        });
  
        function openDrawer(data:Object) {
          itemData.data = data
        //  console.log("itemData",data)
          formDataReadOnly.forEach(it=>{           
            if(data[it.ckey]){             
              if(it.ckey == 'bidType'){
                if(data[it.ckey] ==1) it.cvalue = "买入";
                else it.cvalue = "售出";  
              }else if(it.ckey == 'recommentIndex'){ 
                if(data[it.ckey] == true) it.cvalue = "已申请";
                else it.cvalue = "未申请";         
              }else if(it.ckey == 'bidPriceType'){
                if(data[it.ckey] ==1) it.cvalue = "动态";
                else it.cvalue = "固定";
              }else if(it.ckey == 'sta'){
                if(data[it.ckey] ==1) it.cvalue = "正常(默认)";
                else if(data[it.ckey] ==2) it.cvalue = "删除";                
              }else {
                it.cvalue = data[it.ckey]
              } 
            }
          })

          operaData.forEach(it=>{
            if(data[it.ckey]){  
              if(it.ckey == 'indexShow'){
                  if(data[it.ckey]==0) it.cvalue = "未操作";
                  else if(data[it.ckey]==1) it.cvalue = "同意";
                  else if(data[it.ckey]==2) it.cvalue = "拒绝";
                  else {it.cvalue = "未操作";}
              }else  if(it.ckey == 'sort'){
                sortNums.value = data[it.ckey] 
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
         
          const res =await  updataBidData(data)      
          if(res){
              message.success('添加成功');
              closeDrawer();  
              context.emit("emitreloadTable")
          }else message.error('操作失败');    
        
        }  
       
        const forceFinish = async() =>{
             let sendData = {
              needId:itemData.data._id,
              force:1
             }
             dialog.warning({
                  title: '提示',
                  content: '你确定要强制操作订单状态么？强制操作订单将非正常结束',
                  positiveText: '确定',
                  negativeText: '取消',
                  onPositiveClick: async() => {
                    await forceFinished(sendData)
                    message.success('操作完成')
                  },
                  onNegativeClick: () => {
                    message.warning('取消成功')
                  }
            })
        }
  
        return {
          ...toRefs(state),
          formDataReadOnly,
          operaData,
          forceFinish,
          options,
          optionsValue,
          formRef,
          reasonInput,
          sortNums,
          rules,
          formSubmit,          
          openDrawer,
          closeDrawer,
        };
      },
    });
  </script>
  