<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { usePlants } from "~/composables/usePlants";
import { useFormat } from "~/composables/useFormat";
import type {
  PlantCreateInput,
  PlantGenData,
  PlantGrowth,
  PlantImages,
  TreflePlant,
  TreflePlantDetails,
  TrefleSearchResponse,
} from "~/types/Plant";

const router = useRouter();
const { searchPlants, getPlant } = useApi();
const { createPlant } = usePlants();
const { formatDateForInput } = useFormat();
const isSubmitting = ref(false);
const isSearching = ref(false);
const isLoadingDetails = ref(false);
const formRef = ref<any>(null);
const query = ref<string>("");
const searchError = ref<string | null>(null);
const detailsError = ref<string | null>(null);
const searchResults = ref<TreflePlant[]>([]);
const selectedTrefle = ref<TreflePlant | null>(null);
const plantTypeOptions = [
  "Zimmerpflanze",
  "Kräuter",
  "Gemüse",
  "Obst",
  "Sukkulente",
  "Kaktus",
  "Baum",
  "Strauch",
  "Sonstiges",
];

function todayIso(): string {
  return new Date().toISOString();
}

function updateIsoFromInput(currentIso: string, newDatePart: string): string {
  if (!newDatePart) return currentIso;
  const timePart = currentIso.includes("T")
    ? currentIso.split("T")[1]
    : "00:00:00.000Z";
  return `${newDatePart}T${timePart}`;
}

function defaultPlantGrowth(data?: any): PlantGrowth {
  const g = data || {};
  return {
    light: g.light ?? null,
    sowing: g.sowing ?? null,
    ph_maximum: g.ph_maximum ?? null,
    ph_minimum: g.ph_minimum ?? null,
    description: g.description ?? null,
    growth_form: g.growth_form ?? null,
    growth_rate: g.growth_rate ?? null,
    growth_habit: g.growth_habit ?? null,
    soil_humidity: g.soil_humidity ?? null,
    days_to_harvest: g.days_to_harvest ?? null,
    average_height_cm: g.average_height_cm
      ? {
          max: g.average_height_cm.max ?? null,
          min: g.average_height_cm.min ?? null,
        }
      : { max: null, min: null },
    maximum_height_cm: g.maximum_height_cm
      ? {
          max: g.maximum_height_cm.max ?? null,
          min: g.maximum_height_cm.min ?? null,
        }
      : { max: null, min: null },
    atmospheric_humidity: g.atmospheric_humidity ?? null,
  };
}

function defaultGenData(data?: any): PlantGenData {
  if (data && typeof data === "object")
    return {
      api_id: Number(data.api_id ?? 0),
      image_url: data.image_url ?? null,
      images: data.images || {},
      growth: defaultPlantGrowth(data.growth),
      sources: Array.isArray(data.sources) ? data.sources.map(String) : [],
    };
  return {
    api_id: 0,
    image_url: null,
    images: {},
    growth: defaultPlantGrowth(),
    sources: [],
  };
}

const model = ref<PlantCreateInput>({
  custom_name: "",
  name: "",
  type: "",
  location: "",
  date_planted: todayIso(),
  last_prun: todayIso(),
  last_water: todayIso(),
  last_fertelized: todayIso(),
  botanical_name: "",
  gen_data: defaultGenData(),

  pref_sun: 50,
  pref_air_humidity: 50,
  pref_soil_humidity: 50,
});

const genDataJson = ref<string>(JSON.stringify(model.value.gen_data, null, 2));
const genDataJsonError = ref<string | null>(null);

watch(
  () => model.value.gen_data,
  (gd) => {
    genDataJson.value = JSON.stringify(gd, null, 2);
  },
  { deep: true },
);

watch(genDataJson, (val) => {
  try {
    const parsed = JSON.parse(val);
    model.value.gen_data = defaultGenData(parsed);
    genDataJsonError.value = null;
  } catch {
    genDataJsonError.value = "Ungültiges JSON.";
  }
});

const rules = {
  required: (v: unknown) => (String(v ?? "").trim() ? true : "Pflichtfeld"),
};

const canSearch = computed(() => query.value.trim().length >= 2);

async function onSearch() {
  if (!canSearch.value) return;
  isSearching.value = true;
  searchError.value = null;
  detailsError.value = null;
  selectedTrefle.value = null;
  searchResults.value = [];

  try {
    const apiResult = (await searchPlants(query.value.trim())) as
      | TrefleSearchResponse
      | TreflePlant[];
    searchResults.value = Array.isArray(apiResult)
      ? apiResult
      : (apiResult?.data ?? []);
  } catch (e: any) {
    searchError.value = e?.message ?? "Fehler bei der Suche.";
  } finally {
    isSearching.value = false;
  }
}

