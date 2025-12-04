<template>
  <v-card
      v-if="hasSensorData"
      variant="outlined"
      class="mb-4"
  >
    <v-card-title
        class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <span>Sensor-Trends</span>
      <span class="text-caption text-medium-emphasis">
        Letzte {{ recentCount }} Messungen
      </span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <div class="text-caption text-secondary mb-1">
            Temperatur (°C)
          </div>
          <v-sheet color="primary" rounded class="pa-2">
            <v-sparkline
                :model-value="temperatureValues"
                color="amber"
                height="80"
                :smooth="10"
                auto-draw
            />
          </v-sheet>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-secondary mb-1">
            Luftfeuchte (%)
          </div>
          <v-sheet color="primary" rounded class="pa-2">
            <v-sparkline
                :model-value="airHumidityValues"
                color="info"
                height="80"
                :smooth="10"
                auto-draw
            />
          </v-sheet>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-secondary mb-1">
            Bodenfeuchte (%)
          </div>
          <v-sheet color="primary" rounded class="pa-2">
            <v-sparkline
                :model-value="soilHumidityValues"
                color="success"
                height="80"
                :smooth="10"
                auto-draw
            />
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  hasSensorData: boolean
  recentCount: number
  temperatureValues: number[]
  airHumidityValues: number[]
  soilHumidityValues: number[]
}>()
</script>
