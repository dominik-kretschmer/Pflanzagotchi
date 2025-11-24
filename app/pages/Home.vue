
<script setup lang="ts">
import PlantCard from "~/components/plantCard.vue";


const plants = [
  { name: 'Phillip', art: 'Sonnenblume', stamm: 'winzig' },
  { name: 'Herbert', art: 'Kaktus', stamm: 'stachelig' },
  { name: 'Susi', art: 'Rose', stamm: 'dornig' }
];
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(plant) in plants" :key="name" cols="12" md="4">
        <PlantCard 
          :name="plant.name" 
          :art="plant.art" 
          :stamm="plant.stamm"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
