<template>
  <div class="flow-apply-page">
    <div class="page-header">
      <h1 class="page-title">发起申请</h1>
      <p class="page-subtitle">选择审批类型，快速发起审批流程</p>
    </div>

    <div class="flow-templates">
      <div class="template-category" v-for="category in templateCategories" :key="category.key">
        <h3 class="category-title">{{ category.name }}</h3>
        <div class="template-grid">
          <div
            v-for="template in category.templates"
            :key="template.key"
            class="template-card"
            @click="startApply(template)"
          >
            <div class="template-icon" :style="{ background: template.color }">
              <component :is="getIcon(template.icon)" />
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请表单弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="currentTemplate?.name"
      width="800px"
      :confirm-loading="submitting"
      @ok="submitForm"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item label="标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="说明" required>
          <a-textarea v-model:value="formData.description" :rows="4" placeholder="请输入详细说明" />
        </a-form-item>
        <a-form-item label="附件">
          <a-upload-dragger>
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此处上传</p>
            <p class="ant-upload-hint">支持单个或批量上传</p>
          </a-upload-dragger>
        </a-form-item>
        <a-form-item label="审批人" required>
          <a-select
            v-model:value="formData.approvers"
            mode="multiple"
            placeholder="请选择审批人"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShoppingOutlined,
  PrinterOutlined,
  InboxOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const formVisible = ref(false);
const submitting = ref(false);
const currentTemplate = ref<any>(null);
const formData = ref({
  title: '',
  description: '',
  approvers: []
});

const templateCategories = [
  {
    key: 'attendance',
    name: '假勤类',
    templates: [
      { key: 'leave', name: '请假申请', description: '事假、病假、年假等各类请假', icon: 'ClockCircleOutlined', color: '#1890ff' },
      { key: 'overtime', name: '加班申请', description: '工作日、休息日加班申请', icon: 'ClockCircleOutlined', color: '#52c41a' },
      { key: 'business', name: '出差申请', description: '国内外出差申请', icon: 'CarOutlined', color: '#faad14' },
      { key: 'out', name: '外出申请', description: '临时外出申请', icon: 'CarOutlined', color: '#722ed1' }
    ]
  },
  {
    key: 'finance',
    name: '财务类',
    templates: [
      { key: 'expense', name: '费用报销', description: '差旅费、办公费等报销', icon: 'DollarOutlined', color: '#ff4d4f' },
      { key: 'loan', name: '借款申请', description: '预借款申请', icon: 'DollarOutlined', color: '#eb2f96' },
      { key: 'purchase', name: '采购申请', description: '办公用品、设备采购', icon: 'ShoppingOutlined', color: '#13c2c2' }
    ]
  },
  {
    key: 'admin',
    name: '行政类',
    templates: [
      { key: 'seal', name: '用印申请', description: '公章、合同章使用申请', icon: 'FileTextOutlined', color: '#f5222d' },
      { key: 'car', name: '用车申请', description: '公务用车申请', icon: 'CarOutlined', color: '#fa8c16' },
      { key: 'print', name: '文印申请', description: '文件打印、复印申请', icon: 'PrinterOutlined', color: '#1890ff' }
    ]
  }
];

const iconMap: Record<string, any> = {
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShoppingOutlined,
  PrinterOutlined,
  InboxOutlined
};

const getIcon = (iconName: string) => iconMap[iconName] || FileTextOutlined;

const startApply = (template: any) => {
  currentTemplate.value = template;
  formData.value = { title: '', description: '', approvers: [] };
  formVisible.value = true;
};

const submitForm = async () => {
  if (!formData.value.title || !formData.value.description) {
    message.error('请填写完整信息');
    return;
  }

  submitting.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  message.success('申请提交成功');
  submitting.value = false;
  formVisible.value = false;
};
</script>

<style scoped>
.flow-apply-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #8c8c8c;
}

.template-category {
  margin-bottom: 32px;
}

.category-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.template-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.template-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.template-desc {
  font-size: 13px;
  color: #8c8c8c;
}
</style>
