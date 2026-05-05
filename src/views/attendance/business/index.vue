<template>
  <div class="business-page">
    <div class="page-header">
      <h1 class="page-title">出差申请</h1>
      <a-button type="primary" @click="applyBusiness">申请出差</a-button>
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
const columns = [{ title: '目的地', dataIndex: 'destination' }, { title: '开始日期', dataIndex: 'startDate' }, { title: '结束日期', dataIndex: 'endDate' }, { title: '天数', dataIndex: 'days' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', destination: '上海', startDate: '2025-04-15', endDate: '2025-04-18', days: 4, status: 'pending' }]);
const applyBusiness = () => console.log('申请出差');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.business-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