function mapTrefleImagesToPlantImages(
  imgs:
    | Record<string, Array<{ image_url?: string; copyright?: string }>>
    | undefined,
): PlantImages {
  if (!imgs) return {};

  const out: PlantImages = {};

  const assign = (key: keyof PlantImages) => {
    const arr = imgs[key as string];
    if (!Array.isArray(arr) || !arr.length) return;
    out[key] = arr
      .filter((x) => typeof x?.image_url === "string" && !!x.image_url)
      .map((x) => ({
        url: String(x.image_url),
        license: x.copyright ? String(x.copyright) : undefined,
      }));
  };

  assign("habit");
  assign("leaf");
  assign("flower");
  assign("fruit");
  assign("bark");
  assign("other");

  return out;
}

function mapAnyGrowthToPlantGrowth(mainSpecies: any): PlantGrowth {
  if (!mainSpecies) return defaultPlantGrowth();
  const g = mainSpecies.growth || {};
  const s = mainSpecies.specifications || {};

  const asNumber = (v: unknown): number | null => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      return isNaN(n) ? null : n;
    }
    return null;
  };

  const pick = <T,>(v: unknown): T | null =>
    v === null || v === undefined ? null : (v as T);

  return {
    growth_form: pick<string>(s["growth_form"]),
    growth_habit: pick<string>(s["growth_habit"]),
    growth_rate: pick<string>(s["growth_rate"]),
    average_height_cm: {
      max: asNumber(s["average_height"]?.["cm"]),
      min: null, // Trefle liefert meist nur einen Wert unter cm
    },
    maximum_height_cm: {
      max: asNumber(s["maximum_height"]?.["cm"]),
      min: null,
    },
    days_to_harvest: asNumber(g["days_to_harvest"]),
    sowing: pick<string>(g["sowing"]),
    description: pick<string>(g["description"]),
    light: asNumber(g["light"]),
    atmospheric_humidity: asNumber(g["atmospheric_humidity"]),
    soil_humidity: asNumber(g["soil_humidity"]),
    ph_minimum: asNumber(g["ph_minimum"]),
    ph_maximum: asNumber(g["ph_maximum"]),
  };
}

async function onPickResult(p: TreflePlant) {
  selectedTrefle.value = p;
  detailsError.value = null;
  isLoadingDetails.value = true;

  try {
    const details = (await getPlant(p.slug)) as TreflePlantDetails;
    const data = details?.data ?? undefined;
    const main = data?.main_species ?? undefined;

    model.value.name = (p.common_name ?? p.scientific_name ?? "").trim();
    model.value.botanical_name = (p.scientific_name ?? "").trim();

    const sourcesArr = (main?.sources ?? data?.sources ?? [])
      .map((s) => s?.url || s?.name)
      .filter(Boolean)
      .map((x) => String(x));
    model.value.gen_data = {
      api_id: Number(p.id ?? 0),
      image_url: p.image_url ?? null,
      images: mapTrefleImagesToPlantImages(main?.images),
      growth: mapAnyGrowthToPlantGrowth(main),
      sources: sourcesArr,
    };
  } catch (e: any) {
    detailsError.value = e?.message ?? "Fehler beim Laden der Detaildaten.";
  } finally {
    isLoadingDetails.value = false;
  }
}

async function onSubmit() {
  const form = formRef.value;
  const result = await form?.validate?.();
  if (!result?.valid) return;
  if (genDataJsonError.value) return;

  isSubmitting.value = true;
  try {
    const created = await createPlant(model.value);
    const newId = (created as any)?.id;

    if (typeof newId === "number") {
      await router.push(`/plant${newId}`);
    }
  } finally {
    isSubmitting.value = false;
  }
}

