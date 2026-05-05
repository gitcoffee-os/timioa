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

import '@gitcoffee/design-ui';
import '@gitcoffee/theme-ui/oa.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import { permissionDirective, roleDirective } from '@gitcoffee/timioa-utils';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);

// 注册权限指令
app.directive('permission', permissionDirective);
app.directive('role', roleDirective);

app.mount('#app');
