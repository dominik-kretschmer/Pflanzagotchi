<template>
  <v-container class="py-10">
    <v-row class="mb-6" align="center">
      <v-col cols="12">
        <div class="d-flex align-center ga-4 mb-2">
          <v-avatar color="primary" variant="tonal" size="64">
            <v-icon size="36">mdi-trophy</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Deine Erfolge</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Sammle XP durch besondere Leistungen in deinem Garten.
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="pending">
      <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-alert v-else-if="unauthorized" type="info" variant="tonal" class="mb-6">
      <div class="d-flex align-center justify-space-between w-100">
        <span>Bitte melde dich an, um deine Erfolge zu sehen.</span>
        <div class="d-flex ga-2">
          <v-btn color="primary" variant="flat" to="/login">Anmelden</v-btn>
          <v-btn color="secondary" variant="text" to="/login">Registrieren</v-btn>
        </div>
      </div>
    </v-alert>
    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      Fehler beim Laden der Erfolge: {{ error.message }}
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="ach in achievements"
        :key="ach.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          rounded="xl"
          elevation="4"
          :class="[
            'h-100 d-flex flex-column',
            { 'earned-card': isEarned(ach) },
          ]"
          variant="outlined"
          :color="isEarned(ach) ? 'primary' : 'grey-lighten-1'"
        >
          <v-card-text class="d-flex flex-column align-center text-center py-6">
            <v-avatar
              :color="isEarned(ach) ? 'primary' : 'grey-lighten-2'"
              size="80"
              class="mb-4"
              variant="tonal"
            >
              <v-icon
                size="48"
                :color="isEarned(ach) ? 'primary' : 'grey-darken-1'"
              >
                {{ ach.icon }}
              </v-icon>
            </v-avatar>

            <div class="text-h6 font-weight-bold mb-1">
              {{ ach.name }}
            </div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              {{ ach.description }}
            </div>

            <v-spacer />

            <div
              v-if="isEarned(ach)"
              class="text-success d-flex align-center ga-1"
            >
              <v-icon size="18">mdi-check-circle</v-icon>
            </div>
            <div v-else class="text-medium-emphasis d-flex align-center ga-1">
              <v-icon size="18">mdi-star-outline</v-icon>
              <span class="text-caption font-weight-bold"
                >+{{ ach.xp_reward }} XP Belohnung</span
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFormat } from "~/composables/useFormat";

const { formatDate } = useFormat();
const headers = useRequestHeaders(["cookie"]);

const { data: authUser, error: authError } = await useFetch("/api/auth/me", {
  headers,
});
const userId = computed(() => authUser.value?.id);

const {
  data: achievements,
  pending,
  error,
} = await useFetch("/api/achievements", {
  query: { userId },
  headers,
});

const unauthorized = computed(() => {
  const e: any = error?.value || authError?.value || null;
  const code = (e && (e.statusCode ?? e.data?.statusCode ?? e.status ?? e.response?.status)) ?? null;
  return code === 401;
});

const isEarned = (ach: any) => {
  return ach.users && ach.users.length > 0;
};
</script>

<style scoped>
.earned-card {
  border-width: 2px !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
