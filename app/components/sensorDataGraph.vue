<template>
  <v-card v-if="hasSensorData" variant="outlined" class="mb-4">
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
          <div class="text-caption text-secondary mb-1">Temperatur (°C)</div>
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
          <div class="text-caption text-secondary mb-1">Luftfeuchte (%)</div>
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
          <div class="text-caption text-secondary mb-1">Bodenfeuchte (%)</div>
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
import { computed } from "vue";
import type { PlantDTO } from "~/types/Plant";
import type { SensorData } from "~/types/SensorData";

const props = defineProps<{
  hasSensorData: boolean;
  plant: (PlantDTO & { sensorData?: SensorData[] }) | null;
}>();
const numeric = (value: string | number) => {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(num) ? 0 : num;
};
const recentData = computed<SensorData[]>(() => {
  if (!props.plant?.sensorData?.length) return [];
  const maxPoints = 24;
  const data = props.plant.sensorData;
  return data.slice(-maxPoints);
});
const temperatureValues = computed<number[]>(() =>
  recentData.value.map((d) => numeric(d.temperature)),
);
const airHumidityValues = computed<number[]>(() =>
  recentData.value.map((d) => numeric(d.humidity_air)),
);
const soilHumidityValues = computed<number[]>(() =>
  recentData.value.map((d) => numeric(d.humidity_soil)),
);
</script>
