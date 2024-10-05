<template>
    <n-drawer v-model:show="isDrawer" :width="width" :placement="placement">
      <n-drawer-content :title="title" closable>
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="100"
        >
          <n-form-item label="类型" path="type">
            <span>配置项</span>
          </n-form-item>
          <n-form-item label="名称" path="cname">
            <n-input placeholder="请输入配置项名称" v-model:value="formParams.cname" />
          </n-form-item>
          <n-form-item label="配置项key" path="ckey">
            <n-input placeholder="请输入配置项key(英文key)" v-model:value="formParams.ckey" />
          </n-form-item>
          <n-form-item label="配置value" path="cvalue">
            <n-input placeholder="请输入配置value" v-model:value="formParams.cvalue" />
          </n-form-item>
          <n-form-item label="说明" >
            <n-input placeholder="请输入配置说明" v-model:value="formParams.desp" />
          </n-form-item>
          
           <n-form-item label="商户ID"  >
             <n-input type="number" placeholder="请输入配置商户ID(默认为0)" v-model:value="formParams.mech_id" />
           </n-form-item>   

        </n-form>
  
        <template #footer>
          <n-space>
            <n-button type="primary" :loading="subLoading" @click="formSubmit">提交</n-button>
            <n-button @click="handleReset">重置</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </template>
  
  <script lang="ts">
    import { defineComponent, reactive, ref, toRefs } from 'vue';
    import { useMessage } from 'naive-ui';
    import { addWebConfig } from '@/api/system/config';
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
      name: 'CreateConfig',
      components: {},
      emits: ['minireloadTable'],
      props: {
        title: {
          type: String,
          default: '添加配置项',
        },
        width: {
          type: Number,
          default: 450,
        },
      },
      setup(props,context) {
        const message = useMessage();
        const formRef: any = ref(null);
        const defaultValueRef = () => ({
          cname: '',  
          ckey: '',
          cvalue:'',
          mech_id:0, 
          desp:'',
        });
  
        const state = reactive({
          isDrawer: false,
          subLoading: false,
          formParams: defaultValueRef(),
          placement: 'right',
          alertText:
            '该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts 中设置，建议在生产环境关闭该布局预览功能。',
        });
  
        function openDrawer() {
          state.formParams.cname=''
          state.formParams.ckey= '',
          state.formParams.cvalue='',
          state.formParams.desp='',
          state.formParams.mech_id=0,
          state.isDrawer = true;
        }
  
        function closeDrawer() {
          state.isDrawer = false;
        }
  
        function formSubmit() {
          formRef.value.validate((errors) => {
            if (!errors) {
              message.success('添加成功');
              handleReset();
              closeDrawer();
              context.emit("minireloadTable")
            } else {
              message.error('请填写完整信息');
            }
          });
        }
  
        async function handleReset() {
          //formRef.value.restoreValidation();
        //  state.formParams = Object.assign(state.formParams, defaultValueRef());
          let postdata = state.formParams;       
          return await addWebConfig(postdata);
        }
  
        return {
          ...toRefs(state),
          formRef,
          rules,
          formSubmit,
          handleReset,
          openDrawer,
          closeDrawer,
        };
      },
    });
  </script>
  