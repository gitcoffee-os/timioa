<template>
  <div class="overtime-page">
    <div class="page-header">
      <h1 class="page-title">加班申请</h1>
      <a-button type="primary" @click="applyOvertime">申请加班</a-button>
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
const columns = [{ title: '加班日期', dataIndex: 'date' }, { title: '开始时间', dataIndex: 'startTime' }, { title: '结束时间', dataIndex: 'endTime' }, { title: '时长', dataIndex: 'hours' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', date: '2025-04-08', startTime: '18:00', endTime: '21:00', hours: 3, status: 'pending' }]);
const applyOvertime = () => console.log('申请加班');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.overtime-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
