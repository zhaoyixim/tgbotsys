<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="类别">         
         <n-button type="primary" @click="classOpera">
           <template #icon>
             <n-icon>
               <PlusOutlined />
             </n-icon>
           </template>
           新建
         </n-button>
         
      </n-card>
    </div>

  <n-card :bordered="false" class="proCard">
    <BasicTable
      title="游戏发布"
      titleTooltip="游戏发布"
      :columns="columns"
      :request="loadDataTable"
      :actionColumn="actionColumn"      
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

  <classlistAdd ref="classlistaddRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />
  <classlistEdit ref="classlisteditRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />


</div>
</template>

<script lang="ts" setup>
  import { reactive, ref,h, onMounted, unref } from 'vue';
  import { getGameItemList,deleteClassItem } from "@/api/trade/lists";
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './classlist';
  import { useMessage } from 'naive-ui';
  import { getMenuList ,operaShow} from '@/api/system/menu';
  import classlistAdd from './classlistadd.vue';
  import classlistEdit from './classlistedit.vue';
  
  const createSliderTitle = "操作项"
  const classlistaddRef = ref();  
  const classlisteditRef = ref();  

  const message = useMessage();
  const actionRef = ref();
  const treeData = ref([]);
  const expandedKeys = ref([]);
  const params = reactive({    
    pageSize: 5,
    name: 'xiaoMa',
  });
  const openCreateDrawer = async ( data )=> {
    const { openDrawer } = classlistaddRef.value;
    openDrawer(data); 
  }

  const classOpera = () => {
    openCreateDrawer({})
    
  }
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

    let returnJoson = await getGameItemList(_params);
    return returnJoson;
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }
     
   async function handleDelete(record: Recordable) {    
      // await operaShow({
      //  mid:record.id,
      // })
       await deleteClassItem({id:record.id})      
      reloadTable()
  }  
async function handleEdit(record: Recordable) {
    
      const { openDrawer } = classlisteditRef.value;
      openDrawer(record); 
      //reloadTable()
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
              label: '删除',
              onClick: handleDelete.bind(null, record),
              // 根据业务控制是否显示 isShow 和 auth 是并且关系
              ifShow: () => {              
                 return true;
              },
              // 根据权限控制是否显示: 有权限，会显示，支持多个
              auth: ['basic_list'],
            },
            {
              label: '修改',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {                
                 return true;               
              },
              auth: ['basic_list'],
            },
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
