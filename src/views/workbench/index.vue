<template>
  <div class="workbench-page">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="welcome-title">
            {{ greeting }}，<span class="user-name">{{ userInfo.name }}</span>
          </h1>
          <p class="welcome-subtitle">{{ welcomeMessage }}</p>
        </div>
        <div class="welcome-stats">
          <div class="stat-item">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待办事项</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ taskCount }}</div>
            <div class="stat-label">我的任务</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ meetingCount }}</div>
            <div class="stat-label">今日会议</div>
          </div>
        </div>
      </div>
      <div class="welcome-decoration">
        <img src="/logo.png" alt="TimiOA" class="deco-image" />
        <div class="deco-circle"></div>
        <div class="deco-dots"></div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-access">
      <div
        v-for="(item, index) in quickAccessItems"
        :key="index"
        class="quick-card"
        :style="{ '--delay': index * 0.1 + 's' }"
        @click="handleQuickClick(item)"
      >
        <div class="quick-icon" :style="{ background: item.gradient }">
          <component :is="item.icon" />
        </div>
        <span class="quick-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="workbench-grid">
      <!-- 左侧列 -->
      <div class="grid-left">
        <!-- 待办事项 -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <div class="title-icon" style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%)">
                <ClockCircleOutlined />
              </div>
              <div class="title-text">
                <h3>待办事项</h3>
                <span class="subtitle">{{ todoItems.length }} 个待处理</span>
              </div>
            </div>
            <a-button type="text" class="view-more" @click="handleMoreTodos">
              查看更多 <RightOutlined />
            </a-button>
          </div>
          <div class="todo-list">
            <div
              v-for="item in todoItems.slice(0, 5)"
              :key="item.id"
              class="todo-item"
              :class="{ urgent: item.priority === 'high' }"
              @click="handleTodoClick(item)"
            >
              <div class="todo-priority" :class="item.priority"></div>
              <div class="todo-content">
                <div class="todo-title">{{ item.title }}</div>
                <div class="todo-meta">
                  <span class="todo-type">{{ item.type }}</span>
                  <span class="todo-time">{{ item.time }}</span>
                </div>
              </div>
              <a-tag :color="getPriorityColor(item.priority)" class="todo-tag">
                {{ getPriorityText(item.priority) }}
              </a-tag>
            </div>
            <a-empty v-if="todoItems.length === 0" description="暂无待办事项" />
          </div>
        </div>

        <!-- 我的日程 -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <div class="title-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)">
                <CalendarOutlined />
              </div>
              <div class="title-text">
                <h3>今日日程</h3>
                <span class="subtitle">{{ scheduleItems.length }} 个安排</span>
              </div>
            </div>
            <a-button type="text" class="view-more" @click="router.push('/schedule')">
              查看全部 <RightOutlined />
            </a-button>
          </div>
          <div class="schedule-timeline">
            <div
              v-for="(item, index) in scheduleItems"
              :key="item.id"
              class="schedule-item"
            >
              <div class="time-marker">
                <div class="time-dot" :class="{ active: index === 0 }"></div>
                <div class="time-line" v-if="index < scheduleItems.length - 1"></div>
              </div>
              <div class="schedule-card">
                <div class="schedule-time">{{ item.time }}</div>
                <div class="schedule-title">{{ item.title }}</div>
                <div class="schedule-location" v-if="item.location">
                  <EnvironmentOutlined /> {{ item.location }}
                </div>
              </div>
            </div>
            <a-empty v-if="scheduleItems.length === 0" description="今日暂无日程" />
          </div>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="grid-right">
        <!-- 通知公告 -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <div class="title-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)">
                <NotificationOutlined />
              </div>
              <div class="title-text">
                <h3>通知公告</h3>
                <span class="subtitle">最新动态</span>
              </div>
            </div>
          </div>
          <div class="notice-list">
            <div
              v-for="notice in noticeItems.slice(0, 5)"
              :key="notice.id"
              class="notice-item"
              :class="{ top: notice.isTop }"
              @click="handleNoticeClick(notice)"
            >
              <div class="notice-badge" v-if="notice.isTop">置顶</div>
              <div class="notice-badge new" v-else-if="notice.isNew">NEW</div>
              <div class="notice-content">
                <div class="notice-title">{{ notice.title }}</div>
                <div class="notice-date">{{ notice.date }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷应用 -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="header-title">
              <div class="title-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%)">
                <AppstoreOutlined />
              </div>
              <div class="title-text">
                <h3>常用应用</h3>
                <span class="subtitle">快速访问</span>
              </div>
            </div>
          </div>
          <div class="apps-grid">
            <div
              v-for="app in commonApps"
              :key="app.key"
              class="app-item"
              @click="handleAppClick(app)"
            >
              <div class="app-icon" :style="{ background: app.gradient }">
                <component :is="app.icon" />
              </div>
              <span class="app-name">{{ app.name }}</span>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="dashboard-card stats-card">
          <div class="card-header">
            <div class="header-title">
              <div class="title-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)">
                <BarChartOutlined />
              </div>
              <div class="title-text">
                <h3>工作统计</h3>
                <span class="subtitle">本周概览</span>
              </div>
            </div>
          </div>
          <div class="stats-chart">
            <div class="chart-bars">
              <div
                v-for="(day, index) in weekStats"
                :key="index"
                class="bar-item"
              >
                <div class="bar-wrapper">
                  <div
                    class="bar-fill"
                    :style="{ height: day.value + '%' }"
                  ></div>
                </div>
                <span class="bar-label">{{ day.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  RightOutlined,
  FileTextOutlined,
  AuditOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  DollarOutlined,
  ProjectOutlined,
  FormOutlined,
  MessageOutlined,
  RobotOutlined,
  ScheduleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '~/stores/user';

const router = useRouter();
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

const welcomeMessage = computed(() => {
  const messages = [
    '愿你拥有美好的一天！',
    '今天也是充满干劲的一天！',
    '保持专注，高效工作！',
    '相信今天会有不错的收获！'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
});

// 统计数据
const pendingCount = ref(5);
const taskCount = ref(12);
const meetingCount = ref(3);

// 快捷入口
const quickAccessItems = [
  { icon: FileTextOutlined, label: '发起申请', gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', path: '/flow/apply' },
  { icon: AuditOutlined, label: '待审批', gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', path: '/flow/pending' },
  { icon: VideoCameraOutlined, label: '预定会议', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', path: '/meeting/room' },
  { icon: TeamOutlined, label: '员工管理', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', path: '/hr/employee' },
  { icon: DollarOutlined, label: '费用报销', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', path: '/finance/expense' },
  { icon: ProjectOutlined, label: '项目管理', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', path: '/project/list' },
  { icon: FormOutlined, label: '写汇报', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', path: '/report/mine' },
  { icon: MessageOutlined, label: '消息中心', gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', path: '/im' }
];

// 待办事项
const todoItems = ref([
  { id: 1, title: '审批张三的请假申请', type: '请假审批', time: '10分钟前', priority: 'high' },
  { id: 2, title: '完成Q4季度工作报告', type: '工作汇报', time: '1小时前', priority: 'high' },
  { id: 3, title: '参加产品评审会议', type: '会议提醒', time: '14:00', priority: 'medium' },
  { id: 4, title: '提交本月费用报销单', type: '费用报销', time: '今天', priority: 'medium' },
  { id: 5, title: '回复客户邮件', type: '日常办公', time: '今天', priority: 'low' }
]);

// 日程安排
const scheduleItems = ref([
  { id: 1, title: '产品评审会议', time: '14:00 - 15:30', location: '会议室A' },
  { id: 2, title: '团队周例会', time: '16:00 - 17:00', location: '线上会议' },
  { id: 3, title: '客户需求沟通', time: '17:30 - 18:00', location: '接待室' }
]);

// 通知公告
const noticeItems = ref([
  { id: 1, title: '关于2025年春节放假安排的通知', date: '今天', isTop: true },
  { id: 2, title: '公司新版OA系统正式上线', date: '昨天', isTop: false, isNew: true },
  { id: 3, title: '第四季度绩效考核开始', date: '2天前', isTop: false },
  { id: 4, title: '关于调整工作时间的通知', date: '3天前', isTop: false },
  { id: 5, title: '新员工入职培训安排', date: '1周前', isTop: false }
]);

// 常用应用
const commonApps = [
  { key: 'ai', name: 'AI助手', icon: RobotOutlined, gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
  { key: 'doc', name: '文档', icon: FileTextOutlined, gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
  { key: 'schedule', name: '日程', icon: ScheduleOutlined, gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  { key: 'task', name: '任务', icon: CheckCircleOutlined, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { key: 'meeting', name: '会议', icon: VideoCameraOutlined, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
  { key: 'im', name: '消息', icon: MessageOutlined, gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }
];

// 周统计数据
const weekStats = ref([
  { label: '一', value: 65 },
  { label: '二', value: 80 },
  { label: '三', value: 45 },
  { label: '四', value: 90 },
  { label: '五', value: 70 },
  { label: '六', value: 30 },
  { label: '日', value: 20 }
]);

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: 'error',
    medium: 'warning',
    low: 'default'
  };
  return colors[priority] || 'default';
};

const getPriorityText = (priority: string) => {
  const texts: Record<string, string> = {
    high: '紧急',
    medium: '普通',
    low: '低优'
  };
  return texts[priority] || '普通';
};

const handleQuickClick = (item: any) => {
  router.push(item.path);
};

const handleTodoClick = (item: any) => {
  console.log('点击待办:', item);
};

const handleMoreTodos = () => {
  router.push('/flow/pending');
};

const handleNoticeClick = (notice: any) => {
  console.log('点击通知:', notice);
};

const handleAppClick = (app: any) => {
  const paths: Record<string, string> = {
    ai: '/ai',
    doc: '/office/document',
    schedule: '/schedule',
    task: '/project/task',
    meeting: '/meeting/list',
    im: '/im'
  };
  if (paths[app.key]) {
    router.push(paths[app.key]);
  }
};
</script>

<style scoped>
.workbench-page {
  padding: 0;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
  border-radius: 24px;
  padding: 32px 40px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2);
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.user-name {
  background: linear-gradient(135deg, #fff 0%, #fcd34d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
}

.welcome-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

.welcome-decoration {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  right: -100px;
  top: 50%;
  transform: translateY(-50%);
}

.deco-image {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  filter: brightness(0) invert(1) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
  z-index: 2;
  opacity: 0.9;
}

/* 快捷入口 */
.quick-access {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  background: #fff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.quick-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  transition: transform 0.3s ease;
}

.quick-card:hover .quick-icon {
  transform: scale(1.1);
}

.quick-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

/* 工作台网格 */
.workbench-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.grid-left,
.grid-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 仪表板卡片 */
.dashboard-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.title-text h3 {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.title-text .subtitle {
  font-size: 13px;
  color: #9ca3af;
}

.view-more {
  color: #6b7280;
  font-size: 13px;
}

.view-more:hover {
  color: #4f46e5;
}

/* 待办列表 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.todo-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.todo-item.urgent {
  border-left-color: #ef4444;
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%);
}

.todo-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.todo-priority.high { background: #ef4444; }
.todo-priority.medium { background: #f59e0b; }
.todo-priority.low { background: #10b981; }

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.todo-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 日程时间线 */
.schedule-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.schedule-item {
  display: flex;
  gap: 16px;
}

.time-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
}

.time-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #e5e7eb;
}

.time-dot.active {
  background: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.time-line {
  flex: 1;
  width: 2px;
  background: #e5e7eb;
  margin: 4px 0;
}

.schedule-card {
  flex: 1;
  padding: 14px 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.schedule-card:hover {
  background: #f3f4f6;
}

.schedule-time {
  font-size: 12px;
  color: #4f46e5;
  font-weight: 600;
  margin-bottom: 4px;
}

.schedule-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.schedule-location {
  font-size: 12px;
  color: #9ca3af;
}

/* 通知列表 */
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:hover {
  background: #f9fafb;
}

.notice-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f3f4f6;
  color: #6b7280;
  flex-shrink: 0;
}

.notice-badge.new {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.notice-item.top .notice-badge {
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  color: white;
}

.notice-content {
  flex: 1;
  min-width: 0;
}

.notice-title {
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.notice-item.top .notice-title {
  font-weight: 600;
  color: #111827;
}

.notice-date {
  font-size: 12px;
  color: #9ca3af;
}

/* 应用网格 */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.app-item:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.app-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  transition: transform 0.3s ease;
}

.app-item:hover .app-icon {
  transform: scale(1.1);
}

.app-name {
  font-size: 13px;
  color: #4b5563;
}

/* 统计图表 */
.stats-chart {
  padding: 16px 0;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding: 0 8px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.bar-wrapper {
  width: 24px;
  height: 100px;
  background: #f3f4f6;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 12px;
  color: #9ca3af;
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式 */
@media (max-width: 1200px) {
  .quick-access {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .workbench-grid {
    grid-template-columns: 1fr;
  }
  
  .grid-right {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .welcome-stats {
    width: 100%;
    justify-content: center;
  }
  
  .quick-access {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-right {
    grid-template-columns: 1fr;
  }
}
</style>
