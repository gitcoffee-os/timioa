<template>
  <div class="meeting-room-page">
    <div class="page-header">
      <h1 class="page-title">会议室预定</h1>
      <a-space>
        <a-date-picker v-model:value="selectedDate" />
        <a-button type="primary" @click="openBookingModal">
          <PlusOutlined /> 预定会议室
        </a-button>
      </a-space>
    </div>

    <div class="room-list">
      <div v-for="room in rooms" :key="room.id" class="room-card">
        <div class="room-image">
          <img :src="room.image" :alt="room.name" />
          <div class="room-capacity">
            <TeamOutlined /> {{ room.capacity }}人
          </div>
        </div>
        <div class="room-info">
          <h3 class="room-name">{{ room.name }}</h3>
          <p class="room-location">
            <EnvironmentOutlined /> {{ room.location }}
          </p>
          <div class="room-equipment">
            <a-tag v-for="eq in room.equipment" :key="eq" size="small">{{ eq }}</a-tag>
          </div>
          <div class="room-status">
            <a-badge :status="room.isAvailable ? 'success' : 'error'" />
            {{ room.isAvailable ? '空闲' : '使用中' }}
          </div>
        </div>
        <div class="room-actions">
          <a-button type="primary" :disabled="!room.isAvailable" @click="bookRoom(room)">
            立即预定
          </a-button>
          <a-button @click="viewSchedule(room)">查看日程</a-button>
        </div>
      </div>
    </div>

    <!-- 预定弹窗 -->
    <a-modal
      v-model:open="bookingVisible"
      title="预定会议室"
      width="600px"
      @ok="submitBooking"
    >
      <a-form :model="bookingForm" layout="vertical">
        <a-form-item label="会议室">
          <a-input v-model:value="bookingForm.roomName" disabled />
        </a-form-item>
        <a-form-item label="会议主题" required>
          <a-input v-model:value="bookingForm.subject" placeholder="请输入会议主题" />
        </a-form-item>
        <a-form-item label="时间" required>
          <a-range-picker
            v-model:value="bookingForm.timeRange"
            show-time
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="参会人员">
          <a-select
            v-model:value="bookingForm.participants"
            mode="multiple"
            placeholder="请选择参会人员"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="bookingForm.remark" :rows="3" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { PlusOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';

const selectedDate = ref(dayjs());
const bookingVisible = ref(false);
const bookingForm = ref({
  roomName: '',
  subject: '',
  timeRange: [],
  participants: [],
  remark: ''
});

const rooms = ref([
  {
    id: '1',
    name: '会议室A',
    location: '3楼东侧',
    capacity: 10,
    image: '/room-a.jpg',
    equipment: ['投影仪', '白板', '视频会议'],
    isAvailable: true
  },
  {
    id: '2',
    name: '会议室B',
    location: '3楼西侧',
    capacity: 8,
    image: '/room-b.jpg',
    equipment: ['投影仪', '白板'],
    isAvailable: false
  },
  {
    id: '3',
    name: '大会议室',
    location: '4楼中央',
    capacity: 50,
    image: '/room-large.jpg',
    equipment: ['投影仪', '音响', '视频会议', '舞台'],
    isAvailable: true
  },
  {
    id: '4',
    name: '洽谈室1',
    location: '2楼东侧',
    capacity: 4,
    image: '/room-small-1.jpg',
    equipment: ['白板'],
    isAvailable: true
  },
  {
    id: '5',
    name: '洽谈室2',
    location: '2楼西侧',
    capacity: 4,
    image: '/room-small-2.jpg',
    equipment: ['白板'],
    isAvailable: true
  }
]);

const openBookingModal = () => {
  bookingForm.value = {
    roomName: '',
    subject: '',
    timeRange: [],
    participants: [],
    remark: ''
  };
  bookingVisible.value = true;
};

const bookRoom = (room: any) => {
  bookingForm.value.roomName = room.name;
  bookingVisible.value = true;
};

const viewSchedule = (room: any) => {
  console.log('查看日程:', room);
};

const submitBooking = () => {
  console.log('提交预定:', bookingForm.value);
  bookingVisible.value = false;
};
</script>

<style scoped>
.meeting-room-page {
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

.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.room-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.room-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.room-image {
  position: relative;
  height: 160px;
  background: #f5f5f5;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-capacity {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.room-info {
  padding: 16px;
}

.room-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.room-location {
  color: #8c8c8c;
  font-size: 13px;
  margin-bottom: 12px;
}

.room-equipment {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.room-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.room-actions {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
}
</style>
