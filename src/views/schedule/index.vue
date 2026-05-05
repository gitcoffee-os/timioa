<template>
  <div class="schedule-page">
    <div class="page-header">
      <h1 class="page-title">日程计划</h1>
      <a-space>
        <a-button @click="changeView('dayGridMonth')">月</a-button>
        <a-button @click="changeView('timeGridWeek')">周</a-button>
        <a-button @click="changeView('timeGridDay')">日</a-button>
        <a-button type="primary" @click="createEvent">
          <PlusOutlined /> 新建日程
        </a-button>
      </a-space>
    </div>

    <div class="schedule-content">
      <div class="schedule-calendar">
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
        />
      </div>

      <div class="schedule-sidebar">
        <TimiCard title="今日日程" class="schedule-today">
          <div class="today-list">
            <div
              v-for="event in todayEvents"
              :key="event.id"
              class="today-item"
              :style="{ borderLeftColor: event.color }"
              @click="editEvent(event)"
            >
              <div class="today-time">{{ event.time }}</div>
              <div class="today-title">{{ event.title }}</div>
              <div class="today-location" v-if="event.location">
                <EnvironmentOutlined /> {{ event.location }}
              </div>
            </div>
            <a-empty v-if="todayEvents.length === 0" description="今日暂无日程" />
          </div>
        </TimiCard>

        <TimiCard title="我的日历" class="schedule-calendars">
          <div class="calendar-list">
            <div
              v-for="calendar in calendars"
              :key="calendar.id"
              class="calendar-item"
            >
              <a-checkbox v-model:checked="calendar.visible">
                <span class="calendar-color" :style="{ background: calendar.color }"></span>
                {{ calendar.name }}
              </a-checkbox>
            </div>
          </div>
        </TimiCard>
      </div>
    </div>

    <!-- 新建/编辑日程弹窗 -->
    <a-modal
      v-model:open="eventModalVisible"
      :title="isEdit ? '编辑日程' : '新建日程'"
      width="600px"
      @ok="saveEvent"
    >
      <a-form :model="eventForm" layout="vertical">
        <a-form-item label="标题" required>
          <a-input v-model:value="eventForm.title" placeholder="请输入日程标题" />
        </a-form-item>
        <a-form-item label="时间" required>
          <a-range-picker
            v-model:value="eventForm.timeRange"
            show-time
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="地点">
          <a-input v-model:value="eventForm.location" placeholder="请输入地点" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="eventForm.description" :rows="3" placeholder="请输入描述" />
        </a-form-item>
        <a-form-item label="提醒">
          <a-select v-model:value="eventForm.reminder">
            <a-select-option :value="0">不提醒</a-select-option>
            <a-select-option :value="5">提前5分钟</a-select-option>
            <a-select-option :value="15">提前15分钟</a-select-option>
            <a-select-option :value="30">提前30分钟</a-select-option>
            <a-select-option :value="60">提前1小时</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import { TimiCard } from '@gitcoffee/timioa-ui';
import dayjs from 'dayjs';

const calendarRef = ref();
const eventModalVisible = ref(false);
const isEdit = ref(false);
const currentEventId = ref<string | null>(null);

import type { Dayjs } from 'dayjs';

const eventForm = ref<{
  title: string;
  timeRange: Dayjs[];
  location: string;
  description: string;
  reminder: number;
}>({
  title: '',
  timeRange: [],
  location: '',
  description: '',
  reminder: 15
});

const calendarOptions = ref<any>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: false,
  locale: 'zh-cn',
  firstDay: 1,
  events: [
    { id: '1', title: '早会', start: dayjs().hour(9).minute(0).format(), color: '#1890ff' },
    { id: '2', title: '项目评审', start: dayjs().hour(10).minute(30).format(), end: dayjs().hour(12).minute(0).format(), color: '#52c41a' },
    { id: '3', title: '客户需求沟通', start: dayjs().hour(14).minute(0).format(), color: '#faad14' },
    { id: '4', title: '周会', start: dayjs().hour(16).minute(0).format(), end: dayjs().hour(17).minute(30).format(), color: '#ff4d4f' }
  ],
  eventClick: (info: any) => {
    editEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end
    });
  },
  dateClick: (info: any) => {
    createEvent(info.date);
  }
});

const todayEvents = computed(() => {
  const today = dayjs().format('YYYY-MM-DD');
  return calendarOptions.value.events
    .filter((e: any) => dayjs(e.start).format('YYYY-MM-DD') === today)
    .map((e: any) => ({
      id: e.id,
      title: e.title,
      time: dayjs(e.start).format('HH:mm'),
      location: e.location || '',
      color: e.color
    }));
});

const calendars = ref([
  { id: '1', name: '工作日程', color: '#1890ff', visible: true },
  { id: '2', name: '会议', color: '#52c41a', visible: true },
  { id: '3', name: '个人', color: '#faad14', visible: true },
  { id: '4', name: '节假日', color: '#ff4d4f', visible: true }
]);

const changeView = (viewName: string) => {
  const calendar = calendarRef.value?.getApi();
  if (calendar) {
    calendar.changeView(viewName);
  }
};

const createEvent = (date?: Date) => {
  isEdit.value = false;
  currentEventId.value = null;
  eventForm.value = {
    title: '',
    timeRange: date ? [dayjs(date), dayjs(date).add(1, 'hour')] : [],
    location: '',
    description: '',
    reminder: 15
  };
  eventModalVisible.value = true;
};

const editEvent = (event: any) => {
  isEdit.value = true;
  currentEventId.value = event.id;
  eventForm.value = {
    title: event.title,
    timeRange: [dayjs(event.start), dayjs(event.end)],
    location: event.location || '',
    description: event.description || '',
    reminder: event.reminder || 15
  };
  eventModalVisible.value = true;
};

const saveEvent = () => {
  // 保存日程
  eventModalVisible.value = false;
};
</script>

<style scoped>
.schedule-page {
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

.schedule-content {
  display: flex;
  gap: 24px;
}

.schedule-calendar {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.schedule-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.today-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.today-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid;
  cursor: pointer;
  transition: all 0.3s;
}

.today-item:hover {
  background: #f0f0f0;
}

.today-time {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.today-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.today-location {
  font-size: 12px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calendar-item {
  display: flex;
  align-items: center;
}

.calendar-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 8px;
}

:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-event) {
  cursor: pointer;
}
</style>
