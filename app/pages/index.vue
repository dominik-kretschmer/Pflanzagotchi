<script setup lang="ts">
import { computed, ref } from "vue";
import { useAsyncData } from "#app";
import { usePlants } from "@/composables/usePlants";
import type { PlantDTO } from "@/types/Plant";
import { usePlantUtils } from "@/composables/usePlantUtils";
import OverViewHeader from "~/components/overViewHeader.vue";
import SearchFilterBar from "~/components/searchFilterBar.vue";
import PlantCard from "~/components/plantCard.vue";

const { fetchPlants } = usePlants();
const { numeric, average } = usePlantUtils();
const userId = useCookie("user-id");

const { data, pending, error } = await useAsyncData<PlantDTO[]>(
  `plants-overview-${userId.value}`,
  () => fetchPlants(),
  { watch: [userId] },
);

const plants = computed(() => data.value ?? []);
const search = ref("");
const locationFilter = ref<string | null>(null);
const typeFilter = ref<string | null>(null);
const sortBy = ref<"name" | "date" | "location">("name");
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

const unauthorized = computed(() => {
  const e: any = error?.value ?? null;
  const code = (e && (e.statusCode ?? e.data?.statusCode ?? e.status ?? e.response?.status)) ?? null;
  return code === 401;
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

    <v-row v-if="pending">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <v-alert
      v-else-if="unauthorized"
      type="info"
      variant="tonal"
      border="start"
      border-color="info"
      class="mb-4"
    >
      <div class="d-flex align-center justify-space-between w-100">
        <span>Bitte melde dich an, um deine Pflanzen zu sehen.</span>
        <div class="d-flex ga-2">
          <v-btn color="primary" variant="flat" to="/login">Anmelden</v-btn>
          <v-btn color="secondary" variant="text" to="/login">Registrieren</v-btn>
        </div>
      </div>
    </v-alert>

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

    <template v-else>
      <v-alert
        v-if="!filteredPlants.length"
        type="info"
        variant="tonal"
        border="start"
        class="mb-4"
      >
        Keine Pflanzen gefunden. Passe die Filter an oder lege eine neue Pflanze
        an.
      </v-alert>

      <v-row>
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

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            class="add-plant-card"
            variant="outlined"
            link
            to="/CreatePlantForm"
          >
            <v-card-text
              class="d-flex flex-column align-center justify-center h-100"
            >
              <v-icon size="56">mdi-plus</v-icon>
              <div class="text-subtitle-1 mt-2">Pflanze anlegen</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
