<template>
    <div>
      <div class="n-layout-page-header">
        <n-card :bordered="false" title="web配置管理">           
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
          <template #tableTitle>
            <n-button type="primary" @click="newConfig">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              添加配置
            </n-button>
          </template>
  
          <template #action>
            <TableAction />
          </template>
        </BasicTable>
      </n-card>
  
      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="editRoleTitle">
        <div class="py-3 menu-list">
          <n-tree
            block-line
            cascade
            checkable
            :virtual-scroll="true"
            :data="treeData"
            :expandedKeys="expandedKeys"
            :checked-keys="checkedKeys"
            style="max-height: 950px; overflow: hidden"
            @update:checked-keys="checkedTree"
            @update:expanded-keys="onExpandedKeys"
          />
        </div>
        <template #action>
          <n-space>
            <n-button type="info" ghost icon-placement="left" @click="packHandle">
              全部{{ expandedKeys.length ? '收起' : '展开' }}
            </n-button>
  
            <n-button type="info" ghost icon-placement="left" @click="checkedAllHandle">
              全部{{ checkedAll ? '取消' : '选择' }}
            </n-button>
            <n-button type="primary" :loading="formBtnLoading" @click="confirmForm">提交</n-button>
          </n-space>
        </template>
      </n-modal>

      <CreateConfig ref="createConfigRef"  @minireloadTable="reloadTable" :title="drawerTitle" />
      <OperaConfig ref="operaConfigRef"  @minireloadTable="reloadTable" :title="operaConfigTitle" />

    </div>
  </template>
  
  <script lang="ts" setup>
  
    import { reactive, ref, unref, h, onMounted} from 'vue';   
    import { useMessage } from 'naive-ui';
    import { BasicTable, TableAction } from '@/components/Table';
    import { getWebConfigList,updateWebConfigOpen,updateWebConfigClose,deletewebconfig ,initWebconfig,clearWebconfig} from '@/api/system/config';
    import { getMenuList } from '@/api/system/menu';
    import { columns } from './columns';
    import { PlusOutlined } from '@vicons/antd';
    import { getTreeAll } from '@/utils';
    import { useRouter } from 'vue-router'; 
    import CreateConfig from './createConfig.vue';
    import OperaConfig from './operaConfig.vue';
    const drawerTitle = '添加配置项';
    const createConfigRef = ref();

    const operaConfigTitle = '修改';
    const operaConfigRef = ref();

    const router = useRouter();
    const formRef: any = ref(null);
    const message = useMessage();
    const actionRef = ref();
  
    const showModal = ref(false);
    const formBtnLoading = ref(false);
    const checkedAll = ref(false);
    const editRoleTitle = ref('');
    const treeData = ref([]);
    const expandedKeys = ref([]);
    const checkedKeys = ref(['console', 'step-form']);
  
    const params = reactive({
      pageSize: 5,
      name: 'xiaoMa',
    });
    
    const newConfig = ()=>{
        console.log("新添加")   
        openCreateDrawer()     
    }
    const openCreateDrawer = async ()=> {
        const { openDrawer } = createConfigRef.value; 
        openDrawer();
    }

    const openChangeConfigDrawer = async (items:any)=> {
        const { openDrawer } = operaConfigRef.value; 
        openDrawer(items);
    }


    const handleOpera = async (items:any) =>{
      openChangeConfigDrawer(items)
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
  
 
    const loadDataTable = async (res: any) => {
      let _params = {
        ...unref(params),
        ...res,
      };    
      return await getWebConfigList(_params);
    };
  
    function onCheckedRow(rowKeys: any[]) {
      console.log(rowKeys);
    }
  
    function reloadTable() {
      actionRef.value.reload();
    }
  
    function confirmForm(e: any) {
      e.preventDefault();
      formBtnLoading.value = true;
      formRef.value.validate((errors) => {
        if (!errors) {
          message.success('新建成功');
          setTimeout(() => {
            showModal.value = false;
            reloadTable();
          });
        } else {
          message.error('请填写完整信息');
        }
        formBtnLoading.value = false;
      });
    }
  
    async function handleOpen(record: Recordable) {      
      if(record.cenable) {
        message.info('已经开启过了');
        return true;
      }else{
        let backjson = await updateWebConfigOpen({id:record.id,cenable:true})     
        if(backjson) record.cenable = !record.cenable
        message.info('操作成功');
      }    
    }
  
    async function handleClose(record: Recordable) {
      // if(!record.cenable) {
      //   message.info('已经禁用了');
      //   return true;
      // }else{
        let backjson = await  updateWebConfigClose({id:record.id,cenable:false})
        if(backjson) record.cenable = !record.cenable
        message.info('操作成功');
      //}
    }
  
    function handleMenuAuth(record: Recordable) {
      editRoleTitle.value = `分配 ${record.name} 的菜单权限`;
      checkedKeys.value = record.menu_keys;
      showModal.value = true;
    }
  
    function checkedTree(keys) {
      checkedKeys.value = [checkedKeys.value, ...keys];
    }
  
    function onExpandedKeys(keys) {
      expandedKeys.value = keys;
    }
  
    function packHandle() {
      if (expandedKeys.value.length) {
        expandedKeys.value = [];
      } else {
        expandedKeys.value = treeData.value.map((item: any) => item.key) as [];
      }
    }
  
    function checkedAllHandle() {
      if (!checkedAll.value) {
        checkedKeys.value = getTreeAll(treeData.value);
        checkedAll.value = true;
      } else {
        checkedKeys.value = [];
        checkedAll.value = false;
      }
    }
  
    const defaultBtn = async()=>{
      await initWebconfig();     
      message.success('初始化完成')
      reloadTable()
    }
    const clearBtn = async () =>{
      await clearWebconfig();     
      message.success('清空完成')
      reloadTable()
    }
    onMounted(async () => {
      const treeMenuList = await getMenuList();
      expandedKeys.value = treeMenuList.list.map((item) => item.key);
      treeData.value = treeMenuList.list;
    });
  </script>
  
  <style lang="less" scoped></style>
  