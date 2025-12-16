<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

const { getPlant } = useApi();

const fallbackImage =
  "https://via.placeholder.com/1200x700?text=Kein+Pflanzenbild+verf%C3%BCgbar";

const safeText = (v: unknown, fallback = "—") => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
};

const yesNoUnknown = (v: unknown) =>
  v === true ? "Ja" : v === false ? "Nein" : "—";

const pickName = (v: unknown, fallback = "—") => {
  if (!v) return fallback;
  if (typeof v === "string") return safeText(v, fallback);
  if (typeof v === "object") {
    const o = v;
    return o.common_name || o.scientific_name || o.name || o.slug || fallback;
  }
  return safeText(v, fallback);
};

const normalizeList = (v: unknown): string[] => {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? "").trim()).filter(Boolean);
};

const isUrl = (s: unknown) => typeof s === "string" && /^https?:\/\//i.test(s);

const formatDate = (iso: unknown) => {
  if (typeof iso !== "string") return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
};

const {
  data: apiResponse,
  pending,
  error,
  refresh,
} = await useAsyncData(
  () => `plant:${slug.value}`,
  async () => (slug.value ? await getPlant(slug.value) : null),
  { watch: [slug] },
);

const plant = computed(() => {
  const r = apiResponse.value;
  if (!r) return null;
  return r.data ?? r;
});

const main = computed(() => plant.value?.main_species ?? plant.value ?? null);

const title = computed(() => {
  const p = plant.value;
  return (
    p?.common_name ||
    p?.name ||
    p?.scientific_name ||
    p?.slug ||
    "Pflanzen-Details"
  );
});

