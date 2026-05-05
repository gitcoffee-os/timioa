<template>
  <div class="project-board-page">
    <div class="page-header">
      <h1 class="page-title">项目看板</h1>
      <a-select v-model:value="selectedProject" style="width: 200px" placeholder="选择项目">
        <a-select-option value="1">OA系统升级</a-select-option>
        <a-select-option value="2">移动端APP开发</a-select-option>
      </a-select>
    </div>
    <div class="board-container">
      <div v-for="column in boardColumns" :key="column.key" class="board-column">
        <div class="column-header">
          <span class="column-title">{{ column.title }}</span>
          <span class="column-count">{{ column.tasks.length }}</span>
        </div>
        <div class="column-content">
          <div v-for="task in column.tasks" :key="task.id" class="task-card">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-meta">
              <a-tag size="small" :color="task.priority === 'high' ? 'red' : 'green'">{{ task.priority === 'high' ? '高' : '低' }}</a-tag>
              <a-avatar :size="20">{{ task.assignee.charAt(0) }}</a-avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const selectedProject = ref('1');
const boardColumns = ref([
  { key: 'todo', title: '待办', tasks: [{ id: '1', title: '需求文档编写', priority: 'high', assignee: '张三' }, { id: '2', title: '技术方案设计', priority: 'medium', assignee: '李四' }] },
  { key: 'in_progress', title: '进行中', tasks: [{ id: '3', title: '前端页面开发', priority: 'high', assignee: '王五' }] },
  { key: 'done', title: '已完成', tasks: [{ id: '4', title: '项目立项', priority: 'low', assignee: '赵六' }] }
]);
</script>
<style scoped>.project-board-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; } .board-container { display: flex; gap: 16px; overflow-x: auto; } .board-column { width: 300px; flex-shrink: 0; background: #f5f5f5; border-radius: 8px; padding: 16px; } .column-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } .column-title { font-weight: 500; } .column-count { background: #d9d9d9; padding: 2px 8px; border-radius: 10px; font-size: 12px; } .column-content { display: flex; flex-direction: column; gap: 12px; } .task-card { background: #fff; padding: 12px; border-radius: 6px; cursor: pointer; transition: all 0.3s; } .task-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); } .task-title { font-size: 14px; margin-bottom: 8px; } .task-meta { display: flex; justify-content: space-between; align-items: center; }</style>
