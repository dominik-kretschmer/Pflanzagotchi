<script setup lang="ts">
import {computed} from 'vue'
import type {GrowthData} from "@/types/Plant"

const props = defineProps<{
  growth: GrowthData | null | undefined
}>()

const hasAverageHeight = computed(() => {
  const avg = props.growth?.average_height_cm
  return !!avg && (avg.min != null || avg.max != null)
})

const hasMaximumHeight = computed(() => {
  const max = props.growth?.maximum_height_cm
  return !!max && (max.min != null || max.max != null)
})

const hasEnvPrefs = computed(() => {
  const g = props.growth
  return (
      g?.light != null ||
      g?.atmospheric_humidity != null ||
      g?.soil_humidity != null
  )
})
</script>

<template>
  <v-card
      v-if="growth"
      variant="outlined"
      class="mb-4"
  >
    <v-card-title class="text-subtitle-1 font-weight-bold">
      Growth & Lore
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
            v-if="growth.growth_form"
            cols="12"
            md="4"
        >
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Wuchsform
          </div>
          <div class="text-body-1 font-weight-medium">
            {{ growth.growth_form }}
          </div>
        </v-col>

        <v-col
            v-if="growth.growth_habit"
            cols="12"
            md="4"
        >
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Wuchshabitus
          </div>
          <div class="text-body-1 font-weight-medium">
            {{ growth.growth_habit }}
          </div>
        </v-col>

        <v-col
            v-if="growth.growth_rate"
            cols="12"
            md="4"
        >
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Wachstumsrate
          </div>
          <div class="text-body-1 font-weight-medium">
            {{ growth.growth_rate }}
          </div>
        </v-col>

        <v-col
            v-if="hasAverageHeight"
            cols="12"
            md="6"
            class="mt-4"
        >
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Durchschnittshöhe
          </div>
          <div class="text-body-1 font-weight-medium">
            <span v-if="growth.average_height_cm?.min != null">
              ab {{ growth.average_height_cm.min }} cm
            </span>
            <span
                v-if="growth.average_height_cm?.min != null && growth.average_height_cm?.max != null"
            >
              ·
            </span>
            <span v-if="growth.average_height_cm?.max != null">
              bis {{ growth.average_height_cm.max }} cm
            </span>
          </div>
        </v-col>

        <v-col
            v-if="hasMaximumHeight"
            cols="12"
            md="6"
            class="mt-4"
        >
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Maximale Höhe
          </div>
          <div class="text-body-1 font-weight-medium">
            <span v-if="growth.maximum_height_cm?.min != null">
              ab {{ growth.maximum_height_cm.min }} cm
            </span>
            <span
                v-if="growth.maximum_height_cm?.min != null && growth.maximum_height_cm?.max != null"
            >
              ·
            </span>
            <span v-if="growth.maximum_height_cm?.max != null">
              bis {{ growth.maximum_height_cm.max }} cm
            </span>
          </div>
        </v-col>

        <v-col
            v-if="growth.description"
            cols="12"
            class="mt-4"
        >
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Beschreibung
          </div>
          <div class="text-body-2">
            {{ growth.description }}
          </div>
        </v-col>
      </v-row>

      <v-row v-if="hasEnvPrefs" class="mt-4">
        <v-col cols="12">
          <div class="mb-2 text-caption text-secondary text-uppercase">
            Umweltpräferenzen (0–10)
          </div>
        </v-col>

        <v-col
            v-if="growth.light != null"
            cols="12"
            md="4"
        >
          <div class="text-caption text-secondary mb-1">Licht</div>
          <v-progress-linear
              color="amber"
              :model-value="(growth.light || 0) * 10"
              height="8"
              rounded
          />
        </v-col>

        <v-col
            v-if="growth.atmospheric_humidity != null"
            cols="12"
            md="4"
        >
          <div class="text-caption text-secondary mb-1">
            Luftfeuchtigkeit
          </div>
          <v-progress-linear
              color="info"
              :model-value="(growth.atmospheric_humidity || 0) * 10"
              height="8"
              rounded
          />
        </v-col>

        <v-col
            v-if="growth.soil_humidity != null"
            cols="12"
            md="4"
        >
          <div class="text-caption text-secondary mb-1">
            Bodenfeuchtigkeit
          </div>
          <v-progress-linear
              color="success"
              :model-value="(growth.soil_humidity || 0) * 10"
              height="8"
              rounded
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>