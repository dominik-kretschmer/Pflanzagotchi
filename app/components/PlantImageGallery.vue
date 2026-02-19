<template>
  <div class="user-images-gallery mt-4">
    <div class="d-flex align-center ga-2 mb-4">
      <v-icon color="primary">mdi-camera-outline</v-icon>
      <h3 class="text-h6 font-weight-bold">Deine Fotos</h3>
      <v-chip size="small" variant="tonal" color="primary">{{ images.length }}</v-chip>
    </div>

    <v-row v-if="images.length > 0">
      <v-col
        v-for="img in images"
        :key="img.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card rounded="lg" class="gallery-card h-100" @click="openLightbox(img)">
          <v-img
            :src="img.url"
            height="150"
            cover
            class="align-end text-white"
          >
            <div class="d-flex justify-end pa-1">
              <v-btn
                icon="mdi-delete"
                size="x-small"
                color="error"
                variant="elevated"
                @click.stop="confirmDelete(img)"
              />
            </div>
          </v-img>
          <v-card-text v-if="img.caption" class="pa-2 text-caption text-truncate">
            {{ img.caption }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-else type="info" variant="tonal" border="start">
      Noch keine eigenen Fotos hochgeladen.
    </v-alert>

    <!-- Lightbox Dialog -->
    <v-dialog v-model="lightbox" max-width="900">
      <v-card v-if="selectedImage" rounded="xl" class="overflow-hidden">
        <v-img :src="selectedImage.url" max-height="80vh" />
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div v-if="selectedImage.caption" class="text-h6 mb-1">{{ selectedImage.caption }}</div>
              <div class="text-caption text-medium-emphasis">
                Hochgeladen am {{ new Date(selectedImage.uploadedAt).toLocaleDateString() }}
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" @click="lightbox = false" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h5">Foto löschen?</v-card-title>
        <v-card-text>Möchtest du dieses Foto wirklich dauerhaft entfernen?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Abbrechen</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="onDelete">Löschen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePlants } from "~/composables/usePlants";

const props = defineProps<{
  images: any[];
  plantId: number;
}>();

const emit = defineEmits<{ (e: "refresh"): void }>();

const { deleteImage } = usePlants();

const lightbox = ref(false);
const selectedImage = ref<any>(null);
const deleteDialog = ref(false);
const imageToDelete = ref<any>(null);
const deleting = ref(false);

const openLightbox = (img: any) => {
  selectedImage.value = img;
  lightbox.value = true;
};

const confirmDelete = (img: any) => {
  imageToDelete.value = img;
  deleteDialog.value = true;
};

const onDelete = async () => {
  if (!imageToDelete.value) return;
  deleting.value = true;
  try {
    await deleteImage(props.plantId, imageToDelete.value.id);
    deleteDialog.value = false;
    emit("refresh");
  } catch (err) {
    console.error("Failed to delete image", err);
  } finally {
    deleting.value = false;
  }
};
</script>

<style scoped>
.gallery-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.gallery-card:hover {
  transform: scale(1.02);
}
</style>
