<template>
  <div class="flow-workbench-page">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="welcome-title">
            <span class="greeting">{{ greeting }}</span>
            <span class="user-name">{{ userInfo.name }}</span>
          </h1>
          <p class="welcome-subtitle">您有 <span class="highlight">{{ stats.pending }}</span> 个待审批事项，<span class="highlight urgent">{{ stats.urgent }}</span> 个紧急事项需要处理</p>
        </div>
        <div class="welcome-actions">
          <a-button type="primary" size="large" class="action-btn primary" @click="goToPending">
            <CheckCircleOutlined />
            开始审批
          </a-button>
          <a-button size="large" class="action-btn" @click="goToApply">
            <PlusOutlined />
            发起申请
          </a-button>
        </div>
      </div>
      <div class="welcome-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <!-- 核心统计卡片 -->
    <div class="stats-section">
      <div class="stat-card" v-for="(stat, index) in statCards" :key="stat.key" :class="stat.type" :style="{ '--delay': index * 0.1 + 's' }">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <component :is="stat.icon" />
          </div>
          <div class="stat-ring"></div>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
            <component :is="stat.trend > 0 ? RiseOutlined : FallOutlined" />
            {{ Math.abs(stat.trend) }}% 较昨日
          </div>
        </div>
        <div class="stat-bg-icon">
          <component :is="stat.icon" />
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧：审批动态 -->
      <div class="content-left">
        <div class="section-card timeline-card">
          <div class="card-header">
            <div class="header-title">
              <ThunderboltOutlined class="title-icon" />
              <span>审批动态</span>
            </div>
            <a-radio-group v-model:value="timelineFilter" size="small">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="pending">待处理</a-radio-button>
              <a-radio-button value="processed">已处理</a-radio-button>
            </a-radio-group>
          </div>
          <div class="timeline-content">
            <div class="timeline-item" v-for="(item, index) in timelineData" :key="index" :class="item.type">
              <div class="timeline-dot" :class="item.type">
                <component :is="getTimelineIcon(item.type)" />
              </div>
              <div class="timeline-line" v-if="index < timelineData.length - 1"></div>
              <div class="timeline-body">
                <div class="timeline-header">
                  <span class="timeline-title">{{ item.title }}</span>
                  <span class="timeline-time">{{ item.time }}</span>
                </div>
                <div class="timeline-desc">{{ item.description }}</div>
                <div class="timeline-meta">
                  <a-avatar :size="20" :src="item.userAvatar">{{ item.userName.charAt(0) }}</a-avatar>
                  <span class="meta-user">{{ item.userName }}</span>
                  <a-tag size="small" :color="getTypeColor(item.category)">{{ item.categoryName }}</a-tag>
                </div>
                <div class="timeline-actions" v-if="item.type === 'pending'">
                  <a-button type="primary" size="small" @click="quickApprove(item)">
                    <CheckOutlined /> 同意
                  </a-button>
                  <a-button size="small" @click="viewDetail(item)">
                    <EyeOutlined /> 查看
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 审批效率图表 -->
        <div class="section-card chart-card">
          <div class="card-header">
            <div class="header-title">
              <BarChartOutlined class="title-icon" />
              <span>审批效率趋势</span>
            </div>
            <a-select v-model:value="chartPeriod" size="small" style="width: 100px">
              <a-select-option value="week">本周</a-select-option>
              <a-select-option value="month">本月</a-select-option>
              <a-select-option value="quarter">本季度</a-select-option>
            </a-select>
          </div>
          <div class="chart-content">
            <div class="efficiency-stats">
              <div class="efficiency-item">
                <div class="efficiency-value">{{ efficiency.avgTime }}</div>
                <div class="efficiency-label">平均审批时长</div>
              </div>
              <div class="efficiency-item">
                <div class="efficiency-value">{{ efficiency.passRate }}%</div>
                <div class="efficiency-label">通过率</div>
              </div>
              <div class="efficiency-item">
                <div class="efficiency-value">{{ efficiency.satisfaction }}</div>
                <div class="efficiency-label">满意度</div>
              </div>
            </div>
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div v-for="(bar, idx) in chartData" :key="idx" class="chart-bar" :style="{ height: bar.value + '%', '--delay': idx * 0.05 + 's' }">
                  <div class="bar-tooltip">{{ bar.label }}: {{ bar.count }}件</div>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="(bar, idx) in chartData" :key="idx">{{ bar.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：快捷操作和待办 -->
      <div class="content-right">
        <!-- 快捷入口 -->
        <div class="section-card quick-actions-card">
          <div class="card-header">
            <div class="header-title">
              <RocketOutlined class="title-icon" />
              <span>快捷入口</span>
            </div>
          </div>
          <div class="quick-actions-grid">
            <div v-for="action in quickActions" :key="action.key" class="quick-action-item" :class="action.type" @click="handleQuickAction(action)">
              <div class="action-icon">
                <component :is="action.icon" />
              </div>
              <div class="action-name">{{ action.name }}</div>
              <div class="action-badge" v-if="action.badge">{{ action.badge }}</div>
            </div>
          </div>
        </div>

        <!-- 待办清单 -->
        <div class="section-card todo-card">
          <div class="card-header">
            <div class="header-title">
              <CheckSquareOutlined class="title-icon" />
              <span>今日待办</span>
            </div>
            <a-button type="link" size="small" @click="addTodo">
              <PlusOutlined /> 添加
            </a-button>
          </div>
          <div class="todo-list">
            <div v-for="(todo, index) in todoList" :key="index" class="todo-item" :class="{ completed: todo.completed }">
              <a-checkbox v-model:checked="todo.completed" @change="toggleTodo(todo)" />
              <span class="todo-text">{{ todo.text }}</span>
              <a-tag size="small" :color="todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'default'">
                {{ todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低' }}
              </a-tag>
            </div>
          </div>
        </div>

        <!-- 审批排行榜 -->
        <div class="section-card ranking-card">
          <div class="card-header">
            <div class="header-title">
              <TrophyOutlined class="title-icon" />
              <span>审批达人榜</span>
            </div>
            <a-radio-group v-model:value="rankingPeriod" size="small">
              <a-radio-button value="week">周榜</a-radio-button>
              <a-radio-button value="month">月榜</a-radio-button>
            </a-radio-group>
          </div>
          <div class="ranking-list">
            <div v-for="(user, index) in rankingList" :key="index" class="ranking-item" :class="{ 'top-three': index < 3 }">
              <div class="ranking-number">{{ index + 1 }}</div>
              <a-avatar :size="40" :src="user.avatar" class="ranking-avatar">{{ user.name.charAt(0) }}</a-avatar>
              <div class="ranking-info">
                <div class="ranking-name">{{ user.name }}</div>
                <div class="ranking-dept">{{ user.department }}</div>
              </div>
              <div class="ranking-score">
                <div class="score-value">{{ user.score }}</div>
                <div class="score-label">审批数</div>
              </div>
              <div class="ranking-medal" v-if="index < 3">
                <component :is="index === 0 ? GoldFilled : index === 1 ? SilverFilled : BronzeFilled" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速审批弹窗 -->
    <a-modal
      v-model:open="quickApproveVisible"
      title="快速审批"
      width="500px"
      :footer="null"
      class="quick-approve-modal"
    >
      <div v-if="currentItem" class="quick-approve-content">
        <div class="approve-preview">
          <div class="preview-icon" :style="{ background: getTypeGradient(currentItem.category) }">
            <component :is="getTypeIcon(currentItem.category)" />
          </div>
          <div class="preview-info">
            <div class="preview-title">{{ currentItem.title }}</div>
            <div class="preview-desc">{{ currentItem.description }}</div>
          </div>
        </div>
        <div class="approve-form">
          <div class="form-title">审批意见</div>
          <div class="quick-comments">
            <span
              v-for="comment in quickComments"
              :key="comment"
              class="comment-tag"
              :class="{ active: approveComment === comment }"
              @click="approveComment = comment"
            >
              {{ comment }}
            </span>
          </div>
          <a-textarea
            v-model:value="approveComment"
            :rows="3"
            placeholder="请输入审批意见"
            class="comment-input"
          />
          <div class="form-actions">
            <a-button type="primary" size="large" block @click="submitApprove('agree')">
              <CheckCircleOutlined /> 同意
            </a-button>
            <a-button size="large" block danger @click="submitApprove('reject')">
              <CloseCircleOutlined /> 驳回
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  CheckCircleOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  RocketOutlined,
  CheckSquareOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  CheckOutlined,
  EyeOutlined,
  GoldFilled,
  SilverFilled,
  BronzeFilled,
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  CarOutlined,
  FileTextOutlined,
  UserOutlined,
  MessageOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  FireFilled,
  ExclamationCircleFilled
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

const router = useRouter();

// 用户信息
const userInfo = ref({
  name: '王经理',
  avatar: ''
});

// 问候语
const greeting = computed(() => {
  const hour = dayjs().hour();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

// 统计数据
const stats = ref({
  pending: 12,
  urgent: 3,
  processed: 45,
  initiated: 8
});

// 统计卡片
const statCards = [
  { key: 'pending', label: '待审批', value: 12, trend: 15, type: 'primary', icon: InboxOutlined },
  { key: 'urgent', label: '紧急事项', value: 3, trend: -5, type: 'danger', icon: FireFilled },
  { key: 'processed', label: '今日已审', value: 45, trend: 20, type: 'success', icon: CheckCircleOutlined },
  { key: 'avgTime', label: '平均耗时', value: '2.5h', trend: -10, type: 'warning', icon: ClockCircleOutlined }
];

// 时间轴筛选
const timelineFilter = ref('all');

// 时间轴数据
const timelineData = ref([
  {
    type: 'pending',
    title: '请假申请待审批',
    description: '张三申请请假3天，事由：家中有事',
    time: '10分钟前',
    userName: '张三',
    userAvatar: '',
    category: 'leave',
    categoryName: '请假'
  },
  {
    type: 'processed',
    title: '已通过报销申请',
    description: '李四的差旅费报销申请已通过审批',
    time: '30分钟前',
    userName: '李四',
    userAvatar: '',
    category: 'expense',
    categoryName: '报销'
  },
  {
    type: 'pending',
    title: '加班申请待审批',
    description: '王五申请周末加班，项目紧急上线',
    time: '1小时前',
    userName: '王五',
    userAvatar: '',
    category: 'overtime',
    categoryName: '加班'
  },
  {
    type: 'urgent',
    title: '紧急出差申请',
    description: '赵六申请明天紧急出差深圳，客户突发需求',
    time: '2小时前',
    userName: '赵六',
    userAvatar: '',
    category: 'business',
    categoryName: '出差'
  },
  {
    type: 'processed',
    title: '已驳回采购申请',
    description: '钱七的办公用品采购申请被驳回，需补充说明',
    time: '3小时前',
    userName: '钱七',
    userAvatar: '',
    category: 'purchase',
    categoryName: '采购'
  }
]);

// 图表数据
const chartPeriod = ref('week');
const efficiency = ref({
  avgTime: '2.5h',
  passRate: 92,
  satisfaction: 4.8
});

const chartData = [
  { label: '周一', value: 65, count: 13 },
  { label: '周二', value: 80, count: 16 },
  { label: '周三', value: 45, count: 9 },
  { label: '周四', value: 90, count: 18 },
  { label: '周五', value: 70, count: 14 },
  { label: '周六', value: 30, count: 6 },
  { label: '周日', value: 25, count: 5 }
];

// 快捷操作
const quickActions = [
  { key: 'leave', name: '请假申请', icon: CalendarOutlined, type: 'blue', badge: null },
  { key: 'expense', name: '费用报销', icon: DollarOutlined, type: 'green', badge: 2 },
  { key: 'overtime', name: '加班申请', icon: ClockCircleOutlined, type: 'orange', badge: null },
  { key: 'business', name: '出差申请', icon: CarOutlined, type: 'purple', badge: 1 },
  { key: 'purchase', name: '物品采购', icon: FileTextOutlined, type: 'cyan', badge: null },
  { key: 'other', name: '其他申请', icon: PlusOutlined, type: 'gray', badge: null }
];

// 待办清单
const todoList = ref([
  { text: '审批张三的请假申请', completed: false, priority: 'high' },
  { text: '查看月度报销汇总', completed: false, priority: 'medium' },
  { text: '处理紧急出差申请', completed: true, priority: 'high' },
  { text: '回复李四的咨询', completed: false, priority: 'low' }
]);

// 排行榜
const rankingPeriod = ref('week');
const rankingList = ref([
  { name: '王经理', department: '技术部', score: 156, avatar: '' },
  { name: '李总监', department: '销售部', score: 142, avatar: '' },
  { name: '张主管', department: '人事部', score: 128, avatar: '' },
  { name: '赵经理', department: '财务部', score: 115, avatar: '' },
  { name: '孙主管', department: '行政部', score: 98, avatar: '' }
]);

// 快速审批
const quickApproveVisible = ref(false);
const currentItem = ref<any>(null);
const approveComment = ref('');
const quickComments = ['同意', '已核实，批准', '情况属实，准予通过', '请补充材料后重新申请'];

// 方法
const goToPending = () => {
  router.push('/flow/pending');
};

const goToApply = () => {
  router.push('/flow/apply');
};

const getTimelineIcon = (type: string) => {
  const icons: Record<string, any> = {
    pending: ClockCircleOutlined,
    processed: CheckCircleOutlined,
    urgent: FireFilled,
    reject: CloseCircleOutlined
  };
  return icons[type] || FileTextOutlined;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    leave: 'blue',
    expense: 'green',
    overtime: 'orange',
    business: 'purple',
    purchase: 'cyan'
  };
  return colors[type] || 'default';
};

const getTypeGradient = (type: string) => {
  const gradients: Record<string, string> = {
    leave: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    expense: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    overtime: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    business: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    purchase: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)'
  };
  return gradients[type] || 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    leave: CalendarOutlined,
    expense: DollarOutlined,
    overtime: ClockCircleOutlined,
    business: CarOutlined,
    purchase: FileTextOutlined
  };
  return icons[type] || FileTextOutlined;
};

const quickApprove = (item: any) => {
  currentItem.value = item;
  approveComment.value = '';
  quickApproveVisible.value = true;
};

const viewDetail = (item: any) => {
  message.info('查看详情: ' + item.title);
};

const submitApprove = (result: string) => {
  message.success(result === 'agree' ? '已同意' : '已驳回');
  quickApproveVisible.value = false;
};

const handleQuickAction = (action: any) => {
  message.info('点击了: ' + action.name);
};

const addTodo = () => {
  message.info('添加待办');
};

const toggleTodo = (todo: any) => {
  message.info(todo.completed ? '已完成: ' + todo.text : '取消完成: ' + todo.text);
};

onMounted(() => {
  // 模拟加载动画
  setTimeout(() => {
    document.querySelectorAll('.stat-card').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-in');
      }, i * 100);
    });
  }, 100);
});
</script>

