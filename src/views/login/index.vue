<template>
  <div class="login-page">
    <!-- 动态背景 -->
    <div class="login-bg-animation">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- 左侧内容区 -->
    <div class="login-hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>AI 驱动的智慧办公平台</span>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">TimiOA</span>
          <br />
          <span class="title-secondary">让工作更高效</span>
        </h1>
        <p class="hero-description">
          融合 AI 智能助手与即时通讯，打造下一代办公自动化体验
        </p>
        
        <div class="feature-list">
          <div class="feature-item" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon" :style="{ background: feature.gradient }">
              <component :is="feature.icon" />
            </div>
            <div class="feature-text">
              <div class="feature-title">{{ feature.title }}</div>
              <div class="feature-desc">{{ feature.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="hero-decoration">
        <div class="floating-card card-1">
          <CheckCircleFilled class="card-icon" />
          <span>审批通过</span>
        </div>
        <div class="floating-card card-2">
          <MessageFilled class="card-icon" />
          <span>3 条新消息</span>
        </div>
        <div class="floating-card card-3">
          <CalendarFilled class="card-icon" />
          <span>会议提醒</span>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-wrapper">
            <img src="/logo.png" alt="TimiOA" class="login-logo" />
          </div>
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-subtitle">请登录您的账户以继续</p>
        </div>

        <a-form
          :model="formState"
          name="login"
          class="login-form"
          @finish="handleLogin"
        >
          <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <div class="input-wrapper">
              <UserOutlined class="input-icon" />
              <a-input
                v-model:value="formState.username"
                placeholder="用户名 / 邮箱 / 手机号"
                class="modern-input"
                size="large"
              />
            </div>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <div class="input-wrapper">
              <LockOutlined class="input-icon" />
              <a-input-password
                v-model:value="formState.password"
                placeholder="请输入密码"
                class="modern-input"
                size="large"
              />
            </div>
          </a-form-item>

          <div class="form-options">
            <a-checkbox v-model:checked="formState.remember" class="remember-checkbox">
              记住我
            </a-checkbox>
            <a class="forgot-link" @click="handleForgotPassword">忘记密码？</a>
          </div>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="login-button"
              size="large"
              :loading="loading"
              block
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登录中...</span>
            </a-button>
          </a-form-item>

          <div class="divider">
            <span>或使用以下方式登录</span>
          </div>

          <div class="social-login">
            <div class="social-btn wechat">
              <WechatOutlined />
            </div>
            <div class="social-btn dingtalk">
              <DingtalkOutlined />
            </div>
            <div class="social-btn feishu">
              <RocketOutlined />
            </div>
          </div>
        </a-form>

        <div class="login-footer">
          <p>还没有账户？ <a class="register-link">立即注册</a></p>
          <p class="copyright">© 2025 TimiOA. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserOutlined,
  LockOutlined,
  RobotFilled,
  MessageFilled,
  FundFilled,
  SafetyCertificateFilled,
  CheckCircleFilled,
  CalendarFilled,
  WechatOutlined,
  DingtalkOutlined,
  RocketOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '~/stores/user';
import { message } from 'ant-design-vue';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const formState = reactive({
  username: '',
  password: '',
  remember: true
});

const features = [
  {
    icon: RobotFilled,
    title: 'AI 智能助手',
    desc: '24/7 智能问答与任务辅助',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
  },
  {
    icon: MessageFilled,
    title: '即时通讯',
    desc: '高效团队协作与沟通',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  },
  {
    icon: FundFilled,
    title: '数据驱动',
    desc: '智能分析与决策支持',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  },
  {
    icon: SafetyCertificateFilled,
    title: '企业级安全',
    desc: '多重加密与权限管控',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  }
];

const handleLogin = async (values: any) => {
  loading.value = true;
  try {
    if (import.meta.env.DEV) {
      console.warn(
        '%c⚠️ TimiOA Mock Login',
        'color: #f59e0b; font-size: 14px; font-weight: bold;',
        '\n当前为开发模式，使用模拟登录。生产环境请配置真实 API。'
      );

      await new Promise(resolve => setTimeout(resolve, 800));

      userStore.setToken('dev_mock_token_' + Date.now());
      userStore.setUserInfo({
        id: 'dev_1',
        name: values.username || '开发者',
        avatar: '',
        email: 'dev@timioa.local',
        deptName: '开发部',
        position: '开发工程师'
      });

      message.success('登录成功（开发模式）');
      router.push('/workbench');
    } else {
      message.error('请配置后端 API 服务后登录');
    }
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  message.info('请联系管理员重置密码');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  background: #0f0f1a;
  position: relative;
  overflow: hidden;
}

/* 动态背景 */
.login-bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -150px;
  right: 30%;
  animation-delay: -5s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  top: 40%;
  left: 20%;
  animation-delay: -10s;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 左侧内容区 */
.login-hero {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 560px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #fff;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #c4b5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-secondary {
  font-size: 42px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 48px;
}

/* 特性列表 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(8px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.feature-text {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

/* 装饰元素 */
.hero-decoration {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  animation: float 6s infinite ease-in-out;
}

.card-icon {
  font-size: 20px;
}

.card-1 {
  top: -120px;
  right: 0;
  animation-delay: 0s;
}

.card-1 .card-icon {
  color: #10b981;
}

.card-2 {
  top: 0;
  right: 80px;
  animation-delay: -2s;
}

.card-2 .card-icon {
  color: #3b82f6;
}

.card-3 {
  top: 120px;
  right: 20px;
  animation-delay: -4s;
}

.card-3 .card-icon {
  color: #f59e0b;
}

/* 右侧登录表单 */
.login-form-container {
  width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-wrapper {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
}

.login-logo {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 15px;
  color: #6b7280;
}

/* 表单样式 */
.login-form {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #9ca3af;
  z-index: 1;
  transition: color 0.3s ease;
}

:deep(.modern-input) {
  height: 52px;
  padding-left: 48px !important;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 15px;
  transition: all 0.3s ease;
}

:deep(.modern-input:hover) {
  border-color: #d1d5db;
  background: #fff;
}

:deep(.modern-input:focus) {
  border-color: #4f46e5;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

:deep(.modern-input:focus + .input-icon),
.input-wrapper:focus-within .input-icon {
  color: #4f46e5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 24px;
}

:deep(.remember-checkbox) {
  color: #4b5563;
  font-size: 14px;
}

.forgot-link {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #4338ca;
}

.login-button {
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.5);
}

.login-button:active {
  transform: translateY(0);
}

/* 分隔线 */
.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
}

.divider span {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  padding: 0 16px;
  font-size: 13px;
  color: #9ca3af;
}

/* 社交登录 */
.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.social-btn.wechat {
  color: #07c160;
}

.social-btn.wechat:hover {
  background: rgba(7, 193, 96, 0.1);
  border-color: #07c160;
}

.social-btn.dingtalk {
  color: #0089ff;
}

.social-btn.dingtalk:hover {
  background: rgba(0, 137, 255, 0.1);
  border-color: #0089ff;
}

.social-btn.feishu {
  color: #3370ff;
}

.social-btn.feishu:hover {
  background: rgba(51, 112, 255, 0.1);
  border-color: #3370ff;
}

/* 底部 */
.login-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.login-footer p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.register-link {
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
}

.register-link:hover {
  text-decoration: underline;
}

.copyright {
  font-size: 12px !important;
  color: #9ca3af !important;
  margin-top: 16px;
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

/* 响应式 */
@media (max-width: 1200px) {
  .login-hero {
    display: none;
  }
  
  .login-form-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 24px;
  }
}
</style>
