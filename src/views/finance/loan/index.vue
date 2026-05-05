<template>
  <div class="loan-page">
    <div class="page-header">
      <h1 class="page-title">借款申请</h1>
      <a-button type="primary" @click="applyLoan"><PlusOutlined /> 申请借款</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'"><span style="color: #ff4d4f; font-weight: 500;">¥{{ record.amount }}</span></template>
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
const columns = [{ title: '借款单号', dataIndex: 'code' }, { title: '借款事由', dataIndex: 'reason' }, { title: '金额', key: 'amount' }, { title: '申请日期', dataIndex: 'date' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', code: 'JK20250408001', reason: '项目备用金', amount: '5000.00', date: '2025-04-08', status: 'pending' }]);
const applyLoan = () => console.log('申请借款');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.loan-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