<style scoped>
.flow-workbench-page {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

/* 欢迎区域 */
.welcome-section {
  position: relative;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 24px;
  overflow: hidden;
  color: white;
}

.welcome-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.greeting {
  opacity: 0.9;
}

.user-name {
  background: linear-gradient(to right, #fff, #fcd34d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 16px;
  opacity: 0.85;
  margin: 0;
}

.highlight {
  font-weight: 700;
  font-size: 20px;
  color: #fcd34d;
}

.highlight.urgent {
  color: #fca5a5;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.welcome-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: white;
  color: #4f46e5;
  border: none;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.action-btn:not(.primary) {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn:not(.primary):hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 装饰圆圈 */
.welcome-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: 10%;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
}

/* 统计卡片 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.stat-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  z-index: 2;
  position: relative;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.stat-card.danger .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.stat-ring {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid;
  opacity: 0.3;
  animation: rotate 10s linear infinite;
}

.stat-card.primary .stat-ring {
  border-color: #4f46e5;
}

.stat-card.danger .stat-ring {
  border-color: #ef4444;
}

.stat-card.success .stat-ring {
  border-color: #10b981;
}

.stat-card.warning .stat-ring {
  border-color: #f59e0b;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stat-info {
  flex: 1;
  z-index: 2;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.stat-trend.up {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.stat-trend.down {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.stat-bg-icon {
  position: absolute;
  right: -10px;
  bottom: -10px;
  font-size: 100px;
  opacity: 0.03;
  color: #1f2937;
}

/* 主内容区 */
.main-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.title-icon {
  font-size: 20px;
  color: #4f46e5;
}

/* 时间轴 */
.timeline-content {
  max-height: 400px;
  overflow-y: auto;
}

.timeline-item {
  position: relative;
  padding-left: 40px;
  padding-bottom: 24px;
  display: flex;
  gap: 16px;
}

.timeline-dot {
  position: absolute;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  z-index: 2;
}

.timeline-dot.pending {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.timeline-dot.processed {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.timeline-dot.urgent {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  animation: pulse 2s infinite;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #e5e7eb, transparent);
}

.timeline-body {
  flex: 1;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.timeline-body:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 15px;
}

.timeline-time {
  font-size: 12px;
  color: #9ca3af;
}

.timeline-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.5;
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-user {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

/* 图表区域 */
.chart-content {
  padding-top: 16px;
}

.efficiency-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.efficiency-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
}

.efficiency-value {
  font-size: 24px;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 4px;
}

.efficiency-label {
  font-size: 12px;
  color: #6b7280;
}

.chart-placeholder {
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 140px;
  gap: 12px;
  padding: 0 8px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #4f46e5, #818cf8);
  border-radius: 8px 8px 0 0;
  min-height: 20px;
  position: relative;
  transition: all 0.3s ease;
  animation: growUp 0.6s ease-out backwards;
  animation-delay: var(--delay, 0s);
}

@keyframes growUp {
  from {
    height: 0 !important;
    opacity: 0;
  }
}

.chart-bar:hover {
  background: linear-gradient(to top, #7c3aed, #a78bfa);
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  margin-bottom: 4px;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  padding: 0 8px;
}

.chart-labels span {
  flex: 1;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
}

/* 快捷操作 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.quick-action-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 16px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.quick-action-item.blue .action-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
}

.quick-action-item.green .action-icon {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.quick-action-item.orange .action-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.quick-action-item.purple .action-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
}

.quick-action-item.cyan .action-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
}

.quick-action-item.gray .action-icon {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
}

.action-name {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.action-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: #ef4444;
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 待办清单 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background: #f1f5f9;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #9ca3af;
}

.todo-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

/* 排行榜 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.ranking-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.ranking-item.top-three {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.ranking-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  background: #e5e7eb;
}

.ranking-item.top-three .ranking-number {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
}

.ranking-avatar {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.ranking-dept {
  font-size: 12px;
  color: #9ca3af;
}

.ranking-score {
  text-align: right;
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: #4f46e5;
}

.score-label {
  font-size: 11px;
  color: #9ca3af;
}

.ranking-medal {
  font-size: 24px;
}

/* 快速审批弹窗 */
.quick-approve-modal :deep(.ant-modal-content) {
  border-radius: 20px;
  overflow: hidden;
}

.quick-approve-content {
  padding: 8px;
}

.approve-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 24px;
}

.preview-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.preview-desc {
  font-size: 13px;
  color: #6b7280;
}

.approve-form {
  padding: 0 8px;
}

.form-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.quick-comments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.comment-tag {
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.comment-tag:hover,
.comment-tag.active {
  background: #4f46e5;
  color: white;
}

.comment-input {
  border-radius: 12px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 24px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .efficiency-stats {
    grid-template-columns: 1fr;
  }
}
</style>
