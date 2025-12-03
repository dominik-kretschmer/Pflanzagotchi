<script setup lang="ts">
import PlantCard from "~/components/plantCard.vue";

const plants = [
  { id:1,name: 'Phillip', art: 'Sonnenblume', stamm: 'winzig',water: 100, sun: 100, humidity: 100 },
  { id:2,name: 'Herbert', art: 'Kaktus', stamm: 'stachelig',water: 67, sun: 12, humidity: 45  },
  { id:3,name: 'Susi', art: 'Rose', stamm: 'dornig',water: 95, sun: 64, humidity: 12},
];
</script>
<template>
  <v-container>
    <v-row>
      <v-col v-for="(plant) in plants" :key="name" cols="12" md="4">
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