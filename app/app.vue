<template>
  <div>
    <nuxt-page />
    <div>
      <test ></test>
    </div>
  </div>
</template>
<script setup lang="ts">
import './assets/css/plant.css';
import test from './components/test.server.vue';
</script>