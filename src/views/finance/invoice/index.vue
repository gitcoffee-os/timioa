<template>
  <div class="invoice-page">
    <div class="page-header">
      <h1 class="page-title">发票管理</h1>
      <a-space>
        <a-input-search v-model:value="searchKeyword" placeholder="搜索发票" style="width: 240px" />
        <a-button type="primary" @click="uploadInvoice"><UploadOutlined /> 上传发票</a-button>
      </a-space>
    </div>
    <a-table :columns="columns" :data-source="filteredData" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'"><span style="color: #ff4d4f; font-weight: 500;">¥{{ record.amount }}</span></template>
        <template v-if="column.key === 'action'"><a-button type="link" @click="viewDetail(record)">查看</a-button><a-button type="link" danger @click="deleteInvoice(record)">删除</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
const searchKeyword = ref('');
const columns = [{ title: '发票代码', dataIndex: 'code' }, { title: '发票号码', dataIndex: 'number' }, { title: '开票日期', dataIndex: 'date' }, { title: '金额', key: 'amount' }, { title: '销售方', dataIndex: 'seller' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', code: '011001900211', number: '12345678', date: '2025-04-08', amount: '2500.00', seller: '某某科技有限公司' }, { id: '2', code: '011001900211', number: '87654321', date: '2025-04-07', amount: '350.00', seller: '办公用品商店' }]);
const filteredData = computed(() => searchKeyword.value ? data.value.filter(i => i.number.includes(searchKeyword.value) || i.seller.includes(searchKeyword.value)) : data.value);
const uploadInvoice = () => console.log('上传发票');
const viewDetail = (record: any) => console.log('查看', record);
const deleteInvoice = (record: any) => console.log('删除', record);
</script>
<style scoped>.invoice-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
