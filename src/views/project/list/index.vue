<template>
  <div class="project-list-page">
    <div class="page-header">
      <h1 class="page-title">项目列表</h1>
      <a-button type="primary" @click="createProject"><PlusOutlined /> 新建项目</a-button>
    </div>
    <div class="project-grid">
      <div v-for="project in projects" :key="project.id" class="project-card" @click="viewProject(project)">
        <div class="project-header">
          <h3 class="project-name">{{ project.name }}</h3>
          <a-tag :color="project.status === 'active' ? 'blue' : 'default'">{{ project.status === 'active' ? '进行中' : '已结束' }}</a-tag>
        </div>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-progress">
          <a-progress :percent="project.progress" size="small" />
        </div>
        <div class="project-meta">
          <span><CalendarOutlined /> {{ project.endDate }}截止</span>
          <span><TeamOutlined /> {{ project.members }}人</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons-vue';
const projects = ref([{ id: '1', name: 'OA系统升级', description: '企业OA系统全面升级项目', progress: 75, status: 'active', endDate: '2025-06-30', members: 12 }, { id: '2', name: '移动端APP开发', description: '公司移动端APP开发', progress: 45, status: 'active', endDate: '2025-08-15', members: 8 }, { id: '3', name: '数据中心建设', description: '企业数据中心建设项目', progress: 100, status: 'completed', endDate: '2025-03-31', members: 15 }]);
const createProject = () => console.log('新建项目');
const viewProject = (project: any) => console.log('查看项目', project);
</script>
<style scoped>.project-list-page { padding: 24px; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; } .page-title { font-size: 24px; font-weight: 600; margin: 0; } .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; } .project-card { padding: 20px; background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; cursor: pointer; transition: all 0.3s; } .project-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); } .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; } .project-name { font-size: 16px; font-weight: 500; margin: 0; } .project-desc { color: #8c8c8c; font-size: 13px; margin-bottom: 16px; height: 40px; overflow: hidden; } .project-progress { margin-bottom: 12px; } .project-meta { display: flex; gap: 16px; font-size: 12px; color: #8c8c8c; } .project-meta span { display: flex; align-items: center; gap: 4px; }</style>
