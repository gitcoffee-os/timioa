<template>
  <div class="meeting-minutes-page">
    <div class="page-header">
      <h1 class="page-title">会议纪要</h1>
      <a-button type="primary" @click="createMinutes">
        <PlusOutlined /> 新建纪要
      </a-button>
    </div>

    <a-list :data-source="minutesList" :loading="loading">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a @click="viewMinutes(item)">{{ item.title }}</a>
            </template>
            <template #description>
              <div class="minutes-meta">
                <span><CalendarOutlined /> {{ item.meetingDate }}</span>
                <span><UserOutlined /> 记录人：{{ item.recorder }}</span>
                <span><TeamOutlined /> {{ item.participants.length }}人参会</span>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button type="link" @click="viewMinutes(item)">查看</a-button>
            <a-button type="link" @click="editMinutes(item)">编辑</a-button>
            <a-button type="link" danger @click="deleteMinutes(item)">删除</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined, CalendarOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons-vue';

const loading = ref(false);

const minutesList = ref([
  { id: '1', title: '产品需求评审会议纪要', meetingDate: '2025-04-08', recorder: '张三', participants: ['张三', '李四', '王五'] },
  { id: '2', title: '技术架构讨论会议纪要', meetingDate: '2025-04-07', recorder: '李四', participants: ['李四', '王五', '赵六'] },
  { id: '3', title: '周会纪要', meetingDate: '2025-04-06', recorder: '王五', participants: ['全员'] }
]);

const createMinutes = () => {
  console.log('新建纪要');
};

const viewMinutes = (item: any) => {
  console.log('查看纪要:', item);
};

const editMinutes = (item: any) => {
  console.log('编辑纪要:', item);
};

const deleteMinutes = (item: any) => {
  console.log('删除纪要:', item);
};
</script>

<style scoped>
.meeting-minutes-page {
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

.minutes-meta {
  display: flex;
  gap: 16px;
  color: #8c8c8c;
  font-size: 13px;
}

.minutes-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
