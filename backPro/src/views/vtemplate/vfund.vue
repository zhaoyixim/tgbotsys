<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="充值列表">
          滴滴答滴滴答
      </n-card>
    </div> 
    <n-card :bordered="false" class="proCard">
      <BasicTable
        title="表格列表"
        titleTooltip="这是一个提示"
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
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref,h, onMounted } from 'vue';
  import { getFundTableList } from '@/api/vtemp/lists';
  import { columns } from './vfund';
  import { BasicTable } from '@/components/Table';
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
      record.editValueRefs.name4.value = `${value}`;
    }
    console.log(column, value, record);
  }

  const loadDataTable = async (res) => {
    return await getFundTableList({ ...params, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    console.log(actionRef.value);
    actionRef.value.reload();
  }
  onMounted(async () => {
    const treeMenuList = await getMenuList();
    expandedKeys.value = treeMenuList.list.map((item) => item.key);
    treeData.value = treeMenuList.list;
  });

</script>

<style lang="less" scoped></style>
