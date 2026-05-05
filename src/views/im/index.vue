<template>
  <div class="im-page">
    <!-- 会话列表 -->
    <div class="im-sidebar">
      <div class="im-sidebar-header">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索联系人/群组"
          @search="searchSessions"
        />
      </div>
      <div class="im-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="im-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="im-session-list">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          class="im-session"
          :class="{ active: currentSessionId === session.id }"
          @click="selectSession(session.id)"
        >
          <div class="session-avatar">
            <a-avatar :src="session.avatar" :size="48">
              {{ session.name.charAt(0) }}
            </a-avatar>
            <span v-if="session.online" class="online-status"></span>
          </div>
          <div class="session-info">
            <div class="session-name-row">
              <span class="session-name">{{ session.name }}</span>
              <span class="session-time">{{ session.lastTime }}</span>
            </div>
            <div class="session-preview">
              <span v-if="session.isGroup" class="group-tag">群</span>
              <span class="preview-text">{{ session.lastMessage }}</span>
            </div>
          </div>
          <a-badge
            v-if="session.unread > 0"
            :count="session.unread"
            :overflow-count="99"
            class="session-badge"
          />
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div v-if="currentSession" class="im-main">
      <div class="im-header">
        <div class="im-header-info">
          <span class="im-header-name">{{ currentSession.name }}</span>
          <span v-if="currentSession.isGroup" class="im-header-count">
            ({{ currentSession.memberCount }}人)
          </span>
        </div>
        <div class="im-header-actions">
          <a-button type="text" @click="showSessionInfo">
            <MoreOutlined />
          </a-button>
        </div>
      </div>

      <div class="im-messages" ref="messageContainer">
        <div
          v-for="message in currentMessages"
          :key="message.id"
          class="im-message"
          :class="{ 'is-self': message.isSelf }"
        >
          <a-avatar :src="message.avatar" :size="36">
            {{ message.sender.charAt(0) }}
          </a-avatar>
          <div class="message-body">
            <div class="message-sender">{{ message.sender }}</div>
            <div class="message-content" :class="`type-${message.type}`">
              <template v-if="message.type === 'text'">
                {{ message.content }}
              </template>
              <template v-else-if="message.type === 'image'">
                <img :src="message.content" class="message-image" />
              </template>
              <template v-else-if="message.type === 'file'">
                <div class="message-file">
                  <FileOutlined />
                  <span>{{ message.fileName }}</span>
                  <a-button type="link" size="small">下载</a-button>
                </div>
              </template>
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>

      <div class="im-input-area">
        <div class="input-toolbar">
          <a-button type="text" @click="showEmoji">
            <SmileOutlined />
          </a-button>
          <a-button type="text" @click="uploadImage">
            <PictureOutlined />
          </a-button>
          <a-button type="text" @click="uploadFile">
            <FolderOutlined />
          </a-button>
          <a-button type="text" @click="showQuickReply">
            <ThunderboltOutlined />
          </a-button>
        </div>
        <a-textarea
          v-model:value="inputMessage"
          :rows="4"
          placeholder="输入消息..."
          @keydown="handleKeydown"
        />
        <div class="input-actions">
          <span class="input-hint">按 Enter 发送，Shift + Enter 换行</span>
          <a-button
            type="primary"
            :disabled="!inputMessage.trim()"
            @click="sendMessage"
          >
            发送
          </a-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="im-empty">
      <div class="im-empty-content">
        <MessageOutlined class="empty-icon" />
        <p>选择一个会话开始聊天</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import {
  MoreOutlined,
  SmileOutlined,
  PictureOutlined,
  FolderOutlined,
  ThunderboltOutlined,
  FileOutlined,
  MessageOutlined
} from '@ant-design/icons-vue';

const searchKeyword = ref('');
const activeTab = ref('all');
const currentSessionId = ref<string | null>(null);
const inputMessage = ref('');
const messageContainer = ref<HTMLElement>();

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'group', label: '群组' }
];

const sessions = ref([
  {
    id: '1',
    name: '产品技术部',
    avatar: '',
    isGroup: true,
    memberCount: 32,
    lastMessage: '张三: 今天的评审会议改到下午3点',
    lastTime: '10:30',
    unread: 5,
    online: true
  },
  {
    id: '2',
    name: '李四',
    avatar: '',
    isGroup: false,
    lastMessage: '好的，我稍后发给你',
    lastTime: '09:45',
    unread: 0,
    online: true
  },
  {
    id: '3',
    name: '王五',
    avatar: '',
    isGroup: false,
    lastMessage: '这个需求需要再讨论一下',
    lastTime: '昨天',
    unread: 2,
    online: false
  },
  {
    id: '4',
    name: '项目管理群',
    avatar: '',
    isGroup: true,
    memberCount: 15,
    lastMessage: '赵六: 项目进度更新：已完成80%',
    lastTime: '昨天',
    unread: 0,
    online: true
  }
]);

