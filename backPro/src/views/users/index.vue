<template>
    <n-card :bordered="false" class="proCard">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>
  
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        @edit-end="editEnd"
        @edit-change="onEditChange"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090"
      >
        <template #tableTitle>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
        </template>
  
        <template #toolbar>
          <n-button type="primary" @click="reloadTable">刷新数据</n-button>
        </template>
      </BasicTable>
  
      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="名称" path="name">
            <n-input placeholder="请输入名称" v-model:value="formParams.name" />
          </n-form-item>
          <n-form-item label="地址" path="address">
            <n-input type="textarea" placeholder="请输入地址" v-model:value="formParams.address" />
          </n-form-item>
          <n-form-item label="日期" path="date">
            <n-date-picker type="datetime" placeholder="请选择日期" v-model:value="formParams.date" />
          </n-form-item>
        </n-form>
  
        <template #action>
          <n-space>
            <n-button @click="() => (showModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
    
     <n-modal
        v-model:show="showSureMechModal"
        preset="dialog"
        title="确认"
        content="你确认将该用户设定为商户身份?"
        positive-text="确认"
        negative-text="算了"
        @positive-click="submitCallback"
      />
      
      
  </template>
  
  <script lang="ts" setup>
    import { h, reactive, ref } from 'vue';
    import { useMessage } from 'naive-ui';
    import { BasicTable, TableAction } from '@/components/Table';
    import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
    import { getTableList,sureMechId,editTableItem } from '@/api/users/list';
    import { columns } from './columns';
    import { PlusOutlined } from '@vicons/antd';
    import { useRouter } from 'vue-router';
    const showSureMechModal = ref(false)
    const message = useMessage();
   
    const rules = {
      name: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入名称',
      },
      address: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入地址',
      },
      date: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择日期',
      },
    };
  
    const schemas: FormSchema[] = [
      {
        field: 'name',
        labelMessage: '这是一个提示',
        component: 'NInput',
        label: '姓名',
        componentProps: {
          placeholder: '请输入姓名',
          onInput: (e: any) => {
            console.log(e);
          },
        },
        rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
      }      
    ];
  
    const router = useRouter();
    const formRef: any = ref(null);
    // const message = useMessage();
    const actionRef = ref();
  
    const showModal = ref(false);
    const formBtnLoading = ref(false);
    const formParams = reactive({
      name: '',
      address: '',
      date: null,
    });
  
    const params = ref({
      pageSize: 5,
      name: 'xiaoMa',
    });
  const clickRefValue = ref()
  async function handleOpera(record: Recordable) {
     showSureMechModal.value = true
     clickRefValue.value = record
  }
  
  const submitCallback = async() => {
    await sureMechId({
     cuid:clickRefValue.value.id,
    })
     showSureMechModal.value = false
    message.success('提现成功')
    reloadTable()    
  }
    const actionColumn = reactive({
      width: 220,
      title: '设定商户身份',
      key: 'action',
      fixed: 'right',
      render(record) {
        return h(TableAction, {
            style: 'button',
            actions: [ 
              {
                label: '商户确认',
                onClick: handleOpera.bind(null, record),
                // 根据业务控制是否显示 isShow 和 auth 是并且关系
                ifShow: () => {              
                   return true;
                },
                // 根据权限控制是否显示: 有权限，会显示，支持多个
                auth: ['basic_list'],
              }          
        
            ],
          });
          
       
        
      },
    });
  
    const [register, {}] = useForm({
      gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
      labelWidth: 80,
      schemas,
    });
  
    function addTable() {
      showModal.value = true;
    }
  
    const loadDataTable = async (res) => {        
        return await getTableList({ ...formParams, ...params.value, ...res });
    };
  
    function onCheckedRow(rowKeys) {
      console.log(rowKeys);
    }
  
    function reloadTable() {
      actionRef.value.reload();
    }
  
    function confirmForm(e) {
      e.preventDefault();
      formBtnLoading.value = true;
      formRef.value.validate((errors) => {
        if (!errors) {
          window['$message'].success('新建成功');
          setTimeout(() => {
            showModal.value = false;
            reloadTable();
          });
        } else {
          window['$message'].error('请填写完整信息');
        }
        formBtnLoading.value = false;
      });
    }
  
    function handleEdit(record: Recordable) {
      console.log('点击了编辑', record);
      router.push({ name: 'user-info', params: { id: record.id } });
    }
  
    function handleDelete(record: Recordable) {
      console.log('点击了删除', record);
      window['$message'].info('点击了删除');
    }
  
    function handleSubmit(values: Recordable) {
      console.log(values);
      reloadTable();
    }
  
    function handleReset(values: Recordable) {
      console.log(values);
    }

    async function editEnd({ record, index, key, value }) {
      let postData = {
        userId:record._id,
        ckey:key,
        cvalue:value
      }
      await editTableItem(postData)
      window['$message'].info('编辑成功');
      reloadTable();
    }

    function onEditChange({ column, value, record }) {
    if (column.key === 'id') {
      record.editValueRefs.name4.value = `${value}`;
    }
    console.log(column, value, record,"onEditChange");
  }


  </script>
  
  <style lang="less" scoped></style>
  