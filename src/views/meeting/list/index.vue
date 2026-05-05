<template>
  <div class="meeting-list-page">
    <div class="page-header">
      <h1 class="page-title">会议列表</h1>
      <a-space>
        <a-radio-group v-model:value="viewMode" button-style="solid">
          <a-radio-button value="list">列表</a-radio-button>
          <a-radio-button value="calendar">日历</a-radio-button>
        </a-radio-group>
        <a-button type="primary" @click="createMeeting">
          <PlusOutlined /> 预定会议
        </a-button>
      </a-space>
    </div>

    <div v-if="viewMode === 'list'" class="meeting-list">
      <div v-for="meeting in meetings" :key="meeting.id" class="meeting-card">
        <div class="meeting-status" :class="meeting.status">
          {{ meeting.statusText }}
        </div>
        <div class="meeting-content">
          <h3 class="meeting-title">{{ meeting.title }}</h3>
          <div class="meeting-info">
            <span><ClockCircleOutlined /> {{ meeting.time }}</span>
            <span><EnvironmentOutlined /> {{ meeting.location }}</span>
            <span><UserOutlined /> {{ meeting.organizer }}</span>
          </div>
          <div class="meeting-participants">
            <a-avatar-group :max-count="5">
              <a-avatar v-for="p in meeting.participants" :key="p" :size="28">
                {{ p.charAt(0) }}
              </a-avatar>
            </a-avatar-group>
            <span class="participant-count">共 {{ meeting.participants.length }} 人</span>
          </div>
        </div>
        <div class="meeting-actions">
          <a-button type="primary" @click="joinMeeting(meeting)">加入会议</a-button>
          <a-button @click="viewDetail(meeting)">查看详情</a-button>
        </div>
      </div>
    </div>

    <div v-else class="meeting-calendar">
      <FullCalendar
        :options="calendarOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PlusOutlined, ClockCircleOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const viewMode = ref('list');

const meetings = ref([
  {
    id: '1',
    title: '产品需求评审会',
    time: '2025-04-08 10:00 - 11:30',
    location: '会议室A',
    organizer: '张三',
    participants: ['张三', '李四', '王五', '赵六', '钱七', '孙八'],
    status: 'upcoming',
    statusText: '即将开始'
  },
  {
    id: '2',
    title: '技术架构讨论会',
    time: '2025-04-08 14:00 - 15:30',
    location: '会议室B',
    organizer: '李四',
    participants: ['李四', '王五', '赵六'],
    status: 'upcoming',
    statusText: '即将开始'
  },
  {
    id: '3',
    title: '周会',
    time: '2025-04-08 16:00 - 17:00',
    location: '大会议室',
    organizer: '王五',
    participants: ['全员'],
    status: 'upcoming',
    statusText: '即将开始'
  }
]);

const calendarOptions = ref<any>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridDay',
  headerToolbar: false,
  locale: 'zh-cn',
  events: meetings.value.map(m => ({
    id: m.id,
    title: m.title,
    start: dayjs(m.time.split(' - ')[0]).format(),
    end: dayjs(m.time.split(' - ')[1]).format()
  }))
});

const createMeeting = () => {
  console.log('预定会议');
};

const joinMeeting = (meeting: any) => {
  console.log('加入会议:', meeting);
};

const viewDetail = (meeting: any) => {
  console.log('查看详情:', meeting);
};
</script>

<style scoped>
.meeting-list-page {
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

.meeting-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meeting-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.meeting-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.meeting-status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.meeting-status.upcoming {
  background: #e6f7ff;
  color: #1890ff;
}

.meeting-content {
  flex: 1;
}

.meeting-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.meeting-info {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  color: #8c8c8c;
  font-size: 13px;
}

.meeting-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meeting-participants {
  display: flex;
  align-items: center;
  gap: 12px;
}

.participant-count {
  font-size: 13px;
  color: #8c8c8c;
}

.meeting-actions {
  display: flex;
  gap: 8px;
}
</style>
