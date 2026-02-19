<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isLogin = ref(route.query.mode !== "register");
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  email: "",
  password: "",
  name: "",
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = null;
};

const onSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const endpoint = isLogin.value ? "/api/auth/login" : "/api/auth/register";
    await $fetch(endpoint, {
      method: "POST",
      body: form.value,
    });

    // Refresh page or redirect to home
    router.push("/");
    // Force a refresh of the user data in the app
    window.location.href = "/";
  } catch (e: any) {
    error.value = e.data?.statusMessage || "Ein Fehler ist aufgetreten";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-4" rounded="xl">
          <v-card-item class="text-center">
            <v-avatar color="primary" size="64" class="mb-4">
              <v-icon size="40" color="white">mdi-sprout</v-icon>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold">
              {{ isLogin ? "Willkommen zurück" : "Konto erstellen" }}
            </v-card-title>
            <v-card-subtitle>
              {{
                isLogin
                  ? "Melde dich an, um deine Pflanzen zu pflegen"
                  : "Werde Teil der Pflanzagotchi-Community"
              }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-if="!isLogin"
                v-model="form.name"
                label="Name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mb-2"
              />
              <v-text-field
                v-model="form.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                class="mb-2"
                required
              />
              <v-text-field
                v-model="form.password"
                label="Passwort"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
                class="mb-4"
                required
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                variant="elevated"
                rounded="lg"
              >
                {{ isLogin ? "Anmelden" : "Registrieren" }}
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn variant="text" color="secondary" @click="toggleMode">
              {{
                isLogin
                  ? "Noch kein Konto? Hier registrieren"
                  : "Bereits ein Konto? Hier anmelden"
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
