<script setup lang="ts">
import PlantCard from "~/components/plantCard.vue";
import { usePlants } from "~/composables/usePlants";

const { fetchPlants } = usePlants();
const { data: plants } = await useAsyncData("plants", () => fetchPlants());
</script>
<template>
  <v-container>
    <v-row>
      <v-col v-for="plant in plants" :key="name" cols="12" md="4">
        <PlantCard
          :id="plant.id"
          :name="plant.name"
          :art="plant.art"
          :stamm="plant.stamm"
          :water="plant.water"
          :sun="plant.sun"
          :humidity="plant.humidity"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
