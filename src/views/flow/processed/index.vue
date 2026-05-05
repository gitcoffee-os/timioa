<template>
  <div class="flow-processed-page">
    <div class="page-header">
      <h1 class="page-title">已审批</h1>
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索审批单"
        style="width: 240px"
        @search="handleSearch"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredData"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag :color="getTypeColor(record.type)">{{ record.typeName }}</a-tag>
        </template>
        <template v-else-if="column.key === 'result'">
          <a-tag :color="record.result === 'agree' ? 'success' : 'error'">
            {{ record.result === 'agree' ? '已通过' : '已驳回' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="viewDetail(record)">查看</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchKeyword = ref('');
const loading = ref(false);

const columns = [
  { title: '审批单号', dataIndex: 'code', key: 'code' },
  { title: '审批类型', dataIndex: 'typeName', key: 'type' },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
  { title: '申请时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '审批结果', dataIndex: 'result', key: 'result' },
  { title: '审批时间', dataIndex: 'processTime', key: 'processTime' },
  { title: '操作', key: 'action', width: 100 }
];

const data = ref([
  { id: '1', code: 'SP20250407001', type: 'leave', typeName: '请假申请', applicant: '张三', createTime: '2025-04-07 09:30', title: '请假2天', result: 'agree', processTime: '2025-04-07 10:15' },
  { id: '2', code: 'SP20250407002', type: 'expense', typeName: '费用报销', applicant: '李四', createTime: '2025-04-07 10:15', title: '差旅费报销1500元', result: 'reject', processTime: '2025-04-07 11:00' },
  { id: '3', code: 'SP20250406001', type: 'overtime', typeName: '加班申请', applicant: '王五', createTime: '2025-04-06 11:00', title: '周末加班申请', result: 'agree', processTime: '2025-04-06 14:20' }
]);

const pagination = {
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
};

const filteredData = computed(() => {
  if (!searchKeyword.value) return data.value;
  return data.value.filter(item =>
    item.title.includes(searchKeyword.value) ||
    item.applicant.includes(searchKeyword.value) ||
    item.code.includes(searchKeyword.value)
  );
});

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    leave: 'blue',
    expense: 'green',
    overtime: 'orange',
    business: 'purple'
  };
  return colors[type] || 'default';
};

const handleSearch = () => {
  // 搜索处理
};

const viewDetail = (record: any) => {
  console.log('查看详情:', record);
};
</script>

<style scoped>
.flow-processed-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
</style>
