<template>
  <div class="announcement-page">
    <div class="page-header">
      <h1 class="page-title">通知公告</h1>
      <a-space>
        <a-input-search v-model:value="searchKeyword" placeholder="搜索公告" style="width: 240px" />
        <a-button type="primary" @click="createAnnouncement">
          <PlusOutlined /> 发布公告
        </a-button>
      </a-space>
    </div>

    <a-list :data-source="announcements" :loading="loading">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <div class="announcement-title">
                <a-tag v-if="item.isTop" color="red">置顶</a-tag>
                <a-tag v-if="item.isUrgent" color="orange">紧急</a-tag>
                <a @click="viewDetail(item)">{{ item.title }}</a>
              </div>
            </template>
            <template #description>
              <div class="announcement-meta">
                <span><UserOutlined /> {{ item.author }}</span>
                <span><ClockCircleOutlined /> {{ item.createTime }}</span>
                <span><EyeOutlined /> {{ item.viewCount }} 阅读</span>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button type="link" @click="viewDetail(item)">查看</a-button>
            <a-button type="link" @click="editAnnouncement(item)">编辑</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined, UserOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons-vue';

const searchKeyword = ref('');
const loading = ref(false);

const announcements = ref([
  { id: '1', title: '关于2025年五一劳动节放假安排的通知', author: '行政部', createTime: '2025-04-08', viewCount: 256, isTop: true, isUrgent: false },
  { id: '2', title: '公司新版OA系统上线通知', author: 'IT部', createTime: '2025-04-07', viewCount: 189, isTop: true, isUrgent: false },
  { id: '3', title: '关于调整上下班时间的通知', author: '行政部', createTime: '2025-04-06', viewCount: 342, isTop: false, isUrgent: false },
  { id: '4', title: '2025年第一季度绩效考核通知', author: '人力资源部', createTime: '2025-04-05', viewCount: 128, isTop: false, isUrgent: true },
  { id: '5', title: '关于举办员工生日会的通知', author: '行政部', createTime: '2025-04-04', viewCount: 89, isTop: false, isUrgent: false }
]);

const createAnnouncement = () => {
  console.log('发布公告');
};

const viewDetail = (item: any) => {
  console.log('查看详情:', item);
};

const editAnnouncement = (item: any) => {
  console.log('编辑公告:', item);
};
</script>

<style scoped>
.announcement-page {
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

.announcement-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.announcement-meta {
  display: flex;
  gap: 16px;
  color: #8c8c8c;
  font-size: 13px;
}

.announcement-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
