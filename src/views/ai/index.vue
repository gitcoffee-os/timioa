<template>
  <div class="ai-page">
    <div class="ai-sidebar">
      <div class="ai-sidebar-header">
        <a-button type="primary" block @click="createNewChat">
          <PlusOutlined /> 新建对话
        </a-button>
      </div>
      <div class="ai-sidebar-content">
        <div class="chat-list">
          <div
            v-for="chat in chatList"
            :key="chat.id"
            class="chat-item"
            :class="{ active: currentChatId === chat.id }"
            @click="switchChat(chat.id)"
          >
            <MessageOutlined />
            <span class="chat-title">{{ chat.title }}</span>
            <a-dropdown>
              <MoreOutlined class="chat-more" @click.stop />
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="renameChat(chat)">重命名</a-menu-item>
                  <a-menu-item @click="deleteChat(chat.id)">删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </div>

    <div class="ai-main">
      <div class="ai-header">
        <h3>TimiAI 智能助手</h3>
        <div class="ai-tools">
          <a-button type="text" @click="clearChat">
            <ClearOutlined /> 清空对话
          </a-button>
          <a-button type="text" @click="showSettings">
            <SettingOutlined /> 设置
          </a-button>
        </div>
      </div>

      <div class="ai-content" ref="chatContainer">
        <div v-if="messages.length === 0" class="ai-welcome">
          <div class="ai-avatar-large">
            <RobotOutlined />
          </div>
          <h2>你好，我是 TimiAI</h2>
          <p>我可以帮助你完成以下工作：</p>
          <div class="ai-suggestions">
            <div
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="suggestion-item"
              @click="sendMessage(suggestion)"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>

        <div v-else class="ai-messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message-item"
            :class="{ 'is-user': message.role === 'user' }"
          >
            <div class="message-avatar">
              <a-avatar v-if="message.role === 'assistant'" style="background: #1890ff">
                <RobotOutlined />
              </a-avatar>
              <a-avatar v-else>{{ userInfo.name?.charAt(0) }}</a-avatar>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>

          <div v-if="isLoading" class="message-item">
            <div class="message-avatar">
              <a-avatar style="background: #1890ff">
                <RobotOutlined />
              </a-avatar>
            </div>
            <div class="message-content">
              <a-spin size="small" />
            </div>
          </div>
        </div>
      </div>

      <div class="ai-input-area">
        <div class="input-toolbar">
          <a-button type="text" @click="uploadFile">
            <PaperClipOutlined />
          </a-button>
          <a-button type="text" @click="showQuickActions">
            <AppstoreOutlined />
          </a-button>
        </div>
        <div class="input-box">
          <a-textarea
            v-model:value="inputMessage"
            :rows="3"
            placeholder="输入消息，按 Enter 发送，Shift + Enter 换行..."
            @keydown="handleKeydown"
          />
          <a-button
            type="primary"
            class="send-btn"
            :disabled="!inputMessage.trim() || isLoading"
            @click="sendMessage(inputMessage)"
          >
            <SendOutlined />
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import {
  PlusOutlined,
  MessageOutlined,
  MoreOutlined,
  ClearOutlined,
  SettingOutlined,
  RobotOutlined,
  SendOutlined,
  PaperClipOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const chatContainer = ref<HTMLElement>();
const currentChatId = ref('1');
const inputMessage = ref('');
const isLoading = ref(false);

const chatList = ref([
  { id: '1', title: '新建对话 1' },
  { id: '2', title: '费用报销流程咨询' },
  { id: '3', title: '请假申请帮助' }
]);

const messages = ref<any[]>([]);

const suggestions = [
  '如何发起费用报销申请？',
  '帮我写一份工作周报',
  '查询今天的会议安排',
  '解释一下公司的请假制度',
  '帮我总结一下这份文档的要点'
];

const formatMessage = (content: string) => {
  // 简单的Markdown格式化
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async (content: string) => {
  if (!content.trim() || isLoading.value) return;

  // 添加用户消息
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: content,
    time: new Date().toLocaleTimeString()
  });

  inputMessage.value = '';
  scrollToBottom();

  // 模拟AI回复
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));

  messages.value.push({
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: generateAIResponse(content),
    time: new Date().toLocaleTimeString()
  });

  isLoading.value = false;
  scrollToBottom();
};

