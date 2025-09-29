<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView :key="$route.fullPath" />
</template>

<style>
@import '/src/assets/scss/config/default/app.scss';
@import '/src/assets/custom-css/dataTables.bootstrap5.min.css';
@import '/src/assets/custom-css/responsive.bootstrap.min.css';
@import '/src/assets/custom-css/ckeditor.bootstrap.min.css';
</style>
