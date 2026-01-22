<script setup lang="ts">
import { ref, computed } from "vue";
import type { TreflePlant } from "@/types/Plant";

const props = defineProps<{
  isSearching: boolean;
  isLoadingDetails: boolean;
  searchResults: TreflePlant[];
  searchError: string | null;
  detailsError: string | null;
}>();

const emit = defineEmits<{
  (e: "search", query: string): void;
  (e: "select", plant: TreflePlant): void;
}>();

const query = ref("");
const selectedTrefle = ref<TreflePlant | null>(null);

const canSearch = computed(() => query.value.trim().length >= 2);

function onSearch() {
  if (canSearch.value) {
    emit("search", query.value);
  }
}

function onPickResult(p: TreflePlant | null) {
  if (p) {
    emit("select", p);
  }
}
</script>

<template>
  <v-card variant="tonal" rounded="lg" class="mb-4">
    <v-card-title class="text-subtitle-1 d-flex align-center ga-2">
      <v-icon>mdi-magnify</v-icon>
      Daten aus der API übernehmen (optional)
    </v-card-title>
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="query"
            label="Pflanze suchen (Trefle)"
            placeholder="z. B. monstera"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-leaf"
            clearable
            hide-details
            @keyup.enter="onSearch"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            color="primary"
            variant="elevated"
            class="w-100"
            :loading="isSearching"
            :disabled="!canSearch"
            @click="onSearch"
          >
            Suchen
            <v-icon end>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
        <v-col v-if="searchError" cols="12">
          <v-alert type="error" variant="tonal" border="start">
            {{ searchError }}
          </v-alert>
        </v-col>
        <v-col v-if="detailsError" cols="12">
          <v-alert type="error" variant="tonal" border="start">
            {{ detailsError }}
          </v-alert>
        </v-col>
        <v-col v-if="searchResults.length" cols="12">
          <v-select
            v-model="selectedTrefle"
            :items="searchResults"
            :loading="isLoadingDetails"
            item-title="scientific_name"
            return-object
            label="Suchergebnis auswählen (füllt gen_data + Namen)"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-database"
            @update:model-value="onPickResult"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-avatar size="32" color="primary" variant="tonal">
                    <v-icon size="18">mdi-leaf</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>
                  {{ item.raw.common_name || item.raw.scientific_name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="item.raw.common_name">
                    <em>{{ item.raw.scientific_name }}</em>
                  </span>
                  <span v-else>
                    {{ item.raw.slug }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
