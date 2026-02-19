<template>
  <v-card
    v-if="history && history.length > 0"
    rounded="xl"
    elevation="4"
    class="mb-6"
  >
    <v-card-title class="text-h6 font-weight-bold d-flex align-center">
      <v-icon color="success" class="mr-2">mdi-trending-up</v-icon>
      Wachstumsverlauf
    </v-card-title>
    <v-card-text>
      <client-only>
        <apexchart
          type="line"
          height="350"
          :options="chartOptions"
          :series="series"
        />
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  history: Array<{
    timestamp: string;
    level: number;
    xp: number;
    health: number;
  }> | null;
}>();

const series = computed(() => {
  if (!props.history) return [];
  return [
    {
      name: "Level",
      data: props.history.map((h) => ({ x: h.timestamp, y: h.level })),
    },
    {
      name: "XP",
      data: props.history.map((h) => ({ x: h.timestamp, y: h.xp })),
    },
    {
      name: "Gesundheit",
      data: props.history.map((h) => ({ x: h.timestamp, y: h.health })),
    },
  ];
});

const chartOptions = computed(() => {
  const hist = props.history || [];
  const maxLevel = hist.length ? Math.max(...hist.map((h) => h.level)) : 1;
  const maxXp = hist.length ? Math.max(...hist.map((h) => h.xp)) : 0;
  const roundUp = (n: number, step: number) => Math.ceil((n || 0) / step) * step;

  return {
    chart: {
      id: "growth-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        format: "dd.MM",
      },
    },
    yaxis: [
      {
        min: 1,
        max: Math.max(2, maxLevel + 1),
        title: { text: "Level" },
        decimalsInFloat: 0,
        labels: { style: { colors: "#4CAF50" } },
      },
      {
        min: 0,
        max: Math.max(100, roundUp(maxXp, 100)),
        opposite: true,
        title: { text: "XP" },
        labels: { style: { colors: "#2196F3" } },
      },
      {
        min: 0,
        max: 100,
        opposite: true,
        title: { text: "Gesundheit" },
        labels: { style: { colors: "#F44336" } },
      },
    ],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#4CAF50", "#2196F3", "#F44336"],
    tooltip: {
      x: { format: "dd.MM.yyyy HH:mm" },
      shared: true,
    },
    legend: {
      position: "top",
    },
  };
});
</script>
