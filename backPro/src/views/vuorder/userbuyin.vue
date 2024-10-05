<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="用户买入">
         发布列表
      </n-card>
    </div>

  <n-card :bordered="false" class="proCard">
    <BasicTable
      title="游戏发布"
      titleTooltip="游戏发布"
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

  <sliderWindow ref="sliderWindowRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />
  <messageWindow ref="messageWindowRef" @emitreloadTable="reloadTable"  :title="messageSliderTitle" />


</div>
</template>

<script lang="ts" setup>
  import { reactive, ref,h, onMounted, unref } from 'vue';
  import { getBidTableList } from "@/api/trade/lists";
  import { BasicTable, TableAction } from '@/components/Table';
  import sliderWindow from './sliderWindow.vue';
  import messageWindow from './messageWindow.vue';

  import { columns } from './trade';
  import { useMessage } from 'naive-ui';
  import { getMenuList } from '@/api/system/menu';

  const createSliderTitle = "操作项"
  const sliderWindowRef = ref();

  
  const messageSliderTitle = "聊天信息"
  const messageWindowRef = ref();

  const message = useMessage();
  const actionRef = ref();
  const treeData = ref([]);
  const expandedKeys = ref([]);
  const params = reactive({    
    pageSize: 5,
    name: 'xiaoMa',
  });
  const openCreateDrawer = async ( data )=> {const { openDrawer } = sliderWindowRef.value;openDrawer(data); }

  const openCreateDrawer2 = async ( data )=> {const { openDrawer } = messageWindowRef.value;openDrawer(data);}
  function onEditChange({ column, value, record }) {
    if (column.key === 'id') {
    //  record.editValueRefs.name4.value = `${value}`;
    }
    //console.log(column, value, record);
  }

  const loadDataTable = async (res) => {
    let _params = {
      ...unref(params),
      ...res,buymodel:1
    };    

    let returnJoson = await getBidTableList(_params);
    return returnJoson;
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
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
  }    
  
   async function handleOpera(record: Recordable) {    
      openCreateDrawer(record);   
    }  
  async function lookMessage(record:Recordable) {
    openCreateDrawer2(record)
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
            },
            {
              label: '查看聊天记录',
              onClick: lookMessage.bind(null, record),
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

<style lang="less" scoped>
.flex{display: flex !important;}
</style>
