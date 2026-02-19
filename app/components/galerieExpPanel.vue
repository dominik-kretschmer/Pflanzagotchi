<template>
  <div>
    <v-expansion-panel-title>
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-subtitle-1 font-weight-medium"> Bildergalerie </span>
        <v-chip
          v-if="images.length"
          size="small"
          color="primary"
          variant="tonal"
          class="text-caption"
        >
          {{ images.length }} Bild{{ images.length === 1 ? "" : "er" }}
        </v-chip>
      </div>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div v-if="!hasImages" class="text-caption text-secondary">
        Keine Bilder vorhanden.
      </div>

      <div v-else class="d-flex flex-column ga-4">
        <div
          v-for="(group, cat) in groupedByCategory"
          :key="cat"
          class="d-flex flex-column ga-2"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="text-caption text-secondary text-uppercase">
              {{ categoryLabel(cat) }}
            </div>
            <div class="text-caption text-secondary">
              {{ group.length }} Bild{{ group.length === 1 ? "" : "er" }}
            </div>
          </div>

          <v-row dense>
            <v-col v-for="img in group" :key="img.url" cols="6" md="3">
              <v-card variant="outlined" class="h-100">
                <v-img
                  :src="img.url"
                  :alt="categoryLabel(cat)"
                  aspect-ratio="1"
                  cover
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate />
                    </v-row>
                  </template>
                </v-img>

                <v-card-text
                  v-if="img.author || img.license"
                  class="py-2 text-caption text-secondary"
                >
                  <div v-if="img.author">Autor: {{ img.author }}</div>
                  <div v-if="img.license">Lizenz: {{ img.license }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-expansion-panel-text>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ImageItem = {
  url: string;
  license?: string;
  author?: string;
  category: string;
};

const props = defineProps<{
  images: ImageItem[];
}>();

const hasImages = computed(() => props.images && props.images.length > 0);

const groupedByCategory = computed<Record<string, ImageItem[]>>(() => {
  const map: Record<string, ImageItem[]> = {};
  for (const img of props.images) {
    const cat = img.category || "other";
    if (!map[cat]) {
      map[cat] = [];
    }
    map[cat].push(img);
  }
  return map;
});

const categoryLabel = (cat: string) => {
  switch (cat) {
    case "habit":
      return "Wuchsform";
    case "leaf":
      return "Blätter";
    case "flower":
      return "Blüten";
    case "fruit":
      return "Früchte";
    case "bark":
      return "Rinde";
    case "user":
      return "Deine Fotos";
    case "other":
      return "Weitere";
    default:
      return cat;
  }
};
</script>
