<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "@/composables/useApi";

const { searchPlants } = useApi();

interface TreflePlant {
  id: number;
  common_name: string | null;
  slug: string;
  scientific_name: string;
  year: number | null;
  author: string | null;
  family: string | null;
  genus: string | null;
  image_url: string | null;
}

interface TrefleSearchResponse {
  data: TreflePlant[];
  links: {
    self: string;
    first?: string;
    last?: string;
  };
  meta: {
    total: number;
  };
}

const query = ref("");
const pending = ref(false);
const error = ref<string | null>(null);
const results = ref<TreflePlant[]>([]);
const hasSearched = ref(false);
const total = ref<number | null>(null);

const fallbackImage =
  "https://via.placeholder.com/400x300?text=Keine+Pflanzenbild+verf%C3%BCgbar";

const onSearch = async () => {
  const q = query.value.trim();
  if (!q) return;

  pending.value = true;
  error.value = null;
  hasSearched.value = true;
  results.value = [];
  total.value = null;

  try {
    const apiResult = (await searchPlants(q)) as
      | TrefleSearchResponse
      | TreflePlant[];

    if (Array.isArray(apiResult)) {
      results.value = apiResult;
      total.value = apiResult.length;
    } else {
      results.value = apiResult?.data ?? [];
      total.value = apiResult?.meta?.total ?? results.value.length;
    }
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
  <v-container  class="py-10">
    <!-- HEADER -->
    <v-row class="mb-0" align="center">
      <v-col cols="12" md="9">
        <div class="d-flex align-center ga-4 mb-2">
          <v-avatar color="primary" variant="tonal" size="25">
            <v-icon size="18">mdi-magnify</v-icon>
          </v-avatar>

          <div>
            <h1 class="text-h6 font-weight-bold mb-1">Pflanzen-Suche</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Gib den <strong>Namen</strong> oder
              <strong>wissenschaftlichen Namen</strong> ein, um passende
              Pflanzen zu finden.
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
            label="Pflanzenname (z. B. Monstera deliciosa)"
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
          {{ total ?? results.length }} Ergebnis{{
            (total ?? results.length) === 1 ? "" : "se"
          }}
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
            :src="plant.image_url || fallbackImage"
            :alt="plant.common_name || plant.scientific_name"
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
            <!-- MAIN NAME -->
            <div class="text-subtitle-1 font-weight-bold mb-1">
              {{ plant.common_name || plant.scientific_name }}
            </div>

            <!-- SCIENTIFIC NAME -->
            <div class="text-caption text-medium-emphasis mb-3">
              <em>{{ plant.scientific_name }}</em>
            </div>

            <!-- FAMILY / GENUS / YEAR -->
            <div class="text-body-2 text-medium-emphasis mb-2">
              <div v-if="plant.genus">
                Gattung: <strong>{{ plant.genus }}</strong>
              </div>
              <div v-if="plant.family">
                Familie: <strong>{{ plant.family }}</strong>
              </div>
              <div v-if="plant.year">
                Jahr: <strong>{{ plant.year }}</strong>
                <span v-if="plant.author"> ({{ plant.author }})</span>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="mt-auto justify-end px-4 pb-4">
            <v-btn :to="`/plants/${plant.slug}`" color="primary" variant="text">
              Details
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
