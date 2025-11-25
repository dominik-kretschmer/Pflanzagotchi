<script setup lang="ts">
const props = defineProps<{
  water: number
  sun: number
  humidity: number
}>()
</script>
<template>
  <v-container class="pa-4" style="max-width: 480px">
    <v-progress-linear
        :model-value="water"
        color="blue"
        height="24"
        rounded
        class="hp-bar mb-2"
    >
      <template #default="{ value }">
        <div class="hp-bar-label">
          Water {{ Math.round(value) }}%
        </div>
      </template>
    </v-progress-linear>

    <v-progress-linear
        :model-value="sun"
        color="yellow"
        height="24"
        rounded
        class="hp-bar mb-2"
    >
      <template #default="{ value }">
        <div class="hp-bar-label">
          Sun {{ Math.round(value) }}%
        </div>
      </template>
    </v-progress-linear>

    <v-progress-linear
        :model-value="humidity"
        color="red"
        height="24"
        rounded
        class="hp-bar"
    >
      <template #default="{ value }">
        <div class="hp-bar-label">
          Humidity {{ Math.round(value) }}%
        </div>
      </template>
    </v-progress-linear>
  </v-container>
</template>


