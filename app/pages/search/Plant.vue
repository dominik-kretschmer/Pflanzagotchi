<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import type { PlantDTO } from "@/types/plants";

const { searchPlants } = useApi();

// UI State
const query = ref("");
const pending = ref(false);
const error = ref<string | null>(null);
const results = ref<PlantDTO[]>([]);
const hasSearched = ref(false);

// Search trigger
const onSearch = async () => {
  const q = query.value.trim();
  if (!q) return;

  pending.value = true;
  error.value = null;
  hasSearched.value = true;
  results.value = [];

  try {
    const apiResult = await searchPlants(q);
    results.value = apiResult?.data ?? apiResult ?? [];
  } catch (e: any) {
    error.value = e?.message ?? "Fehler beim Abrufen der Pflanzen.";
  } finally {
    pending.value = false;
  }
};

const onSubmit = (e: Event) => {
  e.preventDefault();
  onSearch();
};
</script>

<template>
  <v-container fluid class="py-10">
    <!-- HEADER -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center ga-4 mb-2">
          <v-avatar color="primary" variant="tonal" size="48">
            <v-icon size="28">mdi-magnify</v-icon>
          </v-avatar>

          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Pflanzen-Suche</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Gib den <strong>wissenschaftlichen Namen</strong> ein, um passende
              Pflanzen über die Trefle-API zu finden.
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- SEARCH BAR -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <form @submit="onSubmit">
          <v-text-field
            v-model="query"
            variant="outlined"
            density="comfortable"
            label="Wissenschaftlicher Name (z. B. Monstera deliciosa)"
            prepend-inner-icon="mdi-leaf"
            clearable
            hide-details
          />
        </form>
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-end">
        <v-btn
          color="primary"
          class="w-100 w-md-auto"
          size="large"
          :loading="pending"
          :disabled="!query.trim()"
          @click="onSearch"
        >
          Suchen
          <v-icon end>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Messages -->
    <v-row v-if="hasSearched" class="mb-6">
      <v-col cols="12">
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          border="start"
          border-color="error"
        >
          {{ error }}
        </v-alert>

        <v-alert
          v-else-if="!pending && results.length === 0"
          type="info"
          variant="tonal"
          border="start"
        >
          Keine Pflanzen gefunden. Prüfe die Schreibweise oder versuche ein
          allgemeineres Suchwort.
        </v-alert>

        <v-alert
          v-else-if="!pending && results.length > 0"
          type="success"
          variant="tonal"
          border="start"
        >
          {{ results.length }} Ergebnis{{ results.length === 1 ? "" : "se" }}
          gefunden.
        </v-alert>
      </v-col>
    </v-row>

    <!-- LOADING -->
    <v-row v-if="pending">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <!-- RESULTS -->
    <v-row v-else>
      <v-col
        v-for="plant in results"
        :key="plant.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card rounded="xl" elevation="4" class="h-100 d-flex flex-column">
          <!-- IMAGE -->
          <v-img
            :src="plant.gen_data?.image_url || fallbackImage"
            :alt="plant.custom_name || plant.name"
            height="200"
            cover
          >
            <template #error>
              <div
                class="d-flex align-center justify-center text-caption text-medium-emphasis"
                style="height: 100%; background-color: #eee"
              >
                Kein Bild verfügbar
              </div>
            </template>
          </v-img>

          <v-card-text class="pb-2">
            <!-- MAIN NAMES -->
            <div class="text-subtitle-1 font-weight-bold mb-1">
              {{ plant.custom_name || plant.name }}
            </div>

            <div class="text-caption text-medium-emphasis mb-3">
              <em>{{ plant.botanical_name }}</em>
            </div>

            <!-- LOCATION + TYPE -->
            <div class="mb-3 text-body-2 text-medium-emphasis">
              Typ: <strong>{{ plant.type }}</strong
              ><br />
              Standort: <strong>{{ plant.location }}</strong>
            </div>

            <!-- PREFS -->
            <div class="d-flex flex-column ga-2">
              <div class="d-flex justify-space-between">
                <span class="text-caption text-medium-emphasis">Sonne</span>
                <span class="text-caption">{{ plant.pref_sun }}%</span>
              </div>
              <v-progress-linear
                :model-value="plant.pref_sun"
                color="amber"
                height="6"
                rounded
              />

              <div class="d-flex justify-space-between">
                <span class="text-caption text-medium-emphasis"
                  >Luftfeuchte</span
                >
                <span class="text-caption">{{ plant.pref_air_humidity }}%</span>
              </div>
              <v-progress-linear
                :model-value="plant.pref_air_humidity"
                color="info"
                height="6"
                rounded
              />

              <div class="d-flex justify-space-between">
                <span class="text-caption text-medium-emphasis"
                  >Bodenfeuchte</span
                >
                <span class="text-caption"
                  >{{ plant.pref_soil_humidity }}%</span
                >
              </div>
              <v-progress-linear
                :model-value="plant.pref_soil_humidity"
                color="success"
                height="6"
                rounded
              />
            </div>
          </v-card-text>

          <v-card-actions class="mt-auto justify-end px-4 pb-4">
            <v-btn :to="`/plants/${plant.id}`" color="primary" variant="text">
              Details
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
