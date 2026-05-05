<template>
  <div class="document-page">
    <div class="page-header">
      <h1 class="page-title">我的文档</h1>
      <a-space>
        <a-button @click="createFolder">
          <FolderAddOutlined /> 新建文件夹
        </a-button>
        <a-button type="primary" @click="uploadDocument">
          <UploadOutlined /> 上传文档
        </a-button>
      </a-space>
    </div>

    <div class="document-toolbar">
      <a-breadcrumb>
        <a-breadcrumb-item>全部文件</a-breadcrumb-item>
        <a-breadcrumb-item>工作文档</a-breadcrumb-item>
      </a-breadcrumb>
      <a-space>
        <a-button type="text"><AppstoreOutlined /></a-button>
        <a-button type="text"><UnorderedListOutlined /></a-button>
      </a-space>
    </div>

    <div class="document-grid">
      <div v-for="doc in documents" :key="doc.id" class="document-card" @click="openDocument(doc)">
        <div class="document-icon">
          <FileOutlined v-if="doc.type === 'file'" />
          <FolderOutlined v-else />
        </div>
        <div class="document-name">{{ doc.name }}</div>
        <div class="document-meta">{{ doc.size }} · {{ doc.updateTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FolderAddOutlined,
  UploadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FileOutlined,
  FolderOutlined
} from '@ant-design/icons-vue';

const documents = ref([
  { id: '1', name: '项目计划书.docx', type: 'file', size: '2.5MB', updateTime: '2025-04-08' },
  { id: '2', name: '需求文档', type: 'folder', size: '-', updateTime: '2025-04-07' },
  { id: '3', name: '会议纪要', type: 'folder', size: '-', updateTime: '2025-04-06' },
  { id: '4', name: '财务报表.xlsx', type: 'file', size: '1.2MB', updateTime: '2025-04-05' },
  { id: '5', name: '产品原型.rp', type: 'file', size: '15MB', updateTime: '2025-04-04' }
]);

const createFolder = () => {
  console.log('新建文件夹');
};

const uploadDocument = () => {
  console.log('上传文档');
};

const openDocument = (doc: any) => {
  console.log('打开文档:', doc);
};
</script>

<style scoped>
.document-page {
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

.document-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.document-card {
  padding: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.document-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.document-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 12px;
}

.document-name {
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-meta {
  font-size: 12px;
  color: #8c8c8c;
}
</style>
