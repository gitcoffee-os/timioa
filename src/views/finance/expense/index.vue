<template>
  <div class="expense-page">
    <div class="page-header">
      <h1 class="page-title">费用报销</h1>
      <a-button type="primary" @click="applyExpense"><PlusOutlined /> 申请报销</a-button>
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
const columns = [{ title: '报销单号', dataIndex: 'code' }, { title: '报销类型', dataIndex: 'type' }, { title: '金额', key: 'amount' }, { title: '申请日期', dataIndex: 'date' }, { title: '状态', key: 'status' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', code: 'BX20250408001', type: '差旅费', amount: '2500.00', date: '2025-04-08', status: 'pending' }, { id: '2', code: 'BX20250407001', type: '办公用品', amount: '350.00', date: '2025-04-07', status: 'completed' }]);
const applyExpense = () => console.log('申请报销');
const viewDetail = (record: any) => console.log('查看', record);
</script>
<style scoped>.expense-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
