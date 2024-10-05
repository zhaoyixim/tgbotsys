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
          <n-form-item label="是否启用该配置项" path="cenable">
            <n-switch v-model:value="formParams.cenable" />
          </n-form-item>
          <n-form-item label="是否允许删除配置" path="cdelete">
            <n-switch v-model:value="formParams.cdelete" />
          </n-form-item>
          <n-form-item label="配置说明" path="desp">
            <n-input  type="textarea" :autosize="{minRows:5}" v-model:value="formParams.desp" placeholder="请输入配置说明" />
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
      setup() {
        const message = useMessage();
        const formRef: any = ref(null);
        const defaultValueRef = () => ({
          cname: '',  
          ckey: '',
          cvalue:'',
          cenable:true,
          cdelete:true,
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
            } else {
              message.error('请填写完整信息');
            }
          });
        }
  
        async function handleReset() {
          formRef.value.restoreValidation();
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
  