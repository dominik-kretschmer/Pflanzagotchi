<script setup lang="ts">
const navItems = [
  { title: "Pflanzen", to: "/", icon: "mdi-leaf" },
  { title: "Suche", to: "/search/Plant", icon: "mdi-magnify" },
  { title: "Quests", to: "/quests", icon: "mdi-clipboard-list-outline" },
  { title: "Erfolge", to: "/achievements", icon: "mdi-trophy-outline" },
];

const { data: user } = useFetch("/api/user");
const { data: authUser, refresh: refreshAuth } = useFetch("/api/auth/me");

const onLogout = async () => {
  await $fetch("/api/auth/logout", { method: "POST" });
  await refreshAuth();
  window.location.reload();
};
</script>

<template>
  <v-container
    fluid
    class="d-flex align-center justify-space-between bg-blue-lighten-2 py-2"
  >
    <div class="d-flex align-center ga-5">
      <NuxtLink to="/" style="text-decoration: none">
        <v-avatar color="primary" variant="tonal" size="50">
          <v-icon>mdi-sprout</v-icon>
        </v-avatar>
      </NuxtLink>
      <div>
        <div class="d-flex align-center ga-2">
          <h1 class="text-h4 font-weight-bold mb-0">Pflanzagotchi</h1>
          <v-chip v-if="authUser" size="small" color="secondary" variant="flat">
            Hallo, {{ authUser.name || authUser.email }}
          </v-chip>
        </div>
        <div v-if="user" class="d-flex align-center ga-2 mt-1">
          <v-chip size="x-small" color="primary" variant="flat">
            Level {{ user.level }}
          </v-chip>
          <v-progress-linear
            :model-value="(user.xp / 1000) * 100"
            color="primary"
            height="10"
            rounded
            style="width: 100px"
          >
            <template #default="{ value }">
              <span class="text-caption text-white" style="font-size: 0.6rem">
                {{ user.xp }} / 1000 XP
              </span>
            </template>
          </v-progress-linear>
        </div>
      </div>
    </div>

    <div class="d-flex align-center ga-2">
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        color="primary"
      >
        <v-icon start>{{ item.icon }}</v-icon>
        <span class="d-none d-md-inline">{{ item.title }}</span>
      </v-btn>

      <v-divider vertical class="mx-2" />

      <template v-if="authUser">
        <v-btn color="primary" variant="tonal" @click="onLogout">
          <v-icon start>mdi-logout</v-icon>
          Abmelden
        </v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" variant="elevated" to="/login">
          <v-icon start>mdi-login</v-icon>
          Anmelden
        </v-btn>
      </template>
    </div>
  </v-container>
</template>
