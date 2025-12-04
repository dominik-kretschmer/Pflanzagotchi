<script setup lang="ts">
import { computed, ref } from "vue";
import { useAsyncData } from "#app";
import { usePlants } from "@/composables/usePlants";
import type { PlantDTO } from "@/types/Plant";
import OverViewHeader from "~/components/overViewHeader.vue";
import SearchFilterBar from "~/components/searchFilterBar.vue";
import PlantCard from "~/components/plantCard.vue";

const { fetchPlants } = usePlants();

const { data, pending, error } = await useAsyncData<PlantDTO[]>(
  "plants-overview",
  () => fetchPlants(),
);

const plants = computed(() => data.value ?? []);

const search = ref("");
const locationFilter = ref<string | null>(null);
const typeFilter = ref<string | null>(null);
const sortBy = ref<"name" | "date" | "location">("name");

const numeric = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};

const average = (values: number[]) => {
  if (!values.length) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
};

const plantCount = computed(() => plants.value.length);

const avgSun = computed(() =>
  average(plants.value.map((p) => numeric(p.pref_sun))),
);
const avgAirHumidity = computed(() =>
  average(plants.value.map((p) => numeric(p.pref_air_humidity))),
);
const avgSoilHumidity = computed(() =>
  average(plants.value.map((p) => numeric(p.pref_soil_humidity))),
);

const locations = computed(() => {
  const set = new Set(plants.value.map((p) => p.location).filter(Boolean));
  return Array.from(set);
});

const types = computed(() => {
  const set = new Set(plants.value.map((p) => p.type).filter(Boolean));
  return Array.from(set);
});

const filteredPlants = computed(() => {
  let list = [...plants.value];

  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((p) => {
      const fields = [
        p.custom_name,
        p.name,
        p.botanical_name,
        p.location,
        p.type,
      ];
      return fields.some((f) => f?.toString().toLowerCase().includes(q));
    });
  }

  if (locationFilter.value) {
    list = list.filter((p) => p.location === locationFilter.value);
  }

  if (typeFilter.value) {
    list = list.filter((p) => p.type === typeFilter.value);
  }

  list.sort((a, b) => {
    if (sortBy.value === "name") {
      return (a.custom_name || a.name).localeCompare(b.custom_name || b.name);
    }
    if (sortBy.value === "location") {
      return a.location.localeCompare(b.location);
    }
    if (sortBy.value === "date") {
      return a.date_planted.localeCompare(b.date_planted);
    }
    return 0;
  });

  return list;
});
</script>

<template>
  <v-container fluid class="py-8">
    <OverViewHeader
      v-if="!error"
      :plant-count="plantCount"
      :avg-sun="avgSun"
      :avg-air-humidity="avgAirHumidity"
      :avg-soil-humidity="avgSoilHumidity"
    />
    <SearchFilterBar
      v-if="!error"
      v-model:search="search"
      v-model:location-filter="locationFilter"
      v-model:type-filter="typeFilter"
      v-model:sort-by="sortBy"
      :locations="locations"
      :types="types"
    />
    <v-alert
      v-if="!pending && !error && !filteredPlants.length"
      type="info"
      variant="tonal"
      border="start"
      class="mb-4"
    >
      Keine Pflanzen gefunden. Passe die Filter an oder lege eine neue Pflanze
      an.
    </v-alert>
    <v-row v-if="pending">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      border="start"
      border-color="error"
      class="mb-4"
    >
      Fehler beim Laden der Pflanzen: {{ error.message }}
    </v-alert>
    <v-alert
      v-else-if="!filteredPlants.length"
      type="info"
      variant="tonal"
      border="start"
      class="mb-4"
    >
      Keine Pflanzen gefunden. Passe die Filter an oder lege eine neue Pflanze
      an.
    </v-alert>
    <v-row v-else>
      <v-col
        v-for="plant in filteredPlants"
        :key="plant.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <PlantCard :plant="plant" />
      </v-col>
    </v-row>
  </v-container>
</template>
