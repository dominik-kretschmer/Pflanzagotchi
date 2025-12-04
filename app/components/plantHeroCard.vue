<script setup lang="ts">
import {useFormat} from '@/composables/useFormat';
import type {PlantDTO} from '@/types/plants';

const props = defineProps<{
  plant: PlantDTO;
}>();

const formater = useFormat();

const mainImageUrl = computed(() => {
  const gd = props.plant.gen_data;
  if (!gd) return null;
  if (gd.image_url) return gd.image_url;
  const first = allImages.value[0];
  return first ? first.url : null;
});
</script>

<template>
  <v-card
      class="mb-4"
      color="primary"
      theme="dark"
      elevation="8"
  >
    <v-row class="ma-0">
      <!-- Text-Info -->
      <v-col
          cols="12"
          md="6"
          class="pa-6 d-flex flex-column justify-space-between ga-4"
      >
        <div class="d-flex flex-column ga-2">
          <div class="d-flex align-center ga-2">
            <v-chip
                label
                density="comfortable"
                color="secondary"
                variant="flat"
                class="text-uppercase text-caption"
            >
              Plant Artifact · #{{ plant.id }}
            </v-chip>

            <v-chip
                v-if="plant.gen_data?.api_id"
                density="comfortable"
                variant="outlined"
                color="secondary"
                class="text-caption"
            >
              API-ID: {{ plant.gen_data.api_id }}
            </v-chip>
          </div>

          <div>
            <div class="text-h4 font-weight-bold">
              {{ plant.custom_name || plant.name }}
            </div>
            <div class="text-subtitle-2 text-secondary text-uppercase mt-1">
              {{ plant.botanical_name }}
            </div>
          </div>

          <div class="text-body-2 text-secondary">
            Typ:
            <span class="font-weight-medium text-white">{{ plant.type }}</span>
            · Standort:
            <span class="font-weight-medium text-white">{{ plant.location }}</span>
          </div>
        </div>

        <div class="d-flex flex-column ga-2 text-caption text-secondary">
          <div class="d-flex align-center ga-2">
            <v-icon size="14" color="secondary">mdi-sprout</v-icon>
            <span>Gepflanzt am {{ formater.formatDate(plant.date_planted) }}</span>
          </div>
          <div class="d-flex align-center ga-2">
            <v-icon size="14" color="info">mdi-water</v-icon>
            <span>Zuletzt gegossen am {{ formater.formatDate(plant.last_water) }}</span>
          </div>
          <div class="d-flex align-center ga-2">
            <v-icon size="14" color="warning">mdi-flask</v-icon>
            <span>Zuletzt gedüngt am {{ formater.formatDate(plant.last_fertelized) }}</span>
          </div>
          <div
              v-if="plant.gen_data?.sources && plant.gen_data.sources.length"
              class="d-flex flex-wrap ga-1 mt-1"
          >
            <v-chip
                v-for="source in plant.gen_data.sources"
                :key="source"
                size="x-small"
                color="secondary"
                variant="tonal"
            >
              {{ source }}
            </v-chip>
          </div>
        </div>
      </v-col>

      <!-- Bild -->
      <v-col cols="12" md="6" class="pa-0">
        <v-img
            v-if="mainImageUrl"
            :src="mainImageUrl"
            :alt="plant.custom_name || plant.name"
            height="100%"
            class="rounded-t-0 rounded-b-lg rounded-e-lg"
            cover
        >
          <template #placeholder>
            <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
            >
              <v-progress-circular indeterminate color="secondary"/>
            </v-row>
          </template>
        </v-img>
        <div
            v-else
            class="d-flex align-center justify-center text-caption text-secondary"
            style="min-height: 220px;"
        >
          Kein Bild verfügbar
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>