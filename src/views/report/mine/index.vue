<template>
  <div class="report-mine-page">
    <div class="page-header">
      <h1 class="page-title">我的汇报</h1>
      <a-button type="primary" @click="createReport"><PlusOutlined /> 写汇报</a-button>
    </div>
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="daily" tab="日报">
        <a-list :data-source="dailyReports">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title" :description="item.content.substring(0, 100) + '...'" />
              <template #actions>
                <span>{{ item.date }}</span>
                <a-button type="link" @click="viewReport(item)">查看</a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="weekly" tab="周报">
        <a-list :data-source="weeklyReports">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title" :description="item.content.substring(0, 100) + '...'" />
              <template #actions>
                <span>{{ item.date }}</span>
                <a-button type="link" @click="viewReport(item)">查看</a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="monthly" tab="月报">
        <a-empty description="暂无月报" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
const activeTab = ref('daily');
const dailyReports = ref([{ id: '1', title: '2025-04-08 工作日报', content: '1. 完成OA系统工作台页面开发\n2. 修复已知bug\n3. 参加项目评审会议', date: '2025-04-08' }]);
const weeklyReports = ref([{ id: '1', title: '2025年第14周工作周报', content: '本周主要完成工作台模块开发，包括...', date: '2025-04-06' }]);
const createReport = () => console.log('写汇报');
const viewReport = (item: any) => console.log('查看汇报', item);
</script>
<style scoped>.report-mine-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; }</style>
