<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="充值列表">
          滴滴答滴滴答
      </n-card>
    </div>  
    <n-card :bordered="false" class="proCard">
      <BasicTable
        title="用户充值数据"
        :columns="columns"
        
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
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
    <vdepositsWindow ref="sliderWindowRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref,h, onMounted } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getDepostTableList,changeEditData } from "@/api/vtemp/lists";
  import { columns } from './vdeposits';
  import { useMessage } from 'naive-ui';  
  import vdepositsWindow from './vdepositsWindow.vue';
  import { checkNetVerify,checkWalletVerify } from "@/api/vtemp/lists";
  import { getMenuList } from '@/api/system/menu';

  const message = useMessage();
  const actionRef = ref();

  const treeData = ref([]);
  const expandedKeys = ref([]);

  const params = reactive({
    pageSize: 5,
    name: 'xiaoMa',
  });
  const sliderWindowRef = ref();
  const createSliderTitle = "操作项"

  function onEditChange({ column, value, record }) {
    if (column.key === 'id') {
    //  record.editValueRefs.name4.value = `${value}`;
    }
    //console.log(column, value, record);
  }

  const loadDataTable = async (res) => {
    return await getDepostTableList({ ...params, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }
  const openCreateDrawer = async ( data )=> {
        const { openDrawer } = sliderWindowRef.value; 
        openDrawer(data);
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
      openCreateDrawer(record);   
  }  
  async function handleCheck(record:Recordable) {
    if(record.netverify == 1){
      message.warning('您已经验证过了');
      return ;
    }
    await checkNetVerify({depositId:record._id})
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
              label: '操作',
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
