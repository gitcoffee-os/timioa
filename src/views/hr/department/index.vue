<template>
  <div class="department-page">
    <div class="page-header">
      <h1 class="page-title">部门管理</h1>
      <a-button type="primary" @click="addDepartment"><PlusOutlined /> 添加部门</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'"><a-button type="link" @click="editDepartment(record)">编辑</a-button><a-button type="link" danger @click="deleteDepartment(record)">删除</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
const columns = [{ title: '部门名称', dataIndex: 'name' }, { title: '部门编码', dataIndex: 'code' }, { title: '负责人', dataIndex: 'manager' }, { title: '人数', dataIndex: 'count' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', name: '技术部', code: 'TECH', manager: '张三', count: 25 }, { id: '2', name: '产品部', code: 'PRODUCT', manager: '李四', count: 12 }, { id: '3', name: '运营部', code: 'OPS', manager: '王五', count: 18 }]);
const addDepartment = () => console.log('添加部门');
const editDepartment = (record: any) => console.log('编辑', record);
const deleteDepartment = (record: any) => console.log('删除', record);
</script>
<style scoped>.department-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