const subtitle = computed(() => {
  const p = main.value ?? plant.value;
  if (!p) return null;
  const parts = [
    p.scientific_name ? String(p.scientific_name) : null,
    p.family ? `Familie: ${pickName(p.family)}` : null,
    p.genus ? `Gattung: ${pickName(p.genus)}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
});

const badges = computed(() => {
  const p = main.value ?? plant.value;
  if (!p) return [];
  return [
    p.rank
      ? { label: `Rang: ${safeText(p.rank)}`, icon: "mdi-tag-outline" }
      : null,
    p.year != null
      ? { label: `Jahr: ${safeText(p.year)}`, icon: "mdi-calendar-outline" }
      : null,
    p.author
      ? { label: safeText(p.author), icon: "mdi-account-outline" }
      : null,
    p.status
      ? {
          label: `Status: ${safeText(p.status)}`,
          icon: "mdi-check-decagram-outline",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; icon: string }>;
});

const imageGroups = computed<
  Record<string, { url: string; copyright?: string }[]>
>(() => {
  const p = plant.value;
  const ms = main.value;
  const groups: Record<string, { url: string; copyright?: string }[]> = {};

  const add = (group: string, url?: unknown, copyright?: unknown) => {
    if (typeof url !== "string" || !url) return;
    (groups[group] ??= []).push({
      url,
      copyright: typeof copyright === "string" ? copyright : undefined,
    });
  };

  if (p?.image_url) add("hero", p.image_url);

  const imgsObj = ms?.images ?? p?.images;
  if (imgsObj && typeof imgsObj === "object" && !Array.isArray(imgsObj)) {
    for (const [key, arr] of Object.entries(imgsObj)) {
      if (!Array.isArray(arr)) continue;
      const group = key?.trim() ? key : "weitere";
      for (const it of arr) add(group, it?.image_url ?? it, it?.copyright);
    }
  }

  const dedupe = (arr: { url: string; copyright?: string }[]) => {
    const seen = new Set<string>();
    const out: { url: string; copyright?: string }[] = [];
    for (const it of arr) {
      if (seen.has(it.url)) continue;
      seen.add(it.url);
      out.push(it);
    }
    return out;
  };

  for (const k of Object.keys(groups)) groups[k] = dedupe(groups[k]);
  if (!groups.hero?.length) delete groups.hero;

  return groups;
});

const heroImage = computed(
  () =>
    imageGroups.value.hero?.[0]?.url ||
    main.value?.image_url ||
    plant.value?.image_url ||
    fallbackImage,
);
computed(() => {
  const cn = main.value?.common_names ?? plant.value?.common_names;
  if (!cn || typeof cn !== "object") return [];
  const out: { lang: string; names: string[] }[] = [];
  for (const [lang, arr] of Object.entries(cn)) {
    const names = normalizeList(arr);
    if (names.length) out.push({ lang, names });
  }
  return out.sort((a, b) => a.lang.localeCompare(b.lang));
});
const distribution = computed(() => {
  const d = main.value?.distribution ?? plant.value?.distribution;
  const native = normalizeList(d?.native);
  const introduced = normalizeList(d?.introduced);
  return { native, introduced };
});

const synonyms = computed(() => {
  const s = main.value?.synonyms ?? plant.value?.synonyms;
  if (!Array.isArray(s)) return [];
  return s
    .map((x) => x?.name ?? x)
    .map((x) => String(x ?? "").trim())
    .filter(Boolean);
});

const taxaTables = computed(() => {
  const p = plant.value;
  const subspecies = Array.isArray(p?.subspecies) ? p.subspecies : [];
  const varieties = Array.isArray(p?.varieties) ? p.varieties : [];
  return { subspecies, varieties };
});

const sources = computed(() => {
  const s = main.value?.sources ?? plant.value?.sources;
  return Array.isArray(s) ? s : [];
});

const links = computed(() => {
  const l = main.value?.links ?? plant.value?.links;
  if (!l || typeof l !== "object") return [];
  const out: { key: string; value: string }[] = [];
  for (const [k, v] of Object.entries(l)) {
    if (typeof v === "string" && v.trim()) out.push({ key: k, value: v });
  }
  return out;
});
</script>

<template>
  <v-container fluid class="py-10">
    <v-row class="mb-8" align="center" justify="space-between">
      <v-col cols="12" md="8">
        <div class="d-flex align-center ga-4 mb-2">
          <v-avatar color="primary" variant="tonal" size="52">
            <v-icon size="30">mdi-leaf</v-icon>
          </v-avatar>

          <div class="min-w-0">
            <h1 class="text-h4 font-weight-bold mb-1 text-truncate">
              {{ title }}
            </h1>
            <p v-if="subtitle" class="text-body-2 text-medium-emphasis mb-0">
              <em>{{ subtitle }}</em>
            </p>
            <p v-else class="text-body-2 text-medium-emphasis mb-0">
              Details aus der API (Felder können <code>null</code> sein).
            </p>

            <div class="d-flex flex-wrap ga-2 mt-3">
              <v-chip
                v-for="b in badges"
                :key="b.label"
                size="small"
                variant="tonal"
                color="primary"
              >
                <v-icon start size="16">{{ b.icon }}</v-icon>
                {{ b.label }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="4" class="d-flex justify-end ga-2">
        <v-btn variant="text" to="/search/Plant">
          <v-icon start>mdi-arrow-left</v-icon>
          Zur Suche
        </v-btn>

        <v-btn
          color="primary"
          variant="elevated"
          :loading="pending"
          @click="refresh"
        >
          Neu laden
          <v-icon end>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="error" class="mb-6">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" border="start">
          {{ error?.message ?? "Fehler beim Abrufen der Pflanze." }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="pending" class="mb-6">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image, article" />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader
          type="article, list-item-three-line, list-item-three-line"
        />
      </v-col>
    </v-row>

    <v-row v-else-if="!plant" class="mb-6">
      <v-col cols="12">
        <v-alert type="info" variant="tonal" border="start">
          Keine Daten gefunden.
        </v-alert>
      </v-col>
    </v-row>

    <template v-else>
      <v-row class="mb-8">
        <v-col cols="12">
          <v-card rounded="xl" elevation="6" class="overflow-hidden">
            <v-img :src="heroImage" :alt="title" height="360" cover>
              <template #error>
                <div
                  class="d-flex align-center justify-center text-caption text-medium-emphasis"
                  style="height: 100%; background-color: #eee"
                >
                  Kein Bild verfügbar
                </div>
              </template>

              <div
                style="
                  height: 100%;
                  background: linear-gradient(
                    0deg,
                    rgba(0, 0, 0, 0.6),
                    rgba(0, 0, 0, 0)
                  );
                "
                class="d-flex flex-column justify-end"
              >
                <div class="px-6 pb-6">
                  <div class="text-h5 font-weight-bold text-white">
                    {{ title }}
                  </div>
                  <div class="text-body-2 text-white text-medium-emphasis">
                    <span class="text-white">{{
                      safeText(plant.common_name)
                    }}</span>
                    <span v-if="main?.scientific_name">
                      · <em>{{ main.scientific_name }}</em></span
                    >
                    <span v-if="plant.slug"> · {{ plant.slug }}</span>
                  </div>
                </div>
              </div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-8" align="stretch">
        <v-col cols="12" md="6" class="d-flex flex-column ga-6">
          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-information-outline</v-icon>
              Basis & Taxonomie
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Common Name
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ safeText(plant.common_name) }}
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Scientific Name
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    <em>{{ safeText(main?.scientific_name) }}</em>
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">Familie</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ pickName(plant.family) }}
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">Gattung</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ pickName(plant.genus) }}
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">Autor</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ safeText(main?.author) }}
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">Jahr</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ safeText(main?.year) }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis">
                    Beobachtung
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ safeText(plant.observations) }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-swap-horizontal</v-icon>
              Synonyme
            </v-card-title>

            <v-card-text>
              <div v-if="synonyms.length" class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="s in synonyms"
                  :key="s"
                  size="small"
                  variant="tonal"
                >
                  {{ s }}
                </v-chip>
              </div>
              <v-alert v-else type="info" variant="tonal">
                Keine Synonyme vorhanden.
              </v-alert>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-book-open-outline</v-icon>
              Quellen & Links
            </v-card-title>

            <v-card-text>
              <v-list v-if="sources.length" density="compact">
                <v-list-item
                  v-for="(s, idx) in sources"
                  :key="(s.id ?? idx) + ''"
                >
                  <template #prepend>
                    <v-avatar size="28" color="primary" variant="tonal">
                      <v-icon size="16">mdi-source-branch</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="d-flex align-center ga-2">
                    <strong>{{ safeText(s.name) }}</strong>
                    <v-chip v-if="s.id" size="x-small" variant="tonal">{{
                      s.id
                    }}</v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    Letztes Update: {{ formatDate(s.last_update) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      v-if="isUrl(s.url)"
                      icon
                      variant="text"
                      :href="s.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      :title="`Quelle öffnen (${safeText(s.name)})`"
                    >
                      <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <v-alert v-else type="info" variant="tonal">
                Keine Quellen vorhanden.
              </v-alert>

              <v-divider class="my-4" />

              <div v-if="links.length" class="d-flex flex-wrap ga-2">
                <v-btn
                  v-for="l in links"
                  :key="l.key"
                  size="small"
                  variant="tonal"
                  color="primary"
                  :href="isUrl(l.value) ? l.value : undefined"
                  :disabled="!isUrl(l.value)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ l.key }}
                  <v-icon v-if="isUrl(l.value)" end>mdi-open-in-new</v-icon>
                </v-btn>
              </div>
              <div v-else class="text-medium-emphasis">
                Keine Links vorhanden.
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- RIGHT COLUMN -->
        <v-col cols="12" md="6" class="d-flex flex-column ga-6">
          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-flash-outline</v-icon>
              Quick Facts
            </v-card-title>

            <v-card-text>
              <v-list density="compact" class="py-0">
                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    <span class="text-medium-emphasis">Essbar:</span>
                    <v-chip
                      class="ms-2"
                      size="small"
                      variant="tonal"
                      color="primary"
                    >
                      {{ yesNoUnknown(main?.edible ?? plant.edible) }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    <span class="text-medium-emphasis">Gemüse:</span>
                    <v-chip
                      class="ms-2"
                      size="small"
                      variant="tonal"
                      color="primary"
                    >
                      {{ yesNoUnknown(plant.vegetable) }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-3" />

                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    <span class="text-medium-emphasis">pH:</span>
                    <strong class="ms-2">
                      {{
                        main?.growth?.ph_minimum != null ||
                        main?.growth?.ph_maximum != null
                          ? `${safeText(main?.growth?.ph_minimum)}–${safeText(main?.growth?.ph_maximum)}`
                          : "—"
                      }}
                    </strong>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    <span class="text-medium-emphasis">Licht (Skala):</span>
                    <strong class="ms-2">{{
                      safeText(main?.growth?.light)
                    }}</strong>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    <span class="text-medium-emphasis"
                      >Atmosphären-Feuchte (Skala):</span
                    >
                    <strong class="ms-2">{{
                      safeText(main?.growth?.atmospheric_humidity)
                    }}</strong>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-file-tree-outline</v-icon>
              Unterarten & Varietäten
            </v-card-title>

            <v-card-text>
              <v-expansion-panels variant="accordion">
                <v-expansion-panel rounded="lg">
                  <v-expansion-panel-title>
                    Unterarten ({{ taxaTables.subspecies.length }})
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-table
                      v-if="taxaTables.subspecies.length"
                      density="compact"
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Rang</th>
                          <th>Jahr</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="s in taxaTables.subspecies" :key="s.id">
                          <td class="font-weight-medium">
                            {{ safeText(s.scientific_name) }}
                          </td>
                          <td>{{ safeText(s.status) }}</td>
                          <td>{{ safeText(s.rank) }}</td>
                          <td>{{ safeText(s.year) }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                    <div v-else class="text-medium-emphasis">—</div>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel rounded="lg">
                  <v-expansion-panel-title>
                    Varietäten ({{ taxaTables.varieties.length }})
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-table
                      v-if="taxaTables.varieties.length"
                      density="compact"
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Rang</th>
                          <th>Jahr</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="v in taxaTables.varieties" :key="v.id">
                          <td class="font-weight-medium">
                            {{ safeText(v.scientific_name) }}
                          </td>
                          <td>{{ safeText(v.status) }}</td>
                          <td>{{ safeText(v.rank) }}</td>
                          <td>{{ safeText(v.year) }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                    <div v-else class="text-medium-emphasis">—</div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-map-marker-outline</v-icon>
              Verbreitung
            </v-card-title>

            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-2">Nativ</div>
              <div class="d-flex flex-wrap ga-2 mb-5">
                <v-chip
                  v-for="c in distribution.native"
                  :key="'n-' + c"
                  size="small"
                  variant="tonal"
                >
                  {{ c }}
                </v-chip>
                <span
                  v-if="!distribution.native.length"
                  class="text-medium-emphasis"
                  >—</span
                >
              </div>

              <div class="text-caption text-medium-emphasis mb-2">
                Eingeführt
              </div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="c in distribution.introduced"
                  :key="'i-' + c"
                  size="small"
                  variant="tonal"
                >
                  {{ c }}
                </v-chip>
                <span
                  v-if="!distribution.introduced.length"
                  class="text-medium-emphasis"
                  >—</span
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="Object.keys(imageGroups).length" class="mb-10">
        <v-col cols="12">
          <v-card rounded="xl" elevation="4">
            <v-card-title class="d-flex align-center ga-2">
              <v-icon>mdi-image-multiple-outline</v-icon>
              Galerie (kategorisiert)
            </v-card-title>

            <v-card-text>
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="(imgs, group) in imageGroups"
                  :key="group"
                  rounded="lg"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center ga-2">
                      <v-icon>mdi-folder-image</v-icon>
                      <strong>{{ group }}</strong>
                      <span class="text-medium-emphasis"
                        >({{ imgs.length }})</span
                      >
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-row>
                      <v-col
                        v-for="(img, idx) in imgs"
                        :key="img.url + ':' + idx"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                      >
                        <v-card
                          rounded="lg"
                          elevation="2"
                          class="overflow-hidden"
                        >
                          <v-img
                            :src="img.url"
                            :alt="title"
                            height="170"
                            cover
                          />
                          <v-card-text
                            v-if="img.copyright"
                            class="text-caption text-medium-emphasis"
                          >
                            {{ img.copyright }}
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
