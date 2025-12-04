<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAsyncData } from '#app'
import { usePlants } from '@/composables/usePlants'
import { useFormat } from '@/composables/useFormat'
import type { PlantDTO } from '@/types/plants'

const formater = useFormat()
const { fetchPlants } = usePlants()

const {
  data,
  pending,
  error
} = await useAsyncData<PlantDTO[]>('plants-overview', () => fetchPlants())

const plants = computed(() => data.value ?? [])

const search = ref('')
const locationFilter = ref<string | null>(null)
const typeFilter = ref<string | null>(null)
const sortBy = ref<'name' | 'date' | 'location'>('name')

const numeric = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const n = Number(value)
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

const average = (values: number[]) => {
  if (!values.length) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round((sum / values.length) * 10) / 10
}

const plantCount = computed(() => plants.value.length)

const avgSun = computed(() =>
    average(plants.value.map(p => numeric(p.pref_sun)))
)
const avgAirHumidity = computed(() =>
    average(plants.value.map(p => numeric(p.pref_air_humidity)))
)
const avgSoilHumidity = computed(() =>
    average(plants.value.map(p => numeric(p.pref_soil_humidity)))
)

const locations = computed(() => {
  const set = new Set(plants.value.map(p => p.location).filter(Boolean))
  return Array.from(set)
})

const types = computed(() => {
  const set = new Set(plants.value.map(p => p.type).filter(Boolean))
  return Array.from(set)
})

const filteredPlants = computed(() => {
  let list = [...plants.value]

  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(p => {
      const fields = [
        p.custom_name,
        p.name,
        p.botanical_name,
        p.location,
        p.type
      ]
      return fields.some(f =>
          f?.toString().toLowerCase().includes(q)
      )
    })
  }

  if (locationFilter.value) {
    list = list.filter(p => p.location === locationFilter.value)
  }

  if (typeFilter.value) {
    list = list.filter(p => p.type === typeFilter.value)
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name') {
      return (a.custom_name || a.name).localeCompare(b.custom_name || b.name)
    }
    if (sortBy.value === 'location') {
      return a.location.localeCompare(b.location)
    }
    if (sortBy.value === 'date') {
      return a.date_planted.localeCompare(b.date_planted)
    }
    return 0
  })

  return list
})

const mainImageForPlant = (plant: PlantDTO): string | null => {
  if (plant.gen_data?.image_url) return plant.gen_data.image_url
  const imgs = plant.gen_data?.images
  if (!imgs) return null
  const order: (keyof typeof imgs)[] = ['habit', 'leaf', 'flower', 'fruit', 'bark', 'other']
  for (const key of order) {
    const arr = imgs[key]
    if (arr && arr.length && arr[0].url) return arr[0].url
  }
  return null
}

const preferenceChipColor = (value: number) => {
  if (value >= 70) return 'success'
  if (value >= 40) return 'warning'
  return 'info'
}
</script>

<template>
  <v-container fluid class="py-8">
    <v-row class="mb-6" align="center" justify="space-between">
      <v-col cols="12" md="7">
        <div class="d-flex align-center ga-3 mb-2">
          <v-avatar size="44" color="primary" variant="tonal">
            <v-icon>mdi-sprout</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Pflanzenübersicht
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Alle Pflanzagotchi mit Standort, Typ und Pflegepräferenzen auf einen Blick.
              Perfekt, um schnell zu sehen, welche Pflanze wo steht und was sie mag.
            </p>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="5">
        <v-card variant="tonal" color="primary">
          <v-card-text class="py-4">
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="text-caption text-uppercase text-medium-emphasis mb-1">
                  Pflanzen
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ plantCount }}
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="text-caption text-uppercase text-medium-emphasis mb-1">
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
                <div class="text-caption text-uppercase text-medium-emphasis mb-1">
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

    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="5">
        <v-text-field
            v-model="search"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
            prepend-inner-icon="mdi-magnify"
            label="Pflanzen suchen (Name, botanischer Name, Standort …)"
        />
      </v-col>

      <v-col cols="12" md="7">
        <div class="d-flex flex-wrap ga-3 justify-end">
          <v-select
              v-model="locationFilter"
              :items="locations"
              clearable
              hide-details
              density="comfortable"
              variant="outlined"
              label="Standort"
              class="flex-1-1-200"
          />

          <v-select
              v-model="typeFilter"
              :items="types"
              clearable
              hide-details
              density="comfortable"
              variant="outlined"
              label="Typ"
              class="flex-1-1-200"
          />

          <v-select
              v-model="sortBy"
              :items="[
              { title: 'Name', value: 'name' },
              { title: 'Standort', value: 'location' },
              { title: 'Gepflanzt am', value: 'date' }
            ]"
              hide-details
              density="comfortable"
              variant="outlined"
              label="Sortieren nach"
              class="flex-1-1-180"
          />
        </div>
      </v-col>
    </v-row>

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
      Keine Pflanzen gefunden. Passe die Filter an oder lege eine neue Pflanze an.
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
        <v-card rounded="xl" elevation="4" class="h-100 d-flex flex-column">
          <v-img
              :src="mainImageForPlant(plant) || undefined"
              :alt="plant.custom_name || plant.name"
              height="200"
              cover
          >
            <template #placeholder>
              <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
              >
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
                  size="x-small"
                  color="info"
                  variant="tonal"
                  v-if="plant.gen_data?.sources?.length"
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
      </v-col>
    </v-row>
  </v-container>
</template>
