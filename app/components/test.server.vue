<script setup>
import {prisma} from "~~/lib/prisma.ts";
const Plant = await prisma.plant.findFirst()
</script>

<template>
  <p>{{ Plant ?? "No user has been added yet." }}</p>
</template>