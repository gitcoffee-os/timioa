<template>
  <div class="flow-pending-page">
    <!-- 顶部统计卡片 -->
    <div class="stats-banner">
      <div class="stats-card primary" @click="filterByType('all')">
        <div class="stats-icon">
          <InboxOutlined />
        </div>
        <div class="stats-info">
          <div class="stats-value">{{ stats.total }}</div>
          <div class="stats-label">待审批</div>
        </div>
        <div class="stats-wave"></div>
      </div>
      <div class="stats-card warning" @click="filterByType('urgent')">
        <div class="stats-icon">
          <ClockCircleOutlined />
        </div>
        <div class="stats-info">
          <div class="stats-value">{{ stats.urgent }}</div>
          <div class="stats-label">紧急</div>
        </div>
        <div class="stats-wave"></div>
      </div>
      <div class="stats-card success" @click="filterByType('today')">
        <div class="stats-icon">
          <CalendarOutlined />
        </div>
        <div class="stats-info">
          <div class="stats-value">{{ stats.today }}</div>
          <div class="stats-label">今日新增</div>
        </div>
        <div class="stats-wave"></div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar-section">
      <div class="toolbar-left">
        <div class="search-box">
          <SearchOutlined class="search-icon" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索审批单号、标题、申请人..."
            @input="handleSearch"
          />
          <CloseCircleOutlined
            v-if="searchKeyword"
            class="clear-icon"
            @click="clearSearch"
          />
        </div>
        <div class="filter-tags">
          <span
            v-for="tag in filterTags"
            :key="tag.key"
            class="filter-tag"
            :class="{ active: currentFilter === tag.key }"
            @click="setFilter(tag.key)"
          >
            <component :is="tag.icon" />
            {{ tag.label }}
            <span v-if="tag.count" class="tag-count">{{ tag.count }}</span>
          </span>
        </div>
      </div>
      <div class="toolbar-right">
        <a-button
          v-if="selectedRows.length > 0"
          type="primary"
          class="batch-btn"
          @click="showBatchModal"
        >
          <CheckCircleOutlined />
          批量审批 ({{ selectedRows.length }})
        </a-button>
        <a-dropdown>
          <a-button class="sort-btn">
            <SortAscendingOutlined />
            {{ sortLabel }}
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleSort">
              <a-menu-item key="time-desc">最新优先</a-menu-item>
              <a-menu-item key="time-asc">最早优先</a-menu-item>
              <a-menu-item key="urgent">紧急优先</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button class="view-toggle" @click="toggleView">
          <UnorderedListOutlined v-if="isCardView" />
          <AppstoreOutlined v-else />
        </a-button>
      </div>
    </div>

    <!-- 批量操作浮动栏 -->
    <transition name="slide-up">
      <div v-if="selectedRows.length > 0" class="batch-action-bar">
        <div class="batch-info">
          <a-checkbox
            :checked="isAllSelected"
            :indeterminate="isIndeterminate"
            @change="toggleSelectAll"
          />
          <span class="batch-text">已选 {{ selectedRows.length }} 项</span>
        </div>
        <div class="batch-actions">
          <a-button type="primary" class="action-btn approve" @click="batchApprove">
            <CheckOutlined />
            批量同意
          </a-button>
          <a-button class="action-btn reject" @click="batchReject">
            <CloseOutlined />
            批量驳回
          </a-button>
          <a-button class="action-btn transfer" @click="batchTransfer">
            <SwapOutlined />
            批量转交
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" danger @click="clearSelection">
            <DeleteOutlined />
            清空选择
          </a-button>
        </div>
      </div>
    </transition>

    <!-- 卡片视图 -->
    <div v-if="isCardView" class="card-grid">
      <div
        v-for="item in filteredData"
        :key="item.id"
        class="approval-card"
        :class="{ selected: isSelected(item.id), urgent: item.isUrgent }"
        @click="toggleSelect(item)"
      >
        <div class="card-checkbox" @click.stop>
          <a-checkbox
            :checked="isSelected(item.id)"
            @change="toggleSelect(item)"
          />
        </div>
        <div class="card-urgent-badge" v-if="item.isUrgent">
          <FireFilled />
          紧急
        </div>
        <div class="card-header">
          <div class="card-type" :style="{ background: getTypeGradient(item.type) }">
            <component :is="getTypeIcon(item.type)" />
            {{ item.typeName }}
          </div>
          <div class="card-time">
            <ClockCircleOutlined />
            {{ formatTime(item.createTime) }}
          </div>
        </div>
        <div class="card-content">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-code">{{ item.code }}</div>
          <div class="card-applicant">
            <a-avatar :size="28" :src="item.applicantAvatar">
              {{ item.applicant.charAt(0) }}
            </a-avatar>
            <span class="applicant-name">{{ item.applicant }}</span>
            <span class="applicant-dept">{{ item.department }}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-amount" v-if="item.amount">
            <span class="amount-label">金额</span>
            <span class="amount-value">¥{{ item.amount }}</span>
          </div>
          <div class="card-actions">
            <a-button type="primary" size="small" @click.stop="quickApprove(item)">
              <CheckOutlined />
            </a-button>
            <a-button size="small" @click.stop="viewDetail(item)">
              <EyeOutlined />
            </a-button>
          </div>
        </div>
        <div class="card-hover-effect"></div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="list-view">
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :row-selection="rowSelection"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <div class="type-cell" :style="{ background: getTypeGradient(record.type) }">
              <component :is="getTypeIcon(record.type)" />
              <span>{{ record.typeName }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'title'">
            <div class="title-cell">
              <span class="title-text">{{ record.title }}</span>
              <a-tag v-if="record.isUrgent" color="red" class="urgent-tag">
                <FireFilled /> 紧急
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.key === 'applicant'">
            <div class="applicant-cell">
              <a-avatar :size="32" :src="record.applicantAvatar">
                {{ record.applicant.charAt(0) }}
              </a-avatar>
              <div class="applicant-info">
                <div class="applicant-name">{{ record.applicant }}</div>
                <div class="applicant-dept">{{ record.department }}</div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <div class="action-cell">
              <a-tooltip title="快速同意">
                <a-button type="primary" shape="circle" size="small" @click="quickApprove(record)">
                  <CheckOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="查看详情">
                <a-button shape="circle" size="small" @click="viewDetail(record)">
                  <EyeOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="更多">
                <a-dropdown>
                  <a-button shape="circle" size="small">
                    <MoreOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="transfer(record)">
                        <SwapOutlined />
                        转交他人
                      </a-menu-item>
                      <a-menu-item @click="addComment(record)">
                        <MessageOutlined />
                        添加备注
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 快速审批抽屉 -->
    <a-drawer
      v-model:open="quickApproveVisible"
      title="快速审批"
      width="480px"
      :closable="false"
      class="quick-approve-drawer"
    >
      <div v-if="currentRecord" class="quick-approve-content">
        <div class="approve-preview">
          <div class="preview-header" :style="{ background: getTypeGradient(currentRecord.type) }">
            <component :is="getTypeIcon(currentRecord.type)" class="preview-icon" />
            <div class="preview-title">{{ currentRecord.typeName }}</div>
          </div>
          <div class="preview-body">
            <div class="preview-item">
              <span class="preview-label">审批单号</span>
              <span class="preview-value">{{ currentRecord.code }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">申请人</span>
              <span class="preview-value">{{ currentRecord.applicant }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">申请时间</span>
              <span class="preview-value">{{ currentRecord.createTime }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">标题</span>
              <span class="preview-value">{{ currentRecord.title }}</span>
            </div>
            <div class="preview-item" v-if="currentRecord.amount">
              <span class="preview-label">金额</span>
              <span class="preview-value amount">¥{{ currentRecord.amount }}</span>
            </div>
          </div>
        </div>
        <div class="approve-actions">
          <div class="action-title">审批意见</div>
          <div class="quick-comments">
            <span
              v-for="comment in quickComments"
              :key="comment"
              class="quick-comment-tag"
              :class="{ active: approveForm.comment === comment }"
              @click="approveForm.comment = comment"
            >
              {{ comment }}
            </span>
          </div>
          <a-textarea
            v-model:value="approveForm.comment"
            :rows="3"
            placeholder="请输入审批意见（可选）"
            class="comment-input"
          />
          <div class="action-buttons">
            <a-button type="primary" size="large" block @click="submitApprove('agree')">
              <CheckCircleOutlined />
              同意
            </a-button>
            <a-button size="large" block danger @click="submitApprove('reject')">
              <CloseCircleOutlined />
              驳回
            </a-button>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 批量审批弹窗 -->
    <a-modal
      v-model:open="batchModalVisible"
      title="批量审批"
      width="600px"
      :confirm-loading="batchSubmitting"
      @ok="submitBatchApprove"
    >
      <div class="batch-preview">
        <div class="batch-summary">
          <div class="summary-item">
            <span class="summary-label">已选择</span>
            <span class="summary-value">{{ selectedRows.length }} 条审批</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">涉及金额</span>
            <span class="summary-value amount">¥{{ batchTotalAmount }}</span>
          </div>
        </div>
        <a-divider />
        <div class="batch-types">
          <div v-for="(count, type) in batchTypeCount" :key="type" class="type-badge">
            {{ type }}: {{ count }}
          </div>
        </div>
      </div>
      <a-form layout="vertical">
        <a-form-item label="审批结果">
          <a-radio-group v-model:value="batchForm.result">
            <a-radio-button value="agree">
              <CheckOutlined /> 同意
            </a-radio-button>
            <a-radio-button value="reject">
              <CloseOutlined /> 驳回
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审批意见">
          <a-textarea
            v-model:value="batchForm.comment"
            :rows="3"
            placeholder="请输入批量审批的统一意见"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import {
  InboxOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  SwapOutlined,
  DeleteOutlined,
  MoreOutlined,
  MessageOutlined,
  SortAscendingOutlined,
  DownOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FireFilled,
  FileTextOutlined,
  DollarOutlined,
  CarOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

// 状态
const searchKeyword = ref('');
const currentFilter = ref('all');
const loading = ref(false);
const isCardView = ref(true);
const selectedRows = ref<any[]>([]);
const quickApproveVisible = ref(false);
const batchModalVisible = ref(false);
const batchSubmitting = ref(false);
const currentRecord = ref<any>(null);
const sortType = ref('time-desc');

const approveForm = reactive({
  result: 'agree',
  comment: ''
});

const batchForm = reactive({
  result: 'agree',
  comment: ''
});

// 快速评论选项
const quickComments = ['同意', '已核实，准予通过', '情况属实，批准', '请补充材料'];

// 筛选标签
const filterTags = [
  { key: 'all', label: '全部', icon: 'InboxOutlined', count: 0 },
  { key: 'leave', label: '请假', icon: 'CalendarOutlined', count: 2 },
  { key: 'expense', label: '报销', icon: 'DollarOutlined', count: 2 },
  { key: 'overtime', label: '加班', icon: 'ClockCircleOutlined', count: 1 },
  { key: 'business', label: '出差', icon: 'CarOutlined', count: 1 }
];

// 统计数据
const stats = reactive({
  total: 12,
  urgent: 3,
  today: 5
});

// 表格列定义
const columns = [
  { title: '审批类型', key: 'type', width: 140 },
  { title: '标题', key: 'title', ellipsis: true },
  { title: '申请人', key: 'applicant', width: 180 },
  { title: '申请时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' }
];

// 模拟数据
const data = ref([
  {
    id: '1',
    code: 'SP20250408001',
    type: 'leave',
    typeName: '请假申请',
    applicant: '张三',
    applicantAvatar: '',
    department: '技术部',
    createTime: '2025-04-08 09:30',
    title: '因家中有事请假3天，已安排好工作交接',
    isUrgent: false,
    amount: null
  },
  {
    id: '2',
    code: 'SP20250408002',
    type: 'expense',
    typeName: '费用报销',
    applicant: '李四',
    applicantAvatar: '',
    department: '销售部',
    createTime: '2025-04-08 10:15',
    title: '上海客户拜访差旅费报销',
    isUrgent: true,
    amount: 2580
  },
  {
    id: '3',
    code: 'SP20250408003',
    type: 'overtime',
    typeName: '加班申请',
    applicant: '王五',
    applicantAvatar: '',
    department: '技术部',
    createTime: '2025-04-08 11:00',
    title: '项目上线前紧急加班申请',
    isUrgent: true,
    amount: null
  },
  {
    id: '4',
    code: 'SP20250408004',
    type: 'leave',
    typeName: '请假申请',
    applicant: '赵六',
    applicantAvatar: '',
    department: '人事部',
    createTime: '2025-04-08 14:20',
    title: '病假1天，已提供医院证明',
    isUrgent: false,
    amount: null
  },
  {
    id: '5',
    code: 'SP20250408005',
    type: 'expense',
    typeName: '费用报销',
    applicant: '钱七',
    applicantAvatar: '',
    department: '行政部',
    createTime: '2025-04-08 15:45',
    title: '办公用品采购报销',
    isUrgent: false,
    amount: 680
  },
  {
    id: '6',
    code: 'SP20250408006',
    type: 'business',
    typeName: '出差申请',
    applicant: '孙八',
    applicantAvatar: '',
    department: '销售部',
    createTime: '2025-04-08 16:30',
    title: '深圳展会出差申请（3天）',
    isUrgent: true,
    amount: 3500
  }
]);

const pagination = {
  pageSize: 12,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条待审批`
};

// 计算属性
const filteredData = computed(() => {
  let result = data.value;
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword) ||
      item.applicant.toLowerCase().includes(keyword)
    );
  }
  
  // 类型过滤
  if (currentFilter.value && currentFilter.value !== 'all') {
    if (currentFilter.value === 'urgent') {
      result = result.filter(item => item.isUrgent);
    } else if (currentFilter.value === 'today') {
      result = result.filter(item => dayjs(item.createTime).isSame(dayjs(), 'day'));
    } else {
      result = result.filter(item => item.type === currentFilter.value);
    }
  }
  
  // 排序
  result = [...result].sort((a, b) => {
    if (sortType.value === 'urgent') {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
    }
    const timeA = dayjs(a.createTime).valueOf();
    const timeB = dayjs(b.createTime).valueOf();
    return sortType.value === 'time-asc' ? timeA - timeB : timeB - timeA;
  });
  
  return result;
});

const isAllSelected = computed(() => {
  return selectedRows.value.length === filteredData.value.length && filteredData.value.length > 0;
});

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < filteredData.value.length;
});

const sortLabel = computed(() => {
  const labels: Record<string, string> = {
    'time-desc': '最新优先',
    'time-asc': '最早优先',
    'urgent': '紧急优先'
  };
  return labels[sortType.value] || '排序';
});

const batchTotalAmount = computed(() => {
  return selectedRows.value.reduce((sum, item) => sum + (item.amount || 0), 0);
});

const batchTypeCount = computed(() => {
  const count: Record<string, number> = {};
  selectedRows.value.forEach(item => {
    count[item.typeName] = (count[item.typeName] || 0) + 1;
  });
  return count;
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRows.value.map(item => item.id),
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedRows.value = selectedRows;
  }
}));

// 方法
const handleSearch = () => {
  // 防抖搜索
};

const clearSearch = () => {
  searchKeyword.value = '';
};

const setFilter = (key: string) => {
  currentFilter.value = key;
};

const filterByType = (type: string) => {
  currentFilter.value = type;
};

const toggleView = () => {
  isCardView.value = !isCardView.value;
};

const handleSort = ({ key }: { key: string }) => {
  sortType.value = key;
};

const isSelected = (id: string) => {
  return selectedRows.value.some(item => item.id === id);
};

const toggleSelect = (item: any) => {
  const index = selectedRows.value.findIndex(i => i.id === item.id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(item);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = [...filteredData.value];
  }
};

const clearSelection = () => {
  selectedRows.value = [];
};

const quickApprove = (record: any) => {
  currentRecord.value = record;
  approveForm.comment = '';
  quickApproveVisible.value = true;
};

const viewDetail = (record: any) => {
  message.info(`查看详情: ${record.title}`);
};

const submitApprove = (result: string) => {
  message.success(result === 'agree' ? '已同意' : '已驳回');
  quickApproveVisible.value = false;
};

const showBatchModal = () => {
  batchModalVisible.value = true;
};

const submitBatchApprove = () => {
  batchSubmitting.value = true;
  setTimeout(() => {
    message.success(`批量${batchForm.result === 'agree' ? '同意' : '驳回'} ${selectedRows.value.length} 条审批`);
    batchSubmitting.value = false;
    batchModalVisible.value = false;
    selectedRows.value = [];
  }, 1000);
};

const batchApprove = () => {
  batchForm.result = 'agree';
  showBatchModal();
};

const batchReject = () => {
  batchForm.result = 'reject';
  showBatchModal();
};

const batchTransfer = () => {
  message.info('批量转交功能');
};

const transfer = (record: any) => {
  message.info(`转交: ${record.title}`);
};

const addComment = (record: any) => {
  message.info(`添加备注: ${record.title}`);
};

const formatTime = (time: string) => {
  return dayjs(time).fromNow();
};

const getTypeGradient = (type: string) => {
  const gradients: Record<string, string> = {
    leave: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    expense: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    overtime: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    business: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
  };
  return gradients[type] || 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    leave: CalendarOutlined,
    expense: DollarOutlined,
    overtime: ClockCircleOutlined,
    business: CarOutlined
  };
  return icons[type] || FileTextOutlined;
};
</script>

<style scoped>
.flow-pending-page {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 统计卡片 */
.stats-banner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stats-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stats-card.primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.stats-card.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: white;
}

.stats-card.success {
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  color: white;
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  backdrop-filter: blur(10px);
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  opacity: 0.9;
}

.stats-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 0 0 16px 16px;
}

/* 工具栏 */
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  height: 44px;
  padding: 0 40px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-icon,
.clear-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

.search-icon {
  left: 14px;
}

.clear-icon {
  right: 14px;
  cursor: pointer;
  transition: color 0.3s;
}

.clear-icon:hover {
  color: #ef4444;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover,
.filter-tag.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 9px;
  font-size: 11px;
}

.toolbar-right {
  display: flex;
  gap: 12px;
}

.batch-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  border-radius: 10px;
  font-weight: 500;
}

.sort-btn,
.view-toggle {
  border-radius: 10px;
}

/* 批量操作栏 */
.batch-action-bar {
  position: fixed;
  bottom: 24px;
  left: 280px;
  right: 24px;
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.batch-text {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
}

.batch-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 10px;
}

.action-btn.approve {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border: none;
}

.action-btn.reject {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  border: none;
}

.action-btn.transfer {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
  border: none;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.approval-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;
}

.approval-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.approval-card.selected {
  border-color: #4f46e5;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
}

.approval-card.urgent {
  border-left: 4px solid #ef4444;
}

.card-checkbox {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.card-urgent-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-left: 32px;
}

.card-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.card-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.card-content {
  margin-bottom: 16px;
  padding-left: 32px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-code {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.card-applicant {
  display: flex;
  align-items: center;
  gap: 10px;
}

.applicant-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.applicant-dept {
  font-size: 12px;
  color: #9ca3af;
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 32px;
}

.card-amount {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 11px;
  color: #9ca3af;
}

.amount-value {
  font-size: 18px;
  font-weight: 700;
  color: #10b981;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(79, 70, 229, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.approval-card:hover .card-hover-effect {
  opacity: 1;
}

/* 列表视图 */
.list-view {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.type-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  font-weight: 500;
}

.urgent-tag {
  font-size: 11px;
  padding: 0 6px;
  height: 20px;
  line-height: 18px;
}

.applicant-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.applicant-info {
  display: flex;
  flex-direction: column;
}

.action-cell {
  display: flex;
  gap: 8px;
}

/* 快速审批抽屉 */
.quick-approve-drawer :deep(.ant-drawer-header) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-bottom: none;
}

.quick-approve-drawer :deep(.ant-drawer-title) {
  color: white;
  font-weight: 600;
}

.quick-approve-drawer :deep(.ant-drawer-close) {
  color: white;
}

.quick-approve-content {
  padding: 0;
}

.approve-preview {
  margin: -24px -24px 24px;
}

.preview-header {
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
}

.preview-icon {
  font-size: 40px;
  opacity: 0.9;
}

.preview-title {
  font-size: 24px;
  font-weight: 700;
}

.preview-body {
  padding: 24px;
  background: white;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.preview-label {
  color: #6b7280;
  font-size: 14px;
}

.preview-value {
  font-weight: 500;
  color: #1f2937;
}

.preview-value.amount {
  color: #10b981;
  font-size: 18px;
  font-weight: 700;
}

.approve-actions {
  padding: 0 24px 24px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.quick-comments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.quick-comment-tag {
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-comment-tag:hover,
.quick-comment-tag.active {
  background: #4f46e5;
  color: white;
}

.comment-input {
  border-radius: 12px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 批量审批弹窗 */
.batch-preview {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.batch-summary {
  display: flex;
  gap: 32px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.summary-value.amount {
  color: #10b981;
}

.batch-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.type-badge {
  padding: 4px 12px;
  background: white;
  border-radius: 12px;
  font-size: 12px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-banner {
    grid-template-columns: 1fr;
  }
  
  .toolbar-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-right {
    justify-content: flex-end;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .batch-action-bar {
    left: 16px;
    right: 16px;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
