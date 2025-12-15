<script setup lang="ts">
defineProps<{
  plantCount: number;
  avgSun: number;
  avgAirHumidity: number;
  avgSoilHumidity: number;
}>();
</script>

<template>
  <v-row class="mb-6">
    <v-col cols="12" md="7">
      <div class="d-flex align-center ga-3 mb-2">
        <v-avatar size="44" color="primary" variant="tonal">
          <v-icon>mdi-sprout</v-icon>
        </v-avatar>
        <div>
          <h1 class="text-h4 font-weight-bold mb-1">Pflanzenübersicht</h1>
        </div>
      </div>
    </v-col>

    <v-col cols="12" md="5">
      <v-card variant="tonal" color="primary">
        <v-card-text class="py-4">
          <v-row dense>
            <v-col cols="12" sm="4">
              <div
                class="text-caption text-uppercase text-medium-emphasis mb-1"
              >
                Pflanzen
              </div>
              <div class="text-h5 font-weight-bold">
                {{ plantCount }}
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div
                class="text-caption text-uppercase text-medium-emphasis mb-1"
              >
                Ø Sun
              </div>
              <div class="text-body-2 font-weight-medium mb-1">
                {{ avgSun }}%
              </div>
              <v-progress-linear
                :model-value="avgSun"
                height="6"
                rounded
                color="amber"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <div
                class="text-caption text-uppercase text-medium-emphasis mb-1"
              >
                Ø Luft / Boden
              </div>
              <div class="text-body-2 font-weight-medium mb-1">
                {{ avgAirHumidity }}% · {{ avgSoilHumidity }}%
              </div>
              <v-progress-linear
                :model-value="(avgAirHumidity + avgSoilHumidity) / 2"
                height="6"
                rounded
                color="success"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
