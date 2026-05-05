<template>
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useTheme } from '@gitcoffee/timioa-ui';

const { themeConfig } = useTheme();
</script>

<style>
@import './styles/global.css';
</style>
