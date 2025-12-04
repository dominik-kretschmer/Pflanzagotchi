<script setup lang="ts">
// Props für die Dropdown-Listen
defineProps<{
  locations: string[];
  types: string[];
}>();

// Models für Two-Way-Binding mit index.vue
const search = defineModel<string>("search");
const locationFilter = defineModel<string | null>("locationFilter");
const typeFilter = defineModel<string | null>("typeFilter");
const sortBy = defineModel<string>("sortBy");
</script>

<template>
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
            { title: 'Gepflanzt am', value: 'date' },
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
</template>

<style scoped></style>
