<script setup lang="ts">
import { computed } from "vue";

const headers = useRequestHeaders(["cookie"]);

const { data: authUser, error: authError } = await useFetch("/api/auth/me", {
  headers,
});
const userId = computed(() => authUser.value?.id);

const {
  data: quests,
  pending,
  error,
} = await useFetch("/api/quests", {
  query: { userId },
  headers,
});
const unauthorized = computed(() => {
  const e: any = error?.value || authError?.value || null;
  const code =
    (e &&
      (e.statusCode ?? e.data?.statusCode ?? e.status ?? e.response?.status)) ??
    null;
  return code === 401;
});
const getQuestIcon = (type: string) => {
  switch (type) {
    case "WATER":
      return "mdi-water";
    case "FERTILIZE":
      return "mdi-bottle-wine";
    case "SENSORS":
      return "mdi-chart-bell-curve-cumulative";
    default:
      return "mdi-star";
  }
};
</script>
<template>
  <v-container class="py-10">
    <v-row class="mb-6" align="center">
      <v-col cols="12">
        <div class="d-flex align-center ga-4 mb-2">
          <v-avatar color="secondary" variant="tonal" size="64">
            <v-icon size="36">mdi-clipboard-list</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Tägliche Quests</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Erfülle Aufgaben, um deinen Garten-Level zu steigern.
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="pending">
      <v-col v-for="i in 3" :key="i" cols="12">
        <v-skeleton-loader type="list-item-two-line" />
      </v-col>
    </v-row>
    <v-alert v-else-if="unauthorized" type="info" variant="tonal" class="mb-6">
      <div class="d-flex align-center justify-space-between w-100">
        <span>Bitte melde dich an, um deine täglichen Quests zu sehen.</span>
        <div class="d-flex ga-2">
          <v-btn color="primary" variant="flat" to="/login">Anmelden</v-btn>
          <v-btn color="secondary" variant="text" to="/login"
            >Registrieren</v-btn
          >
        </div>
      </div>
    </v-alert>
    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      Fehler beim Laden der Quests: {{ error.message }}
    </v-alert>
    <v-row v-else>
      <v-col v-for="uq in quests" :key="uq.id" cols="12">
        <v-card
          rounded="xl"
          elevation="2"
          :variant="uq.isCompleted ? 'tonal' : 'outlined'"
          :color="uq.isCompleted ? 'success' : 'secondary'"
          class="mb-4"
        >
          <v-card-text class="d-flex align-center py-4">
            <v-avatar
              :color="uq.isCompleted ? 'success' : 'secondary'"
              variant="tonal"
              size="48"
              class="mr-4"
            >
              <v-icon>{{ getQuestIcon(uq.quest.type) }}</v-icon>
            </v-avatar>

            <div class="flex-grow-1">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="text-h6 font-weight-bold">{{
                  uq.quest.name
                }}</span>
                <v-chip
                  size="small"
                  :color="uq.isCompleted ? 'success' : 'secondary'"
                  variant="flat"
                >
                  +{{ uq.quest.xp_reward }} XP
                </v-chip>
              </div>
              <div class="text-body-2 mb-3">{{ uq.quest.description }}</div>
              <div class="d-flex align-center ga-4">
                <v-progress-linear
                  :model-value="(uq.currentValue / uq.quest.target) * 100"
                  height="12"
                  rounded
                  :color="uq.isCompleted ? 'success' : 'secondary'"
                  class="flex-grow-1"
                >
                  <template #default>
                    <span class="text-caption font-weight-bold text-white">
                      {{ uq.currentValue }} / {{ uq.quest.target }}
                    </span>
                  </template>
                </v-progress-linear>

                <v-icon v-if="uq.isCompleted" color="success"
                  >mdi-check-circle</v-icon
                >
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!pending && !quests?.length">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Aktuell sind keine Quests verfügbar. Schau später wieder vorbei!
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
