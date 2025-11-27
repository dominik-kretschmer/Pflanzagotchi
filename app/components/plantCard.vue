<script setup lang="ts">
defineProps<{
  id: number;
  name: string;
  art: string;
  stamm: string;
  water: number;
  sun: number;
  humidity: number;
}>()
</script>
<template>
  <v-card class="plant-card" elevation="2" rounded="lg">
    <v-img src="/img/phil.png" height="500px" cover alt="Pflanze"/>
    <v-card-item>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle>{{ art }}</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      Sein Stamm ist {{ stamm }}.
    </v-card-text>
    <v-card-item>
      <ClientOnly>
        <StatusBars :water="water" :sun="sun" :humidity="humidity"/>
      </ClientOnly>
    </v-card-item>
    <v-card-actions>
      <v-spacer/>
      <NuxtLink :to="`/plant${id}`">
        Öffnen
      </NuxtLink>
    </v-card-actions>
  </v-card>
</template>
