<template>
  <div class="report-statistics-page">
    <div class="page-header">
      <h1 class="page-title">汇报统计</h1>
      <a-range-picker v-model:value="dateRange" />
    </div>
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-value">98%</div>
        <div class="stat-label">提交率</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">156</div>
        <div class="stat-label">汇报总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">142</div>
        <div class="stat-label">已点评</div>
      </div>
    </div>
    <TimiCard title="提交趋势" class="chart-card">
      <div ref="chartRef" style="height: 300px;"></div>
    </TimiCard>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { TimiCard } from '@gitcoffee/timioa-ui';
const dateRange = ref([dayjs().subtract(30, 'day'), dayjs()]);
const chartRef = ref<HTMLElement>();
</script>
<style scoped>.report-statistics-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; } .stats-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px; } .stat-card { background: #fff; padding: 24px; border-radius: 8px; text-align: center; border: 1px solid #f0f0f0; } .stat-value { font-size: 36px; font-weight: 600; color: #1890ff; margin-bottom: 8px; } .stat-label { color: #8c8c8c; } .chart-card { margin: 0; }</style>
