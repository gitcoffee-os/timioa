<template>
  <div class="leave-page">
    <div class="page-header">
      <h1 class="page-title">请假申请</h1>
      <a-button type="primary" @click="applyLeave">申请请假</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'"><TimiStatusTag :status="record.status" /></template>
        <template v-if="column.key === 'action'"><a-button type="link" @click="viewDetail(record)">查看</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { TimiStatusTag } from '@gitcoffee/timioa-ui';
const columns = [{ title: '请假类型', dataIndex: 'type' }, { title: '开始时间', dataIndex: 'startTime' }, { title: '结束时间', dataIndex: 'endTime' }, { title: '天数', dataIndex: 'days' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', type: '年假', startTime: '2025-04-10', endTime: '2025-04-12', days: 3, status: 'pending' }]);
const applyLeave = () => console.log('申请请假');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.leave-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