function onReset() {
  query.value = "";
  searchResults.value = [];
  selectedTrefle.value = null;
  searchError.value = null;
  detailsError.value = null;

  model.value = {
    custom_name: "",
    name: "",
    type: "",
    location: "",
    date_planted: todayIso(),
    last_prun: todayIso(),
    last_water: todayIso(),
    last_fertelized: todayIso(),
    botanical_name: "",
    gen_data: defaultGenData(),
    pref_sun: 50,
    pref_air_humidity: 50,
    pref_soil_humidity: 50,
  };
}
</script>
<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card rounded="lg" elevation="6">
          <v-card-title class="text-h5">Pflanze erstellen</v-card-title>
          <v-card-subtitle>
            Felder gemäß Plant-Type (DTO) ausfüllen – gen_data wird über die
            Suche oder Defaultwerte gesetzt.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-card variant="tonal" rounded="lg" class="mb-4">
              <v-card-title class="text-subtitle-1 d-flex align-center ga-2">
                <v-icon>mdi-magnify</v-icon>
                Daten aus der API übernehmen (optional)
              </v-card-title>
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="query"
                      label="Pflanze suchen (Trefle)"
                      placeholder="z. B. monstera"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-leaf"
                      clearable
                      hide-details
                      @keyup.enter="onSearch"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      class="w-100"
                      :loading="isSearching"
                      :disabled="!canSearch"
                      @click="onSearch"
                    >
                      Suchen
                      <v-icon end>mdi-magnify</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col v-if="searchError" cols="12">
                    <v-alert type="error" variant="tonal" border="start">
                      {{ searchError }}
                    </v-alert>
                  </v-col>
                  <v-col v-if="detailsError" cols="12">
                    <v-alert type="error" variant="tonal" border="start">
                      {{ detailsError }}
                    </v-alert>
                  </v-col>
                  <v-col v-if="searchResults.length" cols="12">
                    <v-select
                      v-model="selectedTrefle"
                      :items="searchResults"
                      :loading="isLoadingDetails"
                      item-title="scientific_name"
                      return-object
                      label="Suchergebnis auswählen (füllt gen_data + Namen)"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-database"
                      @update:model-value="onPickResult"
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-avatar size="32" color="primary" variant="tonal">
                              <v-icon size="18">mdi-leaf</v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title>
                            {{
                              item.raw.common_name || item.raw.scientific_name
                            }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            <span v-if="item.raw.common_name">
                              <em>{{ item.raw.scientific_name }}</em>
                            </span>
                            <span v-else>
                              {{ item.raw.slug }}
                            </span>
                          </v-list-item-subtitle>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-form ref="formRef">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.custom_name"
                    label="Spitzname (custom_name) *"
                    placeholder="z. B. Moni die Monstera"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-tag"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.name"
                    label="Name (name) *"
                    placeholder="z. B. Monstera"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-leaf"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="model.type"
                    :items="plantTypeOptions"
                    label="Typ (type) *"
                    placeholder="Bitte auswählen"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-shape"
                    clearable
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.botanical_name"
                    label="Botanischer Name (botanical_name) *"
                    placeholder="z. B. Monstera deliciosa"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-flower"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="model.location"
                    label="Standort (location) *"
                    placeholder="z. B. Wohnzimmer, Fenster Süd"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-map-marker"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-alert type="info" variant="tonal" density="comfortable">
                    Datumsfelder (YYYY-MM-DD)
                  </v-alert>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatDateForInput(model.date_planted)"
                    label="Eingepflanzt am (date_planted) *"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-calendar-plus"
                    :rules="[rules.required]"
                    @update:model-value="
                      model.date_planted = updateIsoFromInput(
                        model.date_planted,
                        $event,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatDateForInput(model.last_water)"
                    label="Zuletzt gegossen (last_water) *"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-water"
                    :rules="[rules.required]"
                    @update:model-value="
                      model.last_water = updateIsoFromInput(
                        model.last_water,
                        $event,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatDateForInput(model.last_fertelized)"
                    label="Zuletzt gedüngt (last_fertelized) *"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-sprout"
                    :rules="[rules.required]"
                    @update:model-value="
                      model.last_fertelized = updateIsoFromInput(
                        model.last_fertelized,
                        $event,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatDateForInput(model.last_prun)"
                    label="Zuletzt geschnitten (last_prun) *"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-content-cut"
                    :rules="[rules.required]"
                    @update:model-value="
                      model.last_prun = updateIsoFromInput(
                        model.last_prun,
                        $event,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12">
                  <v-divider class="my-2" />
                </v-col>
                <v-col cols="12">
                  <v-expansion-panels variant="accordion">
                    <v-expansion-panel rounded="lg">
                      <v-expansion-panel-title>
                        gen_data (Pflichtfeld) – Details ansehen/bearbeiten
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-textarea
                          v-model="genDataJson"
                          label="gen_data (JSON)"
                          auto-grow
                          rows="10"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-code-json"
                          :error-messages="
                            genDataJsonError ? [genDataJsonError] : []
                          "
                          hint="Wird automatisch durch die Suche befüllt oder bleibt Default."
                          persistent-hint
                        />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn variant="text" color="secondary" @click="router.back()">
              Abbrechen
            </v-btn>
            <v-spacer />
            <v-btn
              variant="tonal"
              color="secondary"
              :disabled="isSubmitting"
              @click="onReset"
            >
              Zurücksetzen
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :loading="isSubmitting"
              @click="onSubmit"
            >
              Speichern
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
