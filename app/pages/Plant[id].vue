<template>
  <v-container fluid class="py-6">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <!-- Loading / Error -->
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
          <!-- HERO / ITEM CARD -->
          <v-card
              class="mb-4"
              color="primary"
              theme="dark"
              elevation="8"
          >
            <v-row class="ma-0">
              <!-- Text-Info -->
              <v-col cols="12" md="6" class="pa-6 d-flex flex-column justify-space-between ga-4">
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
                    <span>Gepflanzt am {{ formatDate(plant.date_planted) }}</span>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-icon size="14" color="info">mdi-water</v-icon>
                    <span>Zuletzt gegossen am {{ formatDate(plant.last_water) }}</span>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-icon size="14" color="warning">mdi-flask</v-icon>
                    <span>Zuletzt gedüngt am {{ formatDate(plant.last_fertelized) }}</span>
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
                      <v-progress-circular indeterminate color="secondary" />
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

          <!-- BASIS-ATTRIBUTES GRID -->
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
                        {{ formatDecimal(plant.pref_sun) }}%
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
                        {{ formatDecimal(plant.pref_air_humidity) }}%
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
                        {{ formatDecimal(plant.pref_soil_humidity) }}%
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

          <!-- GROWTH / LORE -->
          <v-card
              v-if="plant.gen_data?.growth"
              variant="outlined"
              class="mb-4"
          >
            <v-card-title class="text-subtitle-1 font-weight-bold">
              Growth & Lore
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                    v-if="plant.gen_data.growth?.growth_form"
                    cols="12"
                    md="4"
                >
                  <div class="mb-2 text-caption text-secondary text-uppercase">
                    Wuchsform
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ plant.gen_data.growth.growth_form }}
                  </div>
                </v-col>

                <v-col
                    v-if="plant.gen_data.growth?.growth_habit"
                    cols="12"
                    md="4"
                >
                  <div class="mb-2 text-caption text-secondary text-uppercase">
                    Wuchshabitus
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ plant.gen_data.growth.growth_habit }}
                  </div>
                </v-col>

                <v-col
                    v-if="plant.gen_data.growth?.growth_rate"
                    cols="12"
                    md="4"
                >
                  <div class="mb-2 text-caption text-secondary text-uppercase">
                    Wachstumsrate
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ plant.gen_data.growth.growth_rate }}
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
                    <span v-if="plant.gen_data?.growth?.average_height_cm?.min">
                      ab {{ plant.gen_data.growth.average_height_cm.min }} cm
                    </span>
                    <span
                        v-if="plant.gen_data?.growth?.average_height_cm?.min && plant.gen_data?.growth?.average_height_cm?.max"
                    >
                      ·
                    </span>
                    <span v-if="plant.gen_data?.growth?.average_height_cm?.max">
                      bis {{ plant.gen_data.growth.average_height_cm.max }} cm
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
                    <span v-if="plant.gen_data?.growth?.maximum_height_cm?.min">
                      ab {{ plant.gen_data.growth.maximum_height_cm.min }} cm
                    </span>
                    <span
                        v-if="plant.gen_data?.growth?.maximum_height_cm?.min && plant.gen_data?.growth?.maximum_height_cm?.max"
                    >
                      ·
                    </span>
                    <span v-if="plant.gen_data?.growth?.maximum_height_cm?.max">
                      bis {{ plant.gen_data.growth.maximum_height_cm.max }} cm
                    </span>
                  </div>
                </v-col>

                <v-col
                    v-if="plant.gen_data.growth?.description"
                    cols="12"
                    class="mt-4"
                >
                  <div class="mb-2 text-caption text-secondary text-uppercase">
                    Beschreibung
                  </div>
                  <div class="text-body-2">
                    {{ plant.gen_data.growth.description }}
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
                    v-if="plant.gen_data.growth?.light != null"
                    cols="12"
                    md="4"
                >
                  <div class="text-caption text-secondary mb-1">Licht</div>
                  <v-progress-linear
                      color="amber"
                      :model-value="(plant.gen_data.growth.light || 0) * 10"
                      height="8"
                      rounded
                  />
                </v-col>

                <v-col
                    v-if="plant.gen_data.growth?.atmospheric_humidity != null"
                    cols="12"
                    md="4"
                >
                  <div class="text-caption text-secondary mb-1">
                    Luftfeuchtigkeit
                  </div>
                  <v-progress-linear
                      color="info"
                      :model-value="(plant.gen_data.growth.atmospheric_humidity || 0) * 10"
                      height="8"
                      rounded
                  />
                </v-col>

                <v-col
                    v-if="plant.gen_data.growth?.soil_humidity != null"
                    cols="12"
                    md="4"
                >
                  <div class="text-caption text-secondary mb-1">
                    Bodenfeuchtigkeit
                  </div>
                  <v-progress-linear
                      color="success"
                      :model-value="(plant.gen_data.growth.soil_humidity || 0) * 10"
                      height="8"
                      rounded
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- SENSOR-TRENDS (GRAPHS) -->
          <v-card
              v-if="hasSensorData"
              variant="outlined"
              class="mb-4"
          >
            <v-card-title class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center">
              <span>Sensor-Trends</span>
              <span class="text-caption text-medium-emphasis">
                Letzte {{ recentData.length }} Messungen
              </span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <div class="text-caption text-secondary mb-1">
                    Temperatur (°C)
                  </div>
                  <v-sheet color="primary" rounded class="pa-2">
                    <v-sparkline
                        :model-value="temperatureValues"
                        color="amber"
                        height="80"
                        :smooth="10"
                        auto-draw
                    />
                  </v-sheet>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-secondary mb-1">
                    Luftfeuchte (%)
                  </div>
                  <v-sheet color="primary" rounded class="pa-2">
                    <v-sparkline
                        :model-value="airHumidityValues"
                        color="info"
                        height="80"
                        :smooth="10"
                        auto-draw
                    />
                  </v-sheet>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-secondary mb-1">
                    Bodenfeuchte (%)
                  </div>
                  <v-sheet color="primary" rounded class="pa-2">
                    <v-sparkline
                        :model-value="soilHumidityValues"
                        color="success"
                        height="80"
                        :smooth="10"
                        auto-draw
                    />
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- GALERIE + SENSOR-TABELLE ALS PANELS -->
          <v-expansion-panels multiple>
            <v-expansion-panel v-if="allImages.length">
              <v-expansion-panel-title>
                Galerie ({{ allImages.length }} Bilder)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col
                      v-for="(img, index) in allImages"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-card variant="tonal" color="primary">
                      <v-img
                          :src="img.url"
                          :alt="categoryLabel(img.category)"
                          height="160"
                          cover
                      />
                      <v-card-text class="text-caption">
                        <div class="font-weight-medium">
                          {{ categoryLabel(img.category) }}
                        </div>
                        <div v-if="img.author">Autor: {{ img.author }}</div>
                        <div v-if="img.license">Lizenz: {{ img.license }}</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                Sensor-Rohdaten ({{ plant.sensorData?.length || 0 }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                    v-if="!hasSensorData"
                    class="text-body-2 text-medium-emphasis"
                >
                  Keine Sensor-Daten vorhanden.
                </div>
                <div v-else>
                  <v-table density="compact" class="text-caption">
                    <thead>
                    <tr>
                      <th class="text-left">Zeitpunkt</th>
                      <th class="text-left">Temperatur (°C)</th>
                      <th class="text-left">Luftfeuchte (%)</th>
                      <th class="text-left">Licht</th>
                      <th class="text-left">Bodenfeuchte (%)</th>
                      <th class="text-left">CO₂</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="entry in plant.sensorData"
                        :key="entry.sensor_data_id"
                    >
                      <td>{{ formatDateTime(entry.timestamp) }}</td>
                      <td>{{ formatDecimal(entry.temperature) }}</td>
                      <td>{{ formatDecimal(entry.humidity_air) }}</td>
                      <td>{{ formatDecimal(entry.light_intensity) }}</td>
                      <td>{{ formatDecimal(entry.humidity_soil) }}</td>
                      <td>{{ formatDecimal(entry.co2_amount) }}</td>
                    </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePlants } from '@/composables/usePlants'
import type { PlantDTO } from '@/types/plants'
import type { SensorData } from '@/types/sensordata'

type PlantDetail = PlantDTO & {
  sensorData: SensorData[]
}

const route = useRoute()
const { fetchPlant } = usePlants()

const {
  data: plant,
  pending,
  error
} = await useAsyncData<PlantDetail | null>('plant-detail', () =>
    fetchPlant(Number(route.params.id))
)

const formatDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('de-DE')
}

