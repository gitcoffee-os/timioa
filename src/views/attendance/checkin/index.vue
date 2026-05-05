<template>
  <div class="checkin-page">
    <div class="page-header">
      <h1 class="page-title">考勤打卡</h1>
    </div>

    <div class="checkin-content">
      <div class="checkin-main">
        <TimiCard title="今日打卡" class="checkin-card">
          <div class="checkin-status">
            <div class="status-time">{{ currentTime }}</div>
            <div class="status-text">{{ checkinStatus }}</div>
          </div>
          <div class="checkin-actions">
            <a-button
              type="primary"
              size="large"
              :disabled="isCheckedIn"
              class="checkin-btn"
              @click="handleCheckin"
            >
              上班打卡
            </a-button>
            <a-button
              type="primary"
              size="large"
              danger
              :disabled="!isCheckedIn || isCheckedOut"
              class="checkin-btn"
              @click="handleCheckout"
            >
              下班打卡
            </a-button>
          </div>
          <div class="checkin-records">
            <div class="record-item">
              <span class="record-label">上班时间</span>
              <span class="record-value" :class="{ 'is-late': isLate }">{{ checkinTime || '--:--' }}</span>
            </div>
            <div class="record-item">
              <span class="record-label">下班时间</span>
              <span class="record-value">{{ checkoutTime || '--:--' }}</span>
            </div>
            <div class="record-item">
              <span class="record-label">工作时长</span>
              <span class="record-value">{{ workDuration }}</span>
            </div>
          </div>
        </TimiCard>

        <TimiCard title="考勤统计" class="stats-card">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.normal }}</div>
              <div class="stat-label">正常</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.late }}</div>
              <div class="stat-label">迟到</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.early }}</div>
              <div class="stat-label">早退</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.absent }}</div>
              <div class="stat-label">缺卡</div>
            </div>
          </div>
        </TimiCard>
      </div>

      <div class="checkin-sidebar">
        <TimiCard title="考勤日历" class="calendar-card">
          <a-calendar :fullscreen="false" @select="onDateSelect" />
        </TimiCard>

        <TimiCard title="考勤规则" class="rules-card">
          <div class="rules-content">
            <p><strong>工作时间：</strong>9:00 - 18:00</p>
            <p><strong>午休时间：</strong>12:00 - 13:00</p>
            <p><strong>弹性时间：</strong>±30分钟</p>
            <p><strong>迟到规则：</strong>9:30后打卡算迟到</p>
            <p><strong>早退规则：</strong>17:30前打卡算早退</p>
          </div>
        </TimiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TimiCard } from '@gitcoffee/timioa-ui';
import dayjs from 'dayjs';

const currentTime = ref(dayjs().format('HH:mm:ss'));
const checkinTime = ref('');
const checkoutTime = ref('');
let timer: any = null;

const isCheckedIn = computed(() => !!checkinTime.value);
const isCheckedOut = computed(() => !!checkoutTime.value);
const isLate = computed(() => {
  if (!checkinTime.value) return false;
  return dayjs(checkinTime.value, 'HH:mm').isAfter(dayjs('09:30', 'HH:mm'));
});

const checkinStatus = computed(() => {
  if (isCheckedOut.value) return '今日打卡完成';
  if (isCheckedIn.value) return '工作中，记得下班打卡';
  return '未打卡';
});

const workDuration = computed(() => {
  if (!checkinTime.value) return '--';
  const end = checkoutTime.value ? dayjs(checkoutTime.value, 'HH:mm') : dayjs();
  const start = dayjs(checkinTime.value, 'HH:mm');
  const hours = end.diff(start, 'hour');
  const minutes = end.diff(start, 'minute') % 60;
  return `${hours}小时${minutes}分钟`;
});

const stats = ref({
  normal: 18,
  late: 2,
  early: 0,
  absent: 0
});

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = dayjs().format('HH:mm:ss');
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleCheckin = () => {
  checkinTime.value = dayjs().format('HH:mm');
};

const handleCheckout = () => {
  checkoutTime.value = dayjs().format('HH:mm');
};

const onDateSelect = (date: any) => {
  console.log('选择日期:', date);
};
</script>

<style scoped>
.checkin-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.checkin-content {
  display: flex;
  gap: 24px;
}

.checkin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkin-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkin-card {
  text-align: center;
}

.checkin-status {
  margin-bottom: 24px;
}

.status-time {
  font-size: 48px;
  font-weight: 300;
  color: #262626;
  font-family: 'Roboto Mono', monospace;
}

.status-text {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 8px;
}

.checkin-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
}

.checkin-btn {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  font-size: 18px;
}

.checkin-records {
  display: flex;
  justify-content: space-around;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.record-item {
  text-align: center;
}

.record-label {
  display: block;
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.record-value {
  font-size: 20px;
  font-weight: 500;
  color: #262626;
}

.record-value.is-late {
  color: #ff4d4f;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
}

.rules-content p {
  margin-bottom: 12px;
  font-size: 14px;
}

.rules-content strong {
  color: #262626;
}
</style>
