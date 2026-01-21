<script setup lang="ts">
import type { PlantDTO } from "@/types/Plant";
import { useFormat } from "@/composables/useFormat";

defineProps<{
  plant: PlantDTO;
}>();

const formater = useFormat();

const mainImageForPlant = (plant: PlantDTO): string | null => {
  if (plant.gen_data?.image_url) return plant.gen_data.image_url;
  const imgs = plant.gen_data?.images;
  if (!imgs) return null;
  const order: (keyof typeof imgs)[] = [
    "habit",
    "leaf",
    "flower",
    "fruit",
    "bark",
    "other",
  ];
  for (const key of order) {
    const arr = imgs[key];
    if (arr && arr.length && arr[0].url) return arr[0].url;
  }
  return null;
};

const preferenceChipColor = (value: number) => {
  if (value >= 70) return "success";
  if (value >= 40) return "warning";
  return "info";
};
</script>
<template>
  <v-card rounded="xl" elevation="4" class="h-100 d-flex flex-column">
    <v-img
      :src="mainImageForPlant(plant) || undefined"
      :alt="plant.custom_name || plant.name"
      height="250"
      cover
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-img>

    <v-card-text class="pb-3">
      <div class="mb-1 text-overline text-medium-emphasis">
        {{ plant.type }} · {{ plant.location }}
      </div>
      <div class="text-subtitle-1 font-weight-bold">
        {{ plant.custom_name || plant.name }}
      </div>
      <div class="text-caption text-medium-emphasis">
        {{ plant.botanical_name }}
      </div>

      <div class="d-flex flex-wrap ga-2 mt-3">
        <v-chip
          size="x-small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-calendar-start"
        >
          seit {{ formater.formatDate(plant.date_planted) }}
        </v-chip>
        <v-chip
          v-if="plant.gen_data?.sources?.length"
          size="x-small"
          color="info"
          variant="tonal"
        >
          {{ plant.gen_data.sources.length }} Quelle(n)
        </v-chip>
      </div>

      <div class="mt-4 d-flex flex-column ga-2">
        <div class="d-flex align-center justify-space-between">
          <span class="text-caption text-medium-emphasis text-uppercase">
            Sonne
          </span>
          <v-chip
            size="x-small"
            :color="preferenceChipColor(plant.pref_sun)"
            variant="tonal"
          >
            {{ plant.pref_sun }}%
          </v-chip>
        </div>
        <v-progress-linear
          :model-value="plant.pref_sun"
          height="6"
          rounded
          color="amber"
        />

        <div class="d-flex align-center justify-space-between mt-2">
          <span class="text-caption text-medium-emphasis text-uppercase">
            Luftfeuchtigkeit
          </span>
          <v-chip
            size="x-small"
            :color="preferenceChipColor(plant.pref_air_humidity)"
            variant="tonal"
          >
            {{ plant.pref_air_humidity }}%
          </v-chip>
        </div>
        <v-progress-linear
          :model-value="plant.pref_air_humidity"
          height="6"
          rounded
          color="info"
        />

        <div class="d-flex align-center justify-space-between mt-2">
          <span class="text-caption text-medium-emphasis text-uppercase">
            Bodenfeuchtigkeit
          </span>
          <v-chip
            size="x-small"
            :color="preferenceChipColor(plant.pref_soil_humidity)"
            variant="tonal"
          >
            {{ plant.pref_soil_humidity }}%
          </v-chip>
        </div>
        <v-progress-linear
          :model-value="plant.pref_soil_humidity"
          height="6"
          rounded
          color="success"
        />
      </div>
    </v-card-text>

    <v-card-actions class="mt-auto pt-0 px-4 pb-4 d-flex justify-space-between">
      <div class="text-caption text-medium-emphasis">
        Zuletzt gegossen:
        <span class="font-weight-medium">
          {{ formater.formatDate(plant.last_water) }}
        </span>
      </div>
      <v-btn
        :to="`/plant${plant.id}`"
        variant="text"
        color="primary"
        size="small"
        append-icon="mdi-chevron-right"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
