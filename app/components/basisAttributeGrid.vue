<script setup lang="ts">
import { useFormat } from "@/composables/useFormat";
import type { PlantDTO } from "@/types/plants";

const props = defineProps<{
  plant: PlantDTO;
}>();

const formater = useFormat();

const numeric = (value: string | number) => {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(num) ? 0 : num;
};

const clampPercent = (value: string | number) => {
  const n = numeric(value);
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
};
</script>

<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      Basisattribute
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" class="h-100">
            <v-card-text>
              <div class="text-caption text-secondary text-uppercase">
                Sonneneinstrahlung
              </div>
              <div class="text-h5 font-weight-bold mt-1">
                {{ formater.formatDecimal(plant.pref_sun) }}%
              </div>
              <v-progress-linear
                class="mt-3"
                color="amber"
                :model-value="clampPercent(plant.pref_sun)"
                rounded
                height="8"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" class="h-100">
            <v-card-text>
              <div class="text-caption text-secondary text-uppercase">
                Luftfeuchtigkeit
              </div>
              <div class="text-h5 font-weight-bold mt-1">
                {{ formater.formatDecimal(plant.pref_air_humidity) }}%
              </div>
              <v-progress-linear
                class="mt-3"
                color="info"
                :model-value="clampPercent(plant.pref_air_humidity)"
                rounded
                height="8"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" class="h-100">
            <v-card-text>
              <div class="text-caption text-secondary text-uppercase">
                Bodenfeuchtigkeit
              </div>
              <div class="text-h5 font-weight-bold mt-1">
                {{ formater.formatDecimal(plant.pref_soil_humidity) }}%
              </div>
              <v-progress-linear
                class="mt-3"
                color="success"
                :model-value="clampPercent(plant.pref_soil_humidity)"
                rounded
                height="8"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
