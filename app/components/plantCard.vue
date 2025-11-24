<script setup lang="ts">
defineProps<{
  name: string;
  art: string;
  stamm: string;
}>()
</script>

<template>
  <v-card class="plant-card" elevation="2" rounded="lg">
    <v-img src="/img/phil.png" height="500px" cover alt="Pflanze" />

    <v-card-item>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle>{{ art }}</v-card-subtitle>
    </v-card-item>

    <v-card-text>
      Sein Stamm ist {{ stamm }}.
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" variant="elevated">Mehr erfahren</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.plant-card {
  max-width: 360px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.plant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.v-card-title {
  font-weight: 700;
}
</style>