const formatDateTime = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString('de-DE')
}

const formatDecimal = (value: string | number) => {
  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return '-'
  return num.toFixed(2)
}

const numeric = (value: string | number) => {
  const num = typeof value === 'string' ? Number(value) : value
  return Number.isNaN(num) ? 0 : num
}

const clampPercent = (value: string | number) => {
  const n = numeric(value)
  if (n < 0) return 0
  if (n > 100) return 100
  return n
}

const hasSensorData = computed(
    () => !!plant.value?.sensorData && plant.value.sensorData.length > 0
)

const recentData = computed(() => {
  if (!plant.value?.sensorData?.length) return []
  const maxPoints = 24
  const data = plant.value.sensorData
  return data.slice(-maxPoints)
})

const temperatureValues = computed(() =>
    recentData.value.map(d => numeric(d.temperature))
)
const airHumidityValues = computed(() =>
    recentData.value.map(d => numeric(d.humidity_air))
)
const soilHumidityValues = computed(() =>
    recentData.value.map(d => numeric(d.humidity_soil))
)

const allImages = computed(() => {
  const gd = plant.value?.gen_data
  if (!gd?.images) return []
  const result: Array<ReturnType<typeof buildImageWithCategory>> = []
  const categories: (keyof typeof gd.images)[] = ['habit', 'leaf', 'flower', 'fruit', 'bark', 'other']

  for (const cat of categories) {
    const imgs = gd.images[cat]
    if (imgs && imgs.length) {
      imgs.forEach(img => {
        if (img.url) {
          result.push(buildImageWithCategory(img, cat))
        }
      })
    }
  }
  return result
})

