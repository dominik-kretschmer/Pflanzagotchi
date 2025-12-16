<script setup lang="ts">
const navItems = [
  { title: "Suche", to: "/search/Plant", icon: "mdi-magnify" },
  { title: "Pflanzen", to: "/", icon: "mdi-leaf" },
];
</script>

<template>
  <v-container
    fluid
    class="d-flex align-center justify-space-between bg-blue-lighten-2"
  >
    <div class="d-flex align-center ga-5">
      <v-avatar color="primary" variant="tonal" size="50">
        <v-icon>mdi-sprout</v-icon>
      </v-avatar>
      <h1 class="text-h3 font-weight-bold mb-0">Pflanzagotchi</h1>
    </div>
    <div class="d-flex align-center ga-2">
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        color="primary"
      >
        <v-icon start>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </div>
  </v-container>
</template>
