<template>
  <a-layout class="timi-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="260"
      class="timi-layout-sider"
    >
      <div class="timi-layout-logo">
        <div class="logo-icon">
          <img src="/logo.png" alt="TimiOA" />
        </div>
        <span v-if="!collapsed" class="logo-text">TimiOA</span>
      </div>
      <div class="menu-container">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          theme="dark"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </div>
    </a-layout-sider>

    <a-layout class="timi-layout-main">
      <!-- 顶部导航 -->
      <a-layout-header class="timi-layout-header glass">
        <div class="timi-layout-header-left">
          <div class="trigger-wrapper" @click="() => (collapsed = !collapsed)">
            <menu-unfold-outlined v-if="collapsed" class="trigger" />
            <menu-fold-outlined v-else class="trigger" />
          </div>
          <breadcrumb />
        </div>
        <div class="timi-layout-header-right">
          <!-- 搜索 -->
          <div class="search-wrapper">
            <SearchOutlined class="search-icon" />
            <input
              v-model="searchValue"
              type="text"
              placeholder="全局搜索..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
          </div>
          
          <!-- 分隔线 -->
          <div class="header-divider"></div>
          
          <!-- 通知 -->
          <a-badge :count="unreadCount" :overflow-count="99" class="header-badge">
            <div class="header-icon-btn" @click="showNotifications">
              <BellOutlined />
            </div>
          </a-badge>
          
          <!-- AI助手 -->
          <div class="header-icon-btn ai-btn" @click="openAI">
            <RobotOutlined />
          </div>
          
          <!-- 消息 -->
          <a-badge :count="messageCount" :overflow-count="99" class="header-badge">
            <div class="header-icon-btn" @click="openIM">
              <MessageOutlined />
            </div>
          </a-badge>
          
          <!-- 分隔线 -->
          <div class="header-divider"></div>
          
          <!-- 用户菜单 -->
          <a-dropdown placement="bottomRight">
            <div class="timi-layout-user">
              <div class="user-avatar-wrapper">
                <a-avatar :src="userInfo.avatar" :size="36">{{ userInfo.name?.charAt(0) }}</a-avatar>
                <span class="online-status"></span>
              </div>
              <div v-if="!collapsed" class="user-info">
                <span class="user-name">{{ userInfo.name }}</span>
                <span class="user-dept">{{ userInfo.deptName }}</span>
              </div>
              <DownOutlined class="user-arrow" />
            </div>
            <template #overlay>
              <a-menu class="user-dropdown-menu" @click="handleUserMenuClick">
                <div class="user-dropdown-header">
                  <a-avatar :src="userInfo.avatar" :size="48">{{ userInfo.name?.charAt(0) }}</a-avatar>
                  <div class="user-dropdown-info">
                    <div class="user-dropdown-name">{{ userInfo.name }}</div>
                    <div class="user-dropdown-email">{{ userInfo.email }}</div>
                  </div>
                </div>
                <a-menu-divider />
                <a-menu-item key="profile">
                  <UserOutlined /> 个人中心
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined /> 系统设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" class="logout-item">
                  <LogoutOutlined /> 退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content class="timi-layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  AuditOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  ProjectOutlined,
  FormOutlined,
  SearchOutlined,
  DownOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '~/stores/user';
import Breadcrumb from './components/Breadcrumb.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const collapsed = ref(false);
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const searchValue = ref('');

const userInfo = computed(() => userStore.userInfo);
const unreadCount = computed(() => userStore.unreadCount);
const messageCount = computed(() => userStore.messageCount);

// 菜单配置
const menuItems = [
  { key: '/workbench', icon: () => h(DashboardOutlined), label: '工作台' },
  {
    key: '/office',
    icon: () => h(FileTextOutlined),
    label: '日常办公',
    children: [
      { key: '/office/announcement', label: '通知公告' },
      { key: '/office/document', label: '我的文档' },
      { key: '/office/knowledge', label: '知识库' }
    ]
  },
  {
    key: '/flow',
    icon: () => h(AuditOutlined),
    label: 'OA审批',
    children: [
      { key: '/flow/apply', label: '发起申请' },
      { key: '/flow/pending', label: '待审批' },
      { key: '/flow/processed', label: '已审批' },
      { key: '/flow/initiated', label: '我发起的' }
    ]
  },
  {
    key: '/meeting',
    icon: () => h(VideoCameraOutlined),
    label: '会议管理',
    children: [
      { key: '/meeting/list', label: '会议列表' },
      { key: '/meeting/room', label: '会议室预定' },
      { key: '/meeting/minutes', label: '会议纪要' }
    ]
  },
  { key: '/schedule', icon: () => h(CalendarOutlined), label: '日程计划' },
  {
    key: '/attendance',
    icon: () => h(ClockCircleOutlined),
    label: '假勤管理',
    children: [
      { key: '/attendance/checkin', label: '考勤打卡' },
      { key: '/attendance/leave', label: '请假' },
      { key: '/attendance/overtime', label: '加班' },
      { key: '/attendance/business', label: '出差' }
    ]
  },
  {
    key: '/hr',
    icon: () => h(TeamOutlined),
    label: '人事管理',
    children: [
      { key: '/hr/employee', label: '员工管理' },
      { key: '/hr/department', label: '部门管理' },
      { key: '/hr/recruit', label: '招聘管理' }
    ]
  },
  {
    key: '/finance',
    icon: () => h(DollarOutlined),
    label: '财务管理',
    children: [
      { key: '/finance/expense', label: '费用报销' },
      { key: '/finance/loan', label: '借款' },
      { key: '/finance/invoice', label: '发票管理' }
    ]
  },
  {
    key: '/project',
    icon: () => h(ProjectOutlined),
    label: '项目管理',
    children: [
      { key: '/project/list', label: '项目列表' },
      { key: '/project/task', label: '任务管理' },
      { key: '/project/board', label: '项目看板' }
    ]
  },
  {
    key: '/report',
    icon: () => h(FormOutlined),
    label: '工作汇报',
    children: [
      { key: '/report/mine', label: '我的汇报' },
      { key: '/report/subordinate', label: '下属汇报' },
      { key: '/report/statistics', label: '汇报统计' }
    ]
  }
];

