<template>
  <div class="project-task-page">
    <div class="page-header">
      <h1 class="page-title">任务管理</h1>
      <a-button type="primary" @click="createTask"><PlusOutlined /> 新建任务</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'priority'"><a-tag :color="record.priority === 'high' ? 'red' : record.priority === 'medium' ? 'orange' : 'green'">{{ record.priority === 'high' ? '高' : record.priority === 'medium' ? '中' : '低' }}</a-tag></template>
        <template v-if="column.key === 'status'"><TimiStatusTag :status="record.status" /></template>
        <template v-if="column.key === 'action'"><a-button type="link" @click="viewDetail(record)">查看</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { TimiStatusTag } from '@gitcoffee/timioa-ui';
const columns = [{ title: '任务名称', dataIndex: 'name' }, { title: '所属项目', dataIndex: 'project' }, { title: '负责人', dataIndex: 'assignee' }, { title: '截止日期', dataIndex: 'deadline' }, { title: '优先级', key: 'priority' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', name: '需求分析', project: 'OA系统升级', assignee: '张三', deadline: '2025-04-15', priority: 'high', status: 'in_progress' }, { id: '2', name: 'UI设计', project: '移动端APP开发', assignee: '李四', deadline: '2025-04-20', priority: 'medium', status: 'pending' }]);
const createTask = () => console.log('新建任务');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.project-task-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
