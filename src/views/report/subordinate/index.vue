<template>
  <div class="report-subordinate-page">
    <div class="page-header">
      <h1 class="page-title">下属汇报</h1>
      <a-select v-model:value="selectedMember" style="width: 160px" placeholder="选择下属">
        <a-select-option value="all">全部下属</a-select-option>
        <a-select-option value="1">张三</a-select-option>
        <a-select-option value="2">李四</a-select-option>
      </a-select>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'"><a-button type="link" @click="viewReport(record)">查看</a-button><a-button type="link" @click="commentReport(record)">点评</a-button></template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const selectedMember = ref('all');
const columns = [{ title: '汇报人', dataIndex: 'reporter' }, { title: '汇报类型', dataIndex: 'type' }, { title: '标题', dataIndex: 'title' }, { title: '提交时间', dataIndex: 'submitTime' }, { title: '操作', key: 'action' }];
const data = ref([{ id: '1', reporter: '张三', type: '日报', title: '2025-04-08 工作日报', submitTime: '2025-04-08 18:00' }, { id: '2', reporter: '李四', type: '周报', title: '2025年第14周周报', submitTime: '2025-04-06 18:00' }]);
const viewReport = (record: any) => console.log('查看', record);
const commentReport = (record: any) => console.log('点评', record);
</script>
<style scoped>.report-subordinate-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