// 监听路由变化更新菜单选中状态
watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path];
    // 展开父菜单
    const parentKey = '/' + path.split('/')[1];
    if (!openKeys.value.includes(parentKey) && menuItems.find(m => m.key === parentKey)?.children) {
      openKeys.value.push(parentKey);
    }
  },
  { immediate: true }
);

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

const handleSearch = () => {
  if (searchValue.value.trim()) {
    console.log('搜索:', searchValue.value);
  }
};

const showNotifications = () => {
  router.push('/office/announcement');
};

const openAI = () => {
  router.push('/ai');
};

const openIM = () => {
  router.push('/im');
};

const handleUserMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'profile':
      router.push('/hr/employee');
      break;
    case 'settings':
      break;
    case 'logout':
      userStore.logout();
      router.push('/login');
      break;
  }
};
</script>

<style scoped>
.timi-layout {
  min-height: 100vh;
  background: var(--timi-bg-secondary);
}

/* 侧边栏样式 */
.timi-layout-sider {
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  position: relative;
}

.timi-layout-sider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.timi-layout-logo {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-icon img {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.menu-container {
  padding: 12px 8px;
  position: relative;
  z-index: 1;
}

:deep(.ant-menu) {
  background: transparent;
  border-right: none;
}

:deep(.ant-menu-item),
:deep(.ant-menu-submenu-title) {
  border-radius: 10px;
  margin: 4px 0;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

:deep(.ant-menu-item:hover),
:deep(.ant-menu-submenu-title:hover) {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

:deep(.ant-menu-submenu-arrow) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.ant-menu-sub) {
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 10px;
  margin: 4px 0;
}

/* 主内容区 */
.timi-layout-main {
  background: var(--timi-bg-secondary);
}

/* 顶部导航 */
.timi-layout-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 99;
}

.timi-layout-header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.trigger-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--timi-bg-tertiary);
}

.trigger-wrapper:hover {
  background: var(--timi-primary-light);
  color: white;
  transform: scale(1.05);
}

.trigger {
  font-size: 18px;
}

/* 搜索框 */
.search-wrapper {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--timi-text-tertiary);
  font-size: 16px;
  z-index: 1;
}

.search-input {
  width: 100%;
  height: 42px;
  padding: 0 16px 0 42px;
  border: 1px solid var(--timi-border-color);
  border-radius: 21px;
  background: var(--timi-bg-tertiary);
  font-size: 14px;
  color: var(--timi-text-primary);
  transition: all 0.3s ease;
  outline: none;
}

.search-input::placeholder {
  color: var(--timi-text-quaternary);
}

.search-input:focus {
  background: var(--timi-bg-primary);
  border-color: var(--timi-primary-light);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 右侧头部 */
.timi-layout-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-divider {
  width: 1px;
  height: 24px;
  background: var(--timi-border-color);
  margin: 0 8px;
}

.header-icon-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--timi-text-secondary);
  font-size: 18px;
  position: relative;
}

.header-icon-btn:hover {
  background: var(--timi-bg-tertiary);
  color: var(--timi-primary);
  transform: translateY(-2px);
}

.ai-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.ai-btn:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  color: white;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
  transform: translateY(-2px);
}

.header-badge :deep(.ant-badge-count) {
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

/* 用户信息 */
.timi-layout-user {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px 6px 6px;
  border-radius: 14px;
  transition: all 0.3s ease;
  margin-left: 8px;
}

.timi-layout-user:hover {
  background: var(--timi-bg-tertiary);
}

.user-avatar-wrapper {
  position: relative;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: var(--timi-success);
  border: 2px solid white;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--timi-text-primary);
  line-height: 1.3;
}

.user-dept {
  font-size: 12px;
  color: var(--timi-text-tertiary);
  line-height: 1.2;
}

.user-arrow {
  font-size: 12px;
  color: var(--timi-text-quaternary);
  margin-left: 4px;
}

/* 用户下拉菜单 */
.user-dropdown-menu {
  min-width: 240px;
  padding: 8px;
  border-radius: 16px;
  box-shadow: var(--timi-shadow-xl);
  border: 1px solid var(--timi-border-color-light);
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
  border-radius: 12px;
  margin-bottom: 8px;
}

.user-dropdown-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-dropdown-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--timi-text-primary);
}

.user-dropdown-email {
  font-size: 13px;
  color: var(--timi-text-tertiary);
}

:deep(.user-dropdown-menu .ant-dropdown-menu-item) {
  border-radius: 10px;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

:deep(.user-dropdown-menu .ant-dropdown-menu-item:hover) {
  background: var(--timi-bg-tertiary);
}

:deep(.logout-item) {
  color: var(--timi-error);
}

:deep(.logout-item:hover) {
  background: rgba(239, 68, 68, 0.05) !important;
}

/* 内容区 */
.timi-layout-content {
  margin: 24px;
  min-height: calc(100vh - 120px);
}

/* 页面过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式 */
@media (max-width: 1200px) {
  .search-wrapper {
    width: 200px;
  }
}

@media (max-width: 992px) {
  .search-wrapper {
    display: none;
  }
  
  .user-info {
    display: none;
  }
}
</style>
