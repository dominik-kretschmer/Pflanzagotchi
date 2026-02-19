<template>
  <v-card rounded="xl" variant="outlined" class="mb-6 overflow-hidden">
    <v-card-title class="text-h6 font-weight-bold d-flex align-center">
      <v-icon class="mr-2">mdi-camera-plus</v-icon>
      Neues Foto hinzufügen
    </v-card-title>
    
    <v-card-text>
      <div
        class="upload-zone pa-6 rounded-lg d-flex flex-column align-center justify-center border-dashed mb-4"
        :class="{ 'bg-primary-lighten-5': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <v-file-input
          v-model="file"
          accept="image/jpeg,image/png,image/webp"
          label="Bild auswählen oder hierher ziehen"
          prepend-icon="mdi-image"
          variant="outlined"
          :disabled="loading"
          show-size
          class="w-100"
          @update:model-value="onFileChange"
        />
        
        <v-img
          v-if="previewUrl"
          :src="previewUrl"
          max-height="200"
          class="rounded-lg mt-4 shadow-sm"
          cover
        />
        
        <v-text-field
          v-if="file"
          v-model="caption"
          label="Bildunterschrift (optional)"
          variant="underlined"
          class="w-100 mt-2"
          :disabled="loading"
        />
      </div>

      <v-progress-linear
        v-if="loading"
        color="primary"
        height="10"
        indeterminate
        rounded
        class="mb-4"
      />

      <div class="d-flex ga-2">
        <v-btn
          :loading="loading"
          :disabled="!file"
          color="primary"
          prepend-icon="mdi-upload"
          @click="onUpload"
        >
          Hochladen
        </v-btn>
        <v-btn
          variant="text"
          :disabled="loading"
          @click="onClear"
        >
          Abbrechen
        </v-btn>
      </div>

      <v-alert v-if="error" type="error" variant="tonal" class="mt-4" closable @click:close="error = null">
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { usePlants } from "~/composables/usePlants";

const props = defineProps<{ plantId: number }>();
const emit = defineEmits<{ (e: "uploaded"): void }>();

const { uploadImage } = usePlants();

const file = ref<any>(null);
const caption = ref("");
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const isDragging = ref(false);

const onFileChange = (newFile: any) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  
  const targetFile = Array.isArray(newFile) ? newFile[0] : newFile;
  if (targetFile) {
    previewUrl.value = URL.createObjectURL(targetFile);
  }
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    file.value = files[0];
    onFileChange(file.value);
  }
};

const onClear = () => {
  file.value = null;
  caption.value = "";
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  error.value = null;
};

const onUpload = async () => {
  const targetFile = Array.isArray(file.value) ? file.value[0] : file.value;
  if (!targetFile) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    await uploadImage(props.plantId, targetFile, caption.value);
    onClear();
    emit("uploaded");
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || "Upload fehlgeschlagen";
  } finally {
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>

<style scoped>
.upload-zone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}
.border-dashed {
  border-style: dashed !important;
}
</style>
