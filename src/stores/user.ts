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

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@gitcoffee/timioa-utils';

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('');
  const userInfo = ref<Partial<User>>({});
  const unreadCount = ref(0);
  const messageCount = ref(0);

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userId = computed(() => userInfo.value.id);

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('timioa_token', newToken);
  };

  const setUserInfo = (info: User) => {
    userInfo.value = info;
    localStorage.setItem('timioa_user_info', JSON.stringify(info));
  };

  const loadFromStorage = () => {
    const storedToken = localStorage.getItem('timioa_token');
    const storedUserInfo = localStorage.getItem('timioa_user_info');
    if (storedToken) {
      token.value = storedToken;
    }
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo);
      } catch {
        userInfo.value = {};
      }
    }
  };

  const logout = () => {
    token.value = '';
    userInfo.value = {};
    localStorage.removeItem('timioa_token');
    localStorage.removeItem('timioa_user_info');
  };

  const setUnreadCount = (count: number) => {
    unreadCount.value = count;
  };

  const setMessageCount = (count: number) => {
    messageCount.value = count;
  };

  return {
    token,
    userInfo,
    unreadCount,
    messageCount,
    isLoggedIn,
    userId,
    setToken,
    setUserInfo,
    loadFromStorage,
    logout,
    setUnreadCount,
    setMessageCount
  };
});
