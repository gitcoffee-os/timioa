<template>
  <div class="flow-initiated-page">
    <div class="page-header">
      <h1 class="page-title">我发起的</h1>
      <a-space>
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索审批单"
          style="width: 240px"
          @search="handleSearch"
        />
        <a-select v-model:value="filterStatus" placeholder="审批状态" style="width: 140px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="pending">审批中</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
          <a-select-option value="rejected">已驳回</a-select-option>
        </a-select>
      </a-space>
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
        <template v-else-if="column.key === 'status'">
          <TimiStatusTag :status="record.status" />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="viewDetail(record)">查看</a-button>
            <a-button v-if="record.status === 'rejected'" type="link" size="small" @click="reapply(record)">重新申请</a-button>
            <a-button v-if="record.status === 'pending'" type="link" danger size="small" @click="withdraw(record)">撤回</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TimiStatusTag } from '@gitcoffee/timioa-ui';

const searchKeyword = ref('');
const filterStatus = ref('');
const loading = ref(false);

const columns = [
  { title: '审批单号', dataIndex: 'code', key: 'code' },
  { title: '审批类型', dataIndex: 'typeName', key: 'type' },
  { title: '申请时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '当前审批人', dataIndex: 'currentApprover', key: 'currentApprover' },
  { title: '操作', key: 'action', width: 200 }
];

const data = ref([
  { id: '1', code: 'SP20250408001', type: 'leave', typeName: '请假申请', createTime: '2025-04-08 09:30', title: '请假3天', status: 'pending', currentApprover: '王经理' },
  { id: '2', code: 'SP20250407001', type: 'expense', typeName: '费用报销', createTime: '2025-04-07 10:15', title: '差旅费报销2500元', status: 'completed', currentApprover: '-' },
  { id: '3', code: 'SP20250406001', type: 'overtime', typeName: '加班申请', createTime: '2025-04-06 11:00', title: '周末加班申请', status: 'rejected', currentApprover: '-' },
  { id: '4', code: 'SP20250405001', type: 'business', typeName: '出差申请', createTime: '2025-04-05 14:20', title: '上海出差申请', status: 'pending', currentApprover: '李总监' }
]);

const pagination = {
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
};

const filteredData = computed(() => {
  let result = data.value;
  if (searchKeyword.value) {
    result = result.filter(item =>
      item.title.includes(searchKeyword.value) ||
      item.code.includes(searchKeyword.value)
    );
  }
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value);
  }
  return result;
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

const reapply = (record: any) => {
  console.log('重新申请:', record);
};

const withdraw = (record: any) => {
  console.log('撤回:', record);
};
</script>

<style scoped>
.flow-initiated-page {
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
