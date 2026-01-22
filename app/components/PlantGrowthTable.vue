<script setup lang="ts">
import type { PlantGrowth } from "@/types/Plant";
import { usePlantUtils } from "@/composables/usePlantUtils";

const props = defineProps<{
  growth: PlantGrowth;
}>();

const { safeText, yesNoUnknown } = usePlantUtils();
</script>

<template>
  <v-card rounded="xl" elevation="4">
    <v-card-title class="d-flex align-center ga-2">
      <v-icon>mdi-speedometer</v-icon>
      Wachstum & Anforderungen
    </v-card-title>
    <v-card-text>
      <v-table density="comfortable">
        <tbody>
          <tr>
            <td><strong>Licht</strong></td>
            <td>{{ safeText(growth.light) }}</td>
          </tr>
          <tr>
            <td><strong>Wuchsform</strong></td>
            <td>{{ safeText(growth.growth_form) }}</td>
          </tr>
          <tr>
            <td><strong>Wuchsgeschwindigkeit</strong></td>
            <td>{{ safeText(growth.growth_rate) }}</td>
          </tr>
          <tr>
            <td><strong>Wuchshabitus</strong></td>
            <td>{{ safeText(growth.growth_habit) }}</td>
          </tr>
          <tr>
            <td><strong>Bodenfeuchte</strong></td>
            <td>{{ safeText(growth.soil_humidity) }}</td>
          </tr>
          <tr>
            <td><strong>Atmosph. Feuchte</strong></td>
            <td>{{ safeText(growth.atmospheric_humidity) }}</td>
          </tr>
          <tr>
            <td><strong>PH (Min - Max)</strong></td>
            <td>
              {{ safeText(growth.ph_minimum) }} -
              {{ safeText(growth.ph_maximum) }}
            </td>
          </tr>
          <tr>
            <td><strong>Durchschnittshöhe</strong></td>
            <td>
              {{ safeText(growth.average_height_cm?.min) }} -
              {{ safeText(growth.average_height_cm?.max) }} cm
            </td>
          </tr>
          <tr>
            <td><strong>Maximalhöhe</strong></td>
            <td>
              {{ safeText(growth.maximum_height_cm?.min) }} -
              {{ safeText(growth.maximum_height_cm?.max) }} cm
            </td>
          </tr>
          <tr>
            <td><strong>Tage bis Ernte</strong></td>
            <td>{{ safeText(growth.days_to_harvest) }}</td>
          </tr>
          <tr>
            <td><strong>Aussaat</strong></td>
            <td>{{ safeText(growth.sowing) }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-divider v-if="growth.description" class="my-3" />
      <div v-if="growth.description" class="text-body-2 px-2 pb-2">
        <strong>Beschreibung:</strong><br />
        {{ growth.description }}
      </div>
    </v-card-text>
  </v-card>
</template>
