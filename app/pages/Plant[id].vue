<template>
  <v-container fluid class="py-6">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <div v-if="pending">
          <v-skeleton-loader type="card, list-item-two-line, table"/>
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
          <PlantHeroCard
              :plant="plant"
          />
          <BasisAttributeGrid :plant="plant"/>
          <GrowthLoreCard
              :growth="plant.gen_data?.growth"
          />
          <SensorDataGraph
              :hasSensorData="hasSensorData"
              :plant="plant"
          />
          <v-expansion-panels multiple>
            <v-expansion-panel v-if="allImages.length">
              <galerieExpPanel
                  :images="allImages"
              />
            </v-expansion-panel>
            <v-expansion-panel>
              <rawDataExpPanel
                  :hasSensorData="hasSensorData"
                  :sensorData="plant.sensorData || []"
              />
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {usePlants} from '@/composables/usePlants'
import SensorDataGraph from '@/components/sensorDataGraph.vue'
import rawDataExpPanel from '@/components/rawDataExpPanel.vue'
import galerieExpPanel from '@/components/galerieExpPanel.vue'
import GrowthLoreCard from '@/components/growthLoreCard.vue'
import BasisAttributeGrid from '@/components/basisAttributeGrid.vue'
import PlantHeroCard from '@/components/plantHeroCard.vue'
import type {PlantDTO} from '@/types/plants'
import type {SensorData} from '@/types/sensordata'

type PlantDetail = PlantDTO & {
  sensorData: SensorData[]
}

const route = useRoute();
const {fetchPlant} = usePlants();

const {
  data,
  pending,
  error
} = await useAsyncData<PlantDetail | null>('plant-detail', () =>
    fetchPlant(Number(route.params.id))
)

const plant = computed(() => data.value!)

const hasSensorData = computed(
    () => !!plant.value?.sensorData && plant.value.sensorData.length > 0
)

const allImages = computed(() => {
  const gd = plant.value?.gen_data
  if (!gd?.images) return []
  const result: Array<
      { url: string; license?: string; author?: string; category: keyof NonNullable<typeof gd.images> }
  > = []
  const categories: (keyof NonNullable<typeof gd.images>)[] = [
    'habit',
    'leaf',
    'flower',
    'fruit',
    'bark',
    'other'
  ]

  for (const cat of categories) {
    const imgs = gd.images?.[cat]
    if (imgs && imgs.length) {
      imgs.forEach(img => {
        if (img.url) {
          result.push({...img, category: cat})
        }
      })
    }
  }
  return result
})

</script>
