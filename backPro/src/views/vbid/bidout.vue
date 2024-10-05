<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="出价列表">
          滴滴答滴滴答
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
      <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template>
      </BasicTable>
    </n-card>    
    <sliderWindow ref="sliderWindowRef" @emitreloadTable="reloadTable"  :title="createSliderTitle" />

  </div>
</template>

<script lang="ts" setup>

  import { reactive, ref, unref, h, onMounted} from 'vue';   
  import { useMessage } from 'naive-ui';
  import { getBidTableList } from "@/api/bid/lists";
  import { BasicTable, TableAction } from '@/components/Table';
  import { getMenuList } from '@/api/system/menu';
  import { columns } from './bidout';
  import { useRouter } from 'vue-router'; 
  import sliderWindow from './sliderWindow.vue';
  const createSliderTitle = '操作项';
  const sliderWindowRef = ref();
  const router = useRouter();
  const message = useMessage();
  const actionRef = ref();  
  const treeData = ref([]);
  const expandedKeys = ref([]);
  const params = reactive({
    pageSize: 5,
    name: 'xiaoMa',
  }); 
  const openCreateDrawer = async (data)=> {
      const { openDrawer } = sliderWindowRef.value; 
      openDrawer(data);
  }
  async function handleOpera(record: Recordable) {    
      openCreateDrawer(record);   
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


  const loadDataTable = async (res: any) => {
    let _params = {
      ...unref(params),
      ...res,bidType:2
    };    
    return await getBidTableList(_params);
  };

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }
  onMounted(async () => {
    const treeMenuList = await getMenuList();
    expandedKeys.value = treeMenuList.list.map((item) => item.key);
    treeData.value = treeMenuList.list;
  });
</script>

<style lang="less" scoped></style>