const buildImageWithCategory = (
    img: { url: string; license?: string; author?: string },
    category: 'habit' | 'leaf' | 'flower' | 'fruit' | 'bark' | 'other'
) => ({
  ...img,
  category
})

const mainImageUrl = computed(() => {
  const gd = plant.value?.gen_data
  if (!gd) return null
  if (gd.image_url) return gd.image_url
  const first = allImages.value[0]
  return first ? first.url : null
})

const hasAverageHeight = computed(() => {
  const avg = plant.value?.gen_data?.growth?.average_height_cm
  return !!avg && (avg.min != null || avg.max != null)
})

const hasMaximumHeight = computed(() => {
  const max = plant.value?.gen_data?.growth?.maximum_height_cm
  return !!max && (max.min != null || max.max != null)
})

const hasEnvPrefs = computed(() => {
  const g = plant.value?.gen_data?.growth
  return (
      g?.light != null ||
      g?.atmospheric_humidity != null ||
      g?.soil_humidity != null
  )
})

const categoryLabel = (cat: string) => {
  switch (cat) {
    case 'habit':
      return 'Wuchsform'
    case 'leaf':
      return 'Blätter'
    case 'flower':
      return 'Blüten'
    case 'fruit':
      return 'Früchte'
    case 'bark':
      return 'Rinde'
    case 'other':
      return 'Weitere'
    default:
      return cat
  }
}
</script>
