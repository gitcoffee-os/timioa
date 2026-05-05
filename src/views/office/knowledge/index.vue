<template>
  <div class="knowledge-page">
    <div class="page-header">
      <h1 class="page-title">知识库</h1>
      <a-space>
        <a-input-search v-model:value="searchKeyword" placeholder="搜索知识" style="width: 240px" />
        <a-button type="primary" @click="createArticle">
          <PlusOutlined /> 新建文章
        </a-button>
      </a-space>
    </div>

    <div class="knowledge-layout">
      <div class="knowledge-categories">
        <a-menu v-model:selectedKeys="selectedCategory" mode="inline">
          <a-menu-item key="all">
            <FolderOutlined /> 全部知识
          </a-menu-item>
          <a-menu-item key="product">
            <FileTextOutlined /> 产品文档
          </a-menu-item>
          <a-menu-item key="tech">
            <CodeOutlined /> 技术文档
          </a-menu-item>
          <a-menu-item key="operation">
            <TeamOutlined /> 运营手册
          </a-menu-item>
          <a-menu-item key="hr">
            <UserOutlined /> 人事制度
          </a-menu-item>
        </a-menu>
      </div>

      <div class="knowledge-content">
        <a-list :data-source="articles" :loading="loading">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a @click="viewArticle(item)">{{ item.title }}</a>
                </template>
                <template #description>
                  <div class="article-summary">{{ item.summary }}</div>
                  <div class="article-meta">
                    <span><UserOutlined /> {{ item.author }}</span>
                    <span><ClockCircleOutlined /> {{ item.updateTime }}</span>
                    <span><EyeOutlined /> {{ item.viewCount }}</span>
                    <span><LikeOutlined /> {{ item.likeCount }}</span>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  PlusOutlined,
  FolderOutlined,
  FileTextOutlined,
  CodeOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined
} from '@ant-design/icons-vue';

const searchKeyword = ref('');
const selectedCategory = ref(['all']);
const loading = ref(false);

const articles = ref([
  { id: '1', title: '产品需求文档编写规范', summary: '本文档详细说明了如何编写规范的产品需求文档，包括模板、流程和注意事项。', author: '产品经理', updateTime: '2025-04-08', viewCount: 256, likeCount: 32 },
  { id: '2', title: '前端开发规范V2.0', summary: '前端代码规范、组件开发规范、Git提交规范等。', author: '技术负责人', updateTime: '2025-04-07', viewCount: 189, likeCount: 28 },
  { id: '3', title: '新员工入职指南', summary: '欢迎加入公司！本文档将帮助你快速了解公司文化、规章制度和工作流程。', author: 'HR', updateTime: '2025-04-06', viewCount: 342, likeCount: 45 },
  { id: '4', title: '项目管理最佳实践', summary: '分享项目管理中的经验教训和最佳实践。', author: '项目经理', updateTime: '2025-04-05', viewCount: 128, likeCount: 18 },
  { id: '5', title: 'API接口文档', summary: '系统API接口详细说明文档。', author: '后端开发', updateTime: '2025-04-04', viewCount: 567, likeCount: 89 }
]);

const createArticle = () => {
  console.log('新建文章');
};

const viewArticle = (item: any) => {
  console.log('查看文章:', item);
};
</script>

<style scoped>
.knowledge-page {
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

.knowledge-layout {
  display: flex;
  gap: 24px;
}

.knowledge-categories {
  width: 240px;
  flex-shrink: 0;
}

.knowledge-content {
  flex: 1;
}

.article-summary {
  color: #595959;
  margin-bottom: 8px;
}

.article-meta {
  display: flex;
  gap: 16px;
  color: #8c8c8c;
  font-size: 13px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
