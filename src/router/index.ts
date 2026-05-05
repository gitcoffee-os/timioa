/**
 * Copyright (c) 2025-2099 GitCoffee All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '~/layouts/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('~/views/login/index.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench',
    children: [
      // 工作台
      {
        path: 'workbench',
        name: 'Workbench',
        component: () => import('~/views/workbench/index.vue'),
        meta: { title: '工作台', icon: 'DashboardOutlined' }
      },
      // 日常办公
      {
        path: 'office',
        name: 'Office',
        redirect: '/office/announcement',
        meta: { title: '日常办公', icon: 'FileTextOutlined' },
        children: [
          {
            path: 'announcement',
            name: 'Announcement',
            component: () => import('~/views/office/announcement/index.vue'),
            meta: { title: '通知公告' }
          },
          {
            path: 'document',
            name: 'Document',
            component: () => import('~/views/office/document/index.vue'),
            meta: { title: '我的文档' }
          },
          {
            path: 'knowledge',
            name: 'Knowledge',
            component: () => import('~/views/office/knowledge/index.vue'),
            meta: { title: '知识库' }
          }
        ]
      },
      // OA审批
      {
        path: 'flow',
        name: 'Flow',
        redirect: '/flow/workbench',
        meta: { title: 'OA审批', icon: 'AuditOutlined' },
        children: [
          {
            path: 'workbench',
            name: 'FlowWorkbench',
            component: () => import('~/views/flow/workbench/index.vue'),
            meta: { title: '审批工作台' }
          },
          {
            path: 'apply',
            name: 'FlowApply',
            component: () => import('~/views/flow/apply/index.vue'),
            meta: { title: '发起申请' }
          },
          {
            path: 'pending',
            name: 'FlowPending',
            component: () => import('~/views/flow/pending/index.vue'),
            meta: { title: '待审批' }
          },
          {
            path: 'processed',
            name: 'FlowProcessed',
            component: () => import('~/views/flow/processed/index.vue'),
            meta: { title: '已审批' }
          },
          {
            path: 'initiated',
            name: 'FlowInitiated',
            component: () => import('~/views/flow/initiated/index.vue'),
            meta: { title: '我发起的' }
          }
        ]
      },
      // 会议管理
      {
        path: 'meeting',
        name: 'Meeting',
        redirect: '/meeting/list',
        meta: { title: '会议管理', icon: 'VideoCameraOutlined' },
        children: [
          {
            path: 'list',
            name: 'MeetingList',
            component: () => import('~/views/meeting/list/index.vue'),
            meta: { title: '会议列表' }
          },
          {
            path: 'room',
            name: 'MeetingRoom',
            component: () => import('~/views/meeting/room/index.vue'),
            meta: { title: '会议室预定' }
          },
          {
            path: 'minutes',
            name: 'MeetingMinutes',
            component: () => import('~/views/meeting/minutes/index.vue'),
            meta: { title: '会议纪要' }
          }
        ]
      },
      // 日程计划
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('~/views/schedule/index.vue'),
        meta: { title: '日程计划', icon: 'CalendarOutlined' }
      },
      // 假勤管理
      {
        path: 'attendance',
        name: 'Attendance',
        redirect: '/attendance/checkin',
        meta: { title: '假勤管理', icon: 'ClockCircleOutlined' },
        children: [
          {
            path: 'checkin',
            name: 'AttendanceCheckin',
            component: () => import('~/views/attendance/checkin/index.vue'),
            meta: { title: '考勤打卡' }
          },
          {
            path: 'leave',
            name: 'AttendanceLeave',
            component: () => import('~/views/attendance/leave/index.vue'),
            meta: { title: '请假' }
          },
          {
            path: 'overtime',
            name: 'AttendanceOvertime',
            component: () => import('~/views/attendance/overtime/index.vue'),
            meta: { title: '加班' }
          },
          {
            path: 'business',
            name: 'AttendanceBusiness',
            component: () => import('~/views/attendance/business/index.vue'),
            meta: { title: '出差' }
          }
        ]
      },
      // 人事管理
      {
        path: 'hr',
        name: 'HR',
        redirect: '/hr/employee',
        meta: { title: '人事管理', icon: 'TeamOutlined' },
        children: [
          {
            path: 'employee',
            name: 'HREmployee',
            component: () => import('~/views/hr/employee/index.vue'),
            meta: { title: '员工管理' }
          },
          {
            path: 'department',
            name: 'HRDepartment',
            component: () => import('~/views/hr/department/index.vue'),
            meta: { title: '部门管理' }
          },
          {
            path: 'recruit',
            name: 'HRRecruit',
            component: () => import('~/views/hr/recruit/index.vue'),
            meta: { title: '招聘管理' }
          }
        ]
      },
      // 财务管理
      {
        path: 'finance',
        name: 'Finance',
        redirect: '/finance/expense',
        meta: { title: '财务管理', icon: 'DollarOutlined' },
        children: [
          {
            path: 'expense',
            name: 'FinanceExpense',
            component: () => import('~/views/finance/expense/index.vue'),
            meta: { title: '费用报销' }
          },
          {
            path: 'loan',
            name: 'FinanceLoan',
            component: () => import('~/views/finance/loan/index.vue'),
            meta: { title: '借款' }
          },
          {
            path: 'invoice',
            name: 'FinanceInvoice',
            component: () => import('~/views/finance/invoice/index.vue'),
            meta: { title: '发票管理' }
          }
        ]
      },
      // 项目管理
      {
        path: 'project',
        name: 'Project',
        redirect: '/project/list',
        meta: { title: '项目管理', icon: 'ProjectOutlined' },
        children: [
          {
            path: 'list',
            name: 'ProjectList',
            component: () => import('~/views/project/list/index.vue'),
            meta: { title: '项目列表' }
          },
          {
            path: 'task',
            name: 'ProjectTask',
            component: () => import('~/views/project/task/index.vue'),
            meta: { title: '任务管理' }
          },
          {
            path: 'board',
            name: 'ProjectBoard',
            component: () => import('~/views/project/board/index.vue'),
            meta: { title: '项目看板' }
          }
        ]
      },
      // 工作汇报
      {
        path: 'report',
        name: 'Report',
        redirect: '/report/mine',
        meta: { title: '工作汇报', icon: 'FormOutlined' },
        children: [
          {
            path: 'mine',
            name: 'ReportMine',
            component: () => import('~/views/report/mine/index.vue'),
            meta: { title: '我的汇报' }
          },
          {
            path: 'subordinate',
            name: 'ReportSubordinate',
            component: () => import('~/views/report/subordinate/index.vue'),
            meta: { title: '下属汇报' }
          },
          {
            path: 'statistics',
            name: 'ReportStatistics',
            component: () => import('~/views/report/statistics/index.vue'),
            meta: { title: '汇报统计' }
          }
        ]
      },
      // AI智能中心
      {
        path: 'ai',
        name: 'AI',
        component: () => import('~/views/ai/index.vue'),
        meta: { title: 'AI助手', icon: 'RobotOutlined' }
      },
      // IM即时通讯
      {
        path: 'im',
        name: 'IM',
        component: () => import('~/views/im/index.vue'),
        meta: { title: '消息', icon: 'MessageOutlined' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('~/views/error/404.vue')
  }
];

const router = createRouter({
  history: createWebHistory('/oa/'),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
