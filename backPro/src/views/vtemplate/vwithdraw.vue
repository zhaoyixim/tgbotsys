<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="付款列表">
          滴滴答滴滴答
      </n-card>
    </div>  
    <n-card :bordered="false" class="proCard">
      <BasicTable
        title="付款列表"
        titleTooltip="用户付款数据"
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @edit-end="editEnd"
        @edit-change="onEditChange"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1360"
      >
        <template #toolbar>
          <n-button type="primary" @click="reloadTable">刷新数据</n-button>
        </template>
      </BasicTable>
    </n-card>
</div>
</template>

<script lang="ts" setup>
  import { reactive, ref,h, onMounted } from 'vue';
  import { getWithdrawableList,changeEditData, sureWithDraw } from "@/api/vtemp/lists";
  import { columns } from './vwithdraw';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useMessage } from 'naive-ui';
  import { getMenuList } from '@/api/system/menu';
  const message = useMessage();
  const actionRef = ref();
  const treeData = ref([]);
  const expandedKeys = ref([]);
  const params = reactive({
    pageSize: 5,
    name: 'xiaoMa',
  });

  function onEditChange({ column, value, record }) {
    if (column.key === 'id') {
    //  record.editValueRefs.name4.value = `${value}`;
    }
    //console.log(column, value, record);
  }

  const loadDataTable = async (res) => {
   
    return await getWithdrawableList({ ...params, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    console.log(actionRef.value);
    actionRef.value.reload();
  }

  const editEnd = async ({ record, index, key, value }) =>{
    let senddata = {_id: record._id};  
    senddata[key] = value  
    /**更改验证状态 */
    if(key === "netverify"){
      
    }else if(key === "desp"){
      /**备注说明 */
    }
    let returnback = await changeEditData(senddata);
    if(returnback.status){
      message.success(returnback.message);
    }
    console.log(returnback)
    //console.log(record, index, key,value);
  }
  async function handleOpera(record: Recordable) { 
     await sureWithDraw({
      withDrawId:record.id,
     })
     message.success('提现成功')
     reloadTable()
  }
  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
          style: 'button',
          actions: [ 
            {
              label: '提现确认',
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
  onMounted(async () => {
    const treeMenuList = await getMenuList();
    expandedKeys.value = treeMenuList.list.map((item) => item.key);
    treeData.value = treeMenuList.list;
  });

</script>

<style lang="less" scoped></style>
