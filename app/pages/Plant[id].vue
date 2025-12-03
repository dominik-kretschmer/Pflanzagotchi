<template>
  <div class="p-6 space-y-6">
    <div v-if="pending" class="text-gray-500">
      Lädt Pflanzen-Daten...
    </div>

    <div v-else-if="error" class="text-red-600">
      Fehler beim Laden der Pflanze: {{ error.message }}
    </div>

    <div v-else-if="!plant" class="text-gray-500">
      Keine Pflanze gefunden.
    </div>

    <div v-else class="space-y-8">
      <div class="flex flex-col gap-2 border-b pb-4">
        <h1 class="text-2xl font-bold">
          {{ plant.custom_name || plant.name }}
        </h1>
        <p class="text-gray-600">
          {{ plant.botanical_name }}
        </p>
        <p class="text-sm text-gray-500">
          Typ: {{ plant.type }} · Standort: {{ plant.location }}
        </p>
      </div>

      <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border p-4">
          <h2 class="text-sm font-semibold text-gray-500">Name</h2>
          <p class="text-lg font-medium">{{ plant.name }}</p>
        </div>

        <div class="rounded-xl border p-4">
          <h2 class="text-sm font-semibold text-gray-500">Standort</h2>
          <p class="text-lg font-medium">{{ plant.location }}</p>
        </div>

        <div class="rounded-xl border p-4">
          <h2 class="text-sm font-semibold text-gray-500">Datum gepflanzt</h2>
          <p class="text-lg font-medium">
            {{ formatDate(plant.date_planted) }}
          </p>
        </div>

        <div class="rounded-xl border p-4">
          <h2 class="text-sm font-semibold text-gray-500">Letzter Rückschnitt</h2>
          <p class="text-lg font-medium">
            {{ formatDate(plant.last_prun) }}
          </p>
        </div>

        <div class="rounded-xl border p-4">
          <h2 class="text-sm font-semibold text-gray-500">Zuletzt gegossen</h2>
          <p class="text-lg font-medium">
            {{ formatDate(plant.last_water) }}
          </p>
        </div>

        <div class="rounded-xl border p-4">
          <h2 class="text-sm font-semibold text-gray-500">Zuletzt gedüngt</h2>
          <p class="text-lg font-medium">
            {{ formatDate(plant.last_fertelized) }}
          </p>
        </div>
      </section>

      <!-- Präferenzen -->
      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Präferenzen</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-xl border p-4">
            <h3 class="text-sm font-semibold text-gray-500">Sonneneinstrahlung</h3>
            <p class="text-lg font-medium">
              {{ formatDecimal(plant.pref_sun) }} %
            </p>
          </div>

          <div class="rounded-xl border p-4">
            <h3 class="text-sm font-semibold text-gray-500">Luftfeuchtigkeit</h3>
            <p class="text-lg font-medium">
              {{ formatDecimal(plant.pref_air_humidity) }} %
            </p>
          </div>

          <div class="rounded-xl border p-4">
            <h3 class="text-sm font-semibold text-gray-500">Bodenfeuchtigkeit</h3>
            <p class="text-lg font-medium">
              {{ formatDecimal(plant.pref_soil_humidity) }} %
            </p>
          </div>
        </div>
      </section>

      <!-- Sensor-Daten -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Sensor-Daten</h2>
          <p class="text-sm text-gray-500">
            {{ plant.sensorData?.length || 0 }} Messungen
          </p>
        </div>

        <div v-if="!plant.sensorData || plant.sensorData.length === 0" class="text-gray-500">
          Keine Sensor-Daten vorhanden.
        </div>

        <div v-else class="overflow-x-auto border rounded-xl">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Zeitpunkt</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Temperatur (°C)</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Luftfeuchte (%)</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Licht</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Bodenfeuchte (%)</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">CO₂</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="entry in plant.sensorData"
                :key="entry.sensor_data_id"
                class="border-t"
            >
              <td class="px-4 py-2 whitespace-nowrap">
                {{ formatDateTime(entry.timestamp) }}
              </td>
              <td class="px-4 py-2">
                {{ formatDecimal(entry.temperature) }}
              </td>
              <td class="px-4 py-2">
                {{ formatDecimal(entry.humidity_air) }}
              </td>
              <td class="px-4 py-2">
                {{ formatDecimal(entry.light_intensity) }}
              </td>
              <td class="px-4 py-2">
                {{ formatDecimal(entry.humidity_soil) }}
              </td>
              <td class="px-4 py-2">
                {{ formatDecimal(entry.co2_amount) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePlants } from '@/composables/usePlants'

type SensorData = {
  sensor_data_id: number
  timestamp: string
  temperature: string | number
  humidity_air: string | number
  light_intensity: string | number
  humidity_soil: string | number
  co2_amount: string | number
}

type PlantDetail = {
  id: number
  custom_name: string | null
  name: string
  type: string
  location: string
  date_planted: string
  last_prun: string
  last_water: string
  last_fertelized: string
  botanical_name: string
  pref_sun: string | number
  pref_air_humidity: string | number
  pref_soil_humidity: string | number
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
</script>
