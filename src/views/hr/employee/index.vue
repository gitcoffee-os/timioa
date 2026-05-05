<template>
  <div class="employee-page">
    <div class="page-header">
      <h1 class="page-title">员工管理</h1>
      <a-space>
        <a-input-search v-model:value="searchKeyword" placeholder="搜索员工" style="width: 240px" />
        <a-button type="primary" @click="addEmployee"><PlusOutlined /> 添加员工</a-button>
      </a-space>
    </div>
    <a-table :columns="columns" :data-source="filteredData" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'"><a-avatar :src="record.avatar" size="small" /> {{ record.name }}</template>
        <template v-if="column.key === 'status'"><a-badge :status="record.status === 'active' ? 'success' : 'default'" :text="record.status === 'active' ? '在职' : '离职'" /></template>
        <template v-if="column.key === 'action'"><a-button type="link" @click="viewDetail(record)">查看</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
const searchKeyword = ref('');
const columns = [{ title: '姓名', key: 'name' }, { title: '工号', dataIndex: 'code' }, { title: '部门', dataIndex: 'dept' }, { title: '职位', dataIndex: 'position' }, { title: '入职日期', dataIndex: 'joinDate' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', name: '张三', code: 'T001', dept: '技术部', position: '高级工程师', joinDate: '2023-01-15', status: 'active', avatar: '' }, { id: '2', name: '李四', code: 'T002', dept: '产品部', position: '产品经理', joinDate: '2023-03-20', status: 'active', avatar: '' }]);
const filteredData = computed(() => searchKeyword.value ? data.value.filter(e => e.name.includes(searchKeyword.value) || e.code.includes(searchKeyword.value)) : data.value);
const addEmployee = () => console.log('添加员工');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.employee-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