const generateAIResponse = (userMessage: string) => {
  const responses: Record<string, string> = {
    '如何发起费用报销申请？': '发起费用报销申请的步骤如下：\n\n1. 点击左侧菜单【OA审批】-【发起申请】\n2. 选择【费用报销】模板\n3. 填写报销明细，包括费用类型、金额、发票等\n4. 上传相关附件\n5. 选择审批人\n6. 提交申请\n\n审批通过后，财务会在3个工作日内完成打款。',
    '帮我写一份工作周报': '好的，请告诉我本周您完成了哪些主要工作，我将帮您整理成规范的周报格式。\n\n您可以提供以下信息：\n- 本周完成的主要任务\n- 项目进展情况\n- 遇到的问题及解决方案\n- 下周工作计划',
    '查询今天的会议安排': '根据您的日程，今天有以下会议安排：\n\n**09:00** - 早会（会议室A）\n**10:30** - 项目评审（会议室B）\n**14:00** - 客户需求沟通（线上）\n**16:00** - 周会（大会议室）\n\n需要我帮您预定会议室或发送会议邀请吗？',
    '解释一下公司的请假制度': '公司请假制度概要：\n\n**年假**：工作满1年享5天，每增加1年加1天，最多15天\n**病假**：需提供医院证明，每年最多30天\n**事假**：每年最多10天，需提前3天申请\n**婚假**：3天\n**产假**：按国家规定执行\n\n请假需提前在OA系统提交申请，经直属领导审批后方可休假。'
  };

  return responses[userMessage] || '我理解您的问题，让我为您查询相关信息...\n\n这是一个模拟的AI回复。在实际应用中，这里会调用AI大模型API生成智能回复。';
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(inputMessage.value);
  }
};

const createNewChat = () => {
  const newId = (chatList.value.length + 1).toString();
  chatList.value.unshift({ id: newId, title: `新建对话 ${newId}` });
  currentChatId.value = newId;
  messages.value = [];
};

const switchChat = (id: string) => {
  currentChatId.value = id;
  // 加载对应聊天记录
  messages.value = [];
};

const renameChat = (chat: any) => {
  // 重命名聊天
  console.log('重命名:', chat);
};

const deleteChat = (id: string) => {
  const index = chatList.value.findIndex(c => c.id === id);
  if (index > -1) {
    chatList.value.splice(index, 1);
    if (currentChatId.value === id && chatList.value.length > 0) {
      currentChatId.value = chatList.value[0].id;
    }
  }
};

const clearChat = () => {
  messages.value = [];
};

const showSettings = () => {
  // 显示设置
};

const uploadFile = () => {
  // 上传文件
};

const showQuickActions = () => {
  // 显示快捷操作
};

watch(messages, scrollToBottom, { deep: true });
</script>

<style scoped>
.ai-page {
  display: flex;
  height: calc(100vh - 112px);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.ai-sidebar {
  width: 260px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.ai-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ai-sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.chat-list {
  padding: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.chat-item:hover,
.chat-item.active {
  background: #f5f5f5;
}

.chat-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.chat-more {
  opacity: 0;
  transition: opacity 0.3s;
}

.chat-item:hover .chat-more {
  opacity: 1;
}

.ai-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-header {
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.ai-tools {
  display: flex;
  gap: 8px;
}

.ai-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.ai-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.ai-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #fff;
  margin-bottom: 24px;
}

.ai-welcome h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.ai-welcome p {
  color: #8c8c8c;
  margin-bottom: 24px;
}

.ai-suggestions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 600px;
}

.suggestion-item {
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.suggestion-item:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.ai-messages {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-item {
  display: flex;
  gap: 12px;
}

.message-item.is-user {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 12px;
}

.message-item.is-user .message-content {
  background: #1890ff;
  color: #fff;
}

.message-text {
  line-height: 1.6;
}

.message-time {
  font-size: 12px;
  color: #bfbfbf;
  margin-top: 4px;
}

.message-item.is-user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.ai-input-area {
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input-box {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-box :deep(.ant-input) {
  resize: none;
}

.send-btn {
  flex-shrink: 0;
}
</style>
