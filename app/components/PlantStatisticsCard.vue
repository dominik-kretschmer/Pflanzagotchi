<template>
  <v-card v-if="stats" rounded="xl" elevation="4" class="mb-6">
    <v-card-title class="text-h6 font-weight-bold d-flex align-center">
      <v-icon color="secondary" class="mr-2">mdi-chart-box</v-icon>
      Pflege-Statistiken
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4" class="text-center">
          <div class="text-h5 font-weight-bold text-info">
            {{ stats.stats.total_water_count }}
          </div>
          <div class="text-caption text-medium-emphasis">Mal gegossen</div>
        </v-col>
        <v-col cols="12" sm="4" class="text-center">
          <div class="text-h5 font-weight-bold text-success">
            {{ stats.stats.total_fertilize_count }}
          </div>
          <div class="text-caption text-medium-emphasis">Mal gedüngt</div>
        </v-col>
        <v-col cols="12" sm="4" class="text-center">
          <div class="text-h5 font-weight-bold text-warning">
            {{ stats.stats.total_prune_count }}
          </div>
          <div class="text-caption text-medium-emphasis">Mal geschnitten</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    stats: {
      total_water_count: number;
      total_fertilize_count: number;
      total_prune_count: number;
      total_sensor_checks: number;
    };
  } | null;
}>();
</script>
