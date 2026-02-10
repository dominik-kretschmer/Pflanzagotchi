<template>
  <v-container fluid class="py-6">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <div v-if="pending">
          <v-skeleton-loader type="card, list-item-two-line, table" />
        </div>
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          border="start"
          border-color="error"
          class="mb-4"
        >
          Fehler beim Laden der Pflanze: {{ error.message }}
        </v-alert>
        <v-alert
          v-else-if="!plant"
          type="info"
          variant="tonal"
          border="start"
          class="mb-4"
        >
          Keine Pflanze gefunden.
        </v-alert>
        <div v-else class="d-flex flex-column ga-6">
          <div class="d-flex justify-end ga-2">
            <v-btn
              color="info"
              variant="tonal"
              prepend-icon="mdi-water"
              :loading="isWatering"
              @click="onWater"
            >
              Gießen
            </v-btn>
            <v-btn
              color="success"
              variant="tonal"
              prepend-icon="mdi-bottle-wine"
              :loading="isFertilizing"
              @click="onFertilize"
            >
              Düngen
            </v-btn>
            <v-btn
              color="warning"
              variant="tonal"
              prepend-icon="mdi-content-cut"
              :loading="isPruning"
              @click="onPrune"
            >
              Zurückschneiden
            </v-btn>
            <v-spacer />
            <v-btn
              color="secondary"
              variant="elevated"
              prepend-icon="mdi-pencil"
              :to="`/Plants/edit/${plant.id}`"
            >
              Bearbeiten
            </v-btn>
          </div>
          <PlantHeroCard :plant="plant" />
          <v-card rounded="xl" elevation="4" class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  Pflanzen-Status
                </div>
                <div class="d-flex align-center ga-4">
                  <v-avatar color="success" size="48">
                    <span class="text-white font-weight-bold"
                      >Lvl {{ plant.level }}</span
                    >
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-space-between text-caption mb-1">
                      <span>XP: {{ plant.xp }} / 500</span>
                      <span>{{ Math.round((plant.xp / 500) * 100) }}%</span>
                    </div>
                    <v-progress-linear
                      :model-value="(plant.xp / 500) * 100"
                      color="success"
                      height="8"
                      rounded
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="8">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  Gesundheit
                </div>
                <div class="d-flex align-center ga-4">
                  <v-icon
                    :color="plant.health > 50 ? 'success' : 'error'"
                    size="32"
                  >
                    {{
                      plant.health > 50 ? "mdi-heart" : "mdi-heart-pulse"
                    }}
                  </v-icon>
                  <div class="flex-grow-1">
                    <v-progress-linear
                      :model-value="plant.health"
                      :color="plant.health > 50 ? 'success' : 'error'"
                      height="12"
                      rounded
                      striped
                    />
                  </div>
                  <span class="text-h6 font-weight-bold"
                    >{{ plant.health }}%</span
                  >
                </div>
              </v-col>
            </v-row>
          </v-card>
          <BasisAttributeGrid :plant="plant" />
          <GrowthLoreCard :growth="plant.gen_data?.growth" />
          <SensorDataGraph :has-sensor-data="hasSensorData" :plant="plant" />
          <v-expansion-panels multiple>
            <v-expansion-panel v-if="allImages.length">
              <galerieExpPanel :images="allImages" />
            </v-expansion-panel>
            <v-expansion-panel>
              <rawDataExpPanel
                :has-sensor-data="hasSensorData"
                :sensor-data="plant.sensorData || []"
              />
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { usePlants } from "@/composables/usePlants";
import SensorDataGraph from "@/components/sensorDataGraph.vue";
import rawDataExpPanel from "@/components/rawDataExpPanel.vue";
import galerieExpPanel from "@/components/galerieExpPanel.vue";
import GrowthLoreCard from "@/components/growthLoreCard.vue";
import BasisAttributeGrid from "@/components/basisAttributeGrid.vue";
import PlantHeroCard from "@/components/plantHeroCard.vue";
import type { PlantDTO } from "@/types/Plant";
import type { SensorData } from "@/types/SensorData";

type PlantDetail = PlantDTO & {
  sensorData: SensorData[];
};

const route = useRoute();
const { fetchPlant, updatePlant } = usePlants();

const isWatering = ref(false);
const isFertilizing = ref(false);
const isPruning = ref(false);

const onWater = async () => {
  if (!plant.value) return;
  isWatering.value = true;
  try {
    await updatePlant(plant.value.id, {
      last_water: new Date().toISOString(),
    });
    window.location.reload();
  } catch (e) {
    console.error("Error watering plant", e);
  } finally {
    isWatering.value = false;
  }
};

const onFertilize = async () => {
  if (!plant.value) return;
  isFertilizing.value = true;
  try {
    await updatePlant(plant.value.id, {
      last_fertilized: new Date().toISOString(),
    });
    window.location.reload();
  } catch (e) {
    console.error("Error fertilizing plant", e);
  } finally {
    isFertilizing.value = false;
  }
};

const onPrune = async () => {
  if (!plant.value) return;
  isPruning.value = true;
  try {
    await updatePlant(plant.value.id, {
      last_pruning: new Date().toISOString(),
    });
    window.location.reload();
  } catch (e) {
    console.error("Error pruning plant", e);
  } finally {
    isPruning.value = false;
  }
};

const { data, pending, error } = await useAsyncData<PlantDetail | null>(
  "plant-detail",
  () => fetchPlant(Number(route.params.id)),
);

const plant = computed(() => data.value!);
const hasSensorData = computed(
  () => !!plant.value?.sensorData && plant.value.sensorData.length > 0,
);

const allImages = computed(() => {
  const gd = plant.value?.gen_data;
  if (!gd?.images) return [];
  const result: Array<{
    url: string;
    license?: string;
    author?: string;
    category: keyof NonNullable<typeof gd.images>;
  }> = [];
  const categories: (keyof NonNullable<typeof gd.images>)[] = [
    "habit",
    "leaf",
    "flower",
    "fruit",
    "bark",
    "other",
  ];

  for (const cat of categories) {
    const imgs = gd.images?.[cat];
    if (imgs && imgs.length) {
      imgs.forEach((img) => {
        if (img.url) {
          result.push({ ...img, category: cat });
        }
      });
    }
  }
  return result;
});
</script>
