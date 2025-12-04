<script setup lang="ts">
import { useFormat } from '@/composables/useFormat'
import type { SensorData } from '@/types/sensordata'

const props = defineProps<{
  hasSensorData: boolean
  sensorData: SensorData[]
}>()

const formater = useFormat()
</script>
<template>
    <v-expansion-panel-title>
      Sensor-Rohdaten ({{ sensorData?.length || 0 }})
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
              v-for="entry in sensorData"
              :key="entry.sensor_data_id"
          >
            <td>{{ formater.formatDateTime(entry.timestamp) }}</td>
            <td>{{ formater.formatDecimal(entry.temperature) }}</td>
            <td>{{ formater.formatDecimal(entry.humidity_air) }}</td>
            <td>{{ formater.formatDecimal(entry.light_intensity) }}</td>
            <td>{{ formater.formatDecimal(entry.humidity_soil) }}</td>
            <td>{{ formater.formatDecimal(entry.co2_amount) }}</td>
          </tr>
          </tbody>
        </v-table>
      </div>
    </v-expansion-panel-text>
</template>