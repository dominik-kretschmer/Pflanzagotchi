<template>
  <v-card v-if="hasSensorData" variant="outlined" class="mb-4">
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <span>Sensor-Trends</span>
      <span class="text-caption text-medium-emphasis">
        Letzte {{ recentData.length }} Messungen
      </span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <div class="text-caption text-secondary mb-1">Temperatur (°C)</div>
          <v-sheet color="primary" rounded class="pa-4">
            <div class="d-flex">
              <div
                class="text-caption text-white d-flex flex-column justify-space-between mr-2 py-1"
                style="height: 80px; font-size: 0.7rem !important"
              >
                <span>{{ temperatureStats.max }}</span>
                <span>{{ temperatureStats.min }}</span>
              </div>
              <div class="flex-grow-1">
                <v-sparkline
                  :model-value="temperatureValues"
                  color="amber"
                  height="80"
                  :smooth="10"
                  auto-draw
                />
                <div
                  class="text-caption text-white d-flex justify-space-between mt-1"
                  style="font-size: 0.7rem !important"
                >
                  <span>{{ timeLabels.start }}</span>
                  <span>{{ timeLabels.end }}</span>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-secondary mb-1">Luftfeuchte (%)</div>
          <v-sheet color="primary" rounded class="pa-4">
            <div class="d-flex">
              <div
                class="text-caption text-white d-flex flex-column justify-space-between mr-2 py-1"
                style="height: 80px; font-size: 0.7rem !important"
              >
                <span>{{ airHumidityStats.max }}</span>
                <span>{{ airHumidityStats.min }}</span>
              </div>
              <div class="flex-grow-1">
                <v-sparkline
                  :model-value="airHumidityValues"
                  color="info"
                  height="80"
                  :smooth="10"
                  auto-draw
                />
                <div
                  class="text-caption text-white d-flex justify-space-between mt-1"
                  style="font-size: 0.7rem !important"
                >
                  <span>{{ timeLabels.start }}</span>
                  <span>{{ timeLabels.end }}</span>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-secondary mb-1">Bodenfeuchte (%)</div>
          <v-sheet color="primary" rounded class="pa-4">
            <div class="d-flex">
              <div
                class="text-caption text-white d-flex flex-column justify-space-between mr-2 py-1"
                style="height: 80px; font-size: 0.7rem !important"
              >
                <span>{{ soilHumidityStats.max }}</span>
                <span>{{ soilHumidityStats.min }}</span>
              </div>
              <div class="flex-grow-1">
                <v-sparkline
                  :model-value="soilHumidityValues"
                  color="success"
                  height="80"
                  :smooth="10"
                  auto-draw
                />
                <div
                  class="text-caption text-white d-flex justify-space-between mt-1"
                  style="font-size: 0.7rem !important"
                >
                  <span>{{ timeLabels.start }}</span>
                  <span>{{ timeLabels.end }}</span>
                </div>
              </div>
            </div>
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

const formatTime = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

const timeLabels = computed(() => {
  if (recentData.value.length === 0) return { start: "", end: "" };
  return {
    start: formatTime(recentData.value[0].timestamp),
    end: formatTime(recentData.value[recentData.value.length - 1].timestamp),
  };
});

const getStats = (values: number[]) => {
  if (values.length === 0) return { min: 0, max: 0 };
  return {
    min: Math.floor(Math.min(...values)),
    max: Math.ceil(Math.max(...values)),
  };
};

const temperatureStats = computed(() => getStats(temperatureValues.value));
const airHumidityStats = computed(() => getStats(airHumidityValues.value));
const soilHumidityStats = computed(() => getStats(soilHumidityValues.value));
</script>
