<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="类别匹配">         
         <n-button type="primary" @click="classOpera">
           <template #icon>
             <n-icon>
               <PlusOutlined />
             </n-icon>
           </template>
           新建
         </n-button>
         <br><br>
         是否限制付款数量(is_limit_N字段) <br>
         0-默认-付款数量等于预设总数则游戏结束，<br>
         1-第二种模式，不限制付款总数，手动完成游戏<br>
         3-手动设置，与game_limit_list 的pay_count配合,pay_count设置了付款总数<br>
      </n-card>
    </div>

  <n-card :bordered="false" class="proCard">
    <BasicTable
      title="类别匹配"
      titleTooltip="类别匹配"
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

  <botsettingAdd ref="classlistaddRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />

 <botsettingEdit ref="classlisteditRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />

</div>
</template>

<script lang="ts" setup>
  import { reactive, ref,h, onMounted, unref } from 'vue';
  import { getBotSettingList ,updateBotSetting } from "@/api/trade/lists";
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './botsetting';
  import { useMessage } from 'naive-ui';
  import { getMenuList ,operaShow} from '@/api/system/menu';
  import botsettingAdd from './botsettingadd.vue';
  import botsettingEdit from './botsettingedit.vue';

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

    let returnJoson = await getBotSettingList(_params);
    return returnJoson;
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }
  
  const openChangeConfigDrawer = async (items:any)=> {
      const { openDrawer } = classlisteditRef.value; 
      openDrawer(items);
  }
  const handleOpera = async (items:any) =>{
      openChangeConfigDrawer(items)
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
              label: '启用',
              onClick: handleOpen.bind(null, record),
              ifShow: () => {               
                return true;
              },
              auth: ['basic_list'],
            },
            {
              label: '禁用',
              onClick: handleClose.bind(null, record),
              // 根据业务控制是否显示 isShow 和 auth 是并且关系
              ifShow: () => {              
                 return true;
              },
              // 根据权限控制是否显示: 有权限，会显示，支持多个
              auth: ['basic_list'],
            },       
            
            {
              label: '修改',
              onClick: handleOpera.bind(null, record),
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
  
  
  async function handleClose(record: Recordable) {
    // if(!record.cenable) {
    //   message.info('已经禁用了');
    //   return true;
    // }else{
      let backjson = await  updateBotSetting({id:record.id,ctype:2})
      if(backjson) record.cenable = !record.cenable
      reloadTable();
      message.info('操作成功');
    //}
  }
  async function handleOpen(record: Recordable) {      
    if(record.cenable) {
      message.info('已经开启过了');
      return true;
    }else{
      let backjson = await updateBotSetting({id:record.id,ctype:1})     
      if(backjson) record.cenable = !record.cenable
      message.info('操作成功');
      reloadTable();
    }    
  }
  
  

</script>

<style lang="less" scoped>
.flex{display: flex !important;}
</style>
