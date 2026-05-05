<template>
  <div class="recruit-page">
    <div class="page-header">
      <h1 class="page-title">招聘管理</h1>
      <a-button type="primary" @click="addPosition"><PlusOutlined /> 发布职位</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'"><a-tag :color="record.status === 'active' ? 'green' : 'default'">{{ record.status === 'active' ? '招聘中' : '已关闭' }}</a-tag></template>
        <template v-if="column.key === 'action'"><a-button type="link" @click="viewDetail(record)">查看</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
const columns = [{ title: '职位名称', dataIndex: 'title' }, { title: '部门', dataIndex: 'dept' }, { title: '招聘人数', dataIndex: 'count' }, { title: '已投递', dataIndex: 'applied' }, { title: '状态', key: 'status' }, { title: '发布日期', dataIndex: 'publishDate' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', title: '前端开发工程师', dept: '技术部', count: 3, applied: 25, status: 'active', publishDate: '2025-04-01' }, { id: '2', title: '产品经理', dept: '产品部', count: 1, applied: 18, status: 'active', publishDate: '2025-04-02' }]);
const addPosition = () => console.log('发布职位');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.recruit-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