const messages = ref<Record<string, any[]>>({
  '1': [
    { id: '1', sender: '张三', avatar: '', content: '大家注意，今天的评审会议改到下午3点', type: 'text', time: '10:30', isSelf: false },
    { id: '2', sender: '李四', avatar: '', content: '收到', type: 'text', time: '10:31', isSelf: false },
    { id: '3', sender: '我', avatar: '', content: '好的，我会准时参加', type: 'text', time: '10:32', isSelf: true }
  ],
  '2': [
    { id: '1', sender: '李四', avatar: '', content: '那个文档整理好了吗？', type: 'text', time: '09:40', isSelf: false },
    { id: '2', sender: '我', avatar: '', content: '还在整理，大概还需要半小时', type: 'text', time: '09:42', isSelf: true },
    { id: '3', sender: '李四', avatar: '', content: '好的，我稍后发给你', type: 'text', time: '09:45', isSelf: false }
  ]
});

const filteredSessions = computed(() => {
  let result = sessions.value;

  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(s => s.name.includes(searchKeyword.value));
  }

  // 标签过滤
  if (activeTab.value === 'unread') {
    result = result.filter(s => s.unread > 0);
  } else if (activeTab.value === 'group') {
    result = result.filter(s => s.isGroup);
  }

  return result;
});

const currentSession = computed(() => {
  return sessions.value.find(s => s.id === currentSessionId.value);
});

const currentMessages = computed(() => {
  return messages.value[currentSessionId.value || ''] || [];
});

const selectSession = (id: string) => {
  currentSessionId.value = id;
  // 清除未读
  const session = sessions.value.find(s => s.id === id);
  if (session) {
    session.unread = 0;
  }
};

const searchSessions = () => {
  // 搜索会话
};

const sendMessage = () => {
  if (!inputMessage.value.trim() || !currentSessionId.value) return;

  const newMessage = {
    id: Date.now().toString(),
    sender: '我',
    avatar: '',
    content: inputMessage.value,
    type: 'text',
    time: new Date().toLocaleTimeString(),
    isSelf: true
  };

  if (!messages.value[currentSessionId.value]) {
    messages.value[currentSessionId.value] = [];
  }
  messages.value[currentSessionId.value].push(newMessage);

  // 更新会话最后消息
  const session = sessions.value.find(s => s.id === currentSessionId.value);
  if (session) {
    session.lastMessage = inputMessage.value;
    session.lastTime = '刚刚';
  }

  inputMessage.value = '';
  scrollToBottom();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const showSessionInfo = () => {
  // 显示会话信息
};

const showEmoji = () => {
  // 显示表情选择器
};

const uploadImage = () => {
  // 上传图片
};

const uploadFile = () => {
  // 上传文件
};

const showQuickReply = () => {
  // 显示快捷回复
};

watch(currentMessages, scrollToBottom, { deep: true });
</script>

<style scoped>
.im-page {
  display: flex;
  height: calc(100vh - 112px);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.im-sidebar {
  width: 300px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.im-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.im-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.im-tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #595959;
  transition: all 0.3s;
}

.im-tab:hover,
.im-tab.active {
  color: #1890ff;
  background: #e6f7ff;
}

.im-session-list {
  flex: 1;
  overflow-y: auto;
}

.im-session {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.im-session:hover,
.im-session.active {
  background: #f5f5f5;
}

.session-avatar {
  position: relative;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #52c41a;
  border: 2px solid #fff;
  border-radius: 50%;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.session-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.session-time {
  font-size: 12px;
  color: #bfbfbf;
}

.session-preview {
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-tag {
  font-size: 10px;
  padding: 1px 4px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 3px;
}

.preview-text {
  font-size: 13px;
  color: #8c8c8c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-badge {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.im-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.im-header {
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.im-header-name {
  font-size: 16px;
  font-weight: 500;
}

.im-header-count {
  font-size: 13px;
  color: #8c8c8c;
  margin-left: 8px;
}

.im-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f5f5f5;
}

.im-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.im-message.is-self {
  flex-direction: row-reverse;
}

.message-body {
  max-width: 60%;
}

.message-sender {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.im-message.is-self .message-sender {
  text-align: right;
}

.message-content {
  padding: 10px 14px;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.im-message.is-self .message-content {
  background: #95ec69;
}

.message-image {
  max-width: 200px;
  border-radius: 4px;
}

.message-file {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-time {
  font-size: 11px;
  color: #bfbfbf;
  margin-top: 4px;
}

.im-message.is-self .message-time {
  text-align: right;
}

.im-input-area {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.input-hint {
  font-size: 12px;
  color: #bfbfbf;
}

.im-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.im-empty-content {
  text-align: center;
  color: #bfbfbf;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
</style>
