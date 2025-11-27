<script setup lang="ts">
const plant = {
  id: 128917,
  commonName: "Narrow-leaf plantain",
  slug: "plantago-lanceolata",
  scientificName: "Plantago lanceolata",
  year: 1753,
  bibliography: "Sp. Pl.: 113 (1753)",
  author: "L.",
  genus: "Plantago",
  family: "Plantaginaceae",
  vegetable: false,
  imageUrl: "https://bs.plantnet.org/image/o/f8d7d6fe52e36d04f5ad1fc03f46f604d5c3cc43",
  mainSpecies: {
    observations: "Macaronesia, N. Africa to Mauritania, Temp. Eurasia",
    images: {
      flower: [
        {
          id: 227347,
          image_url: "https://bs.plantnet.org/image/o/49751f9e2c111ebb66683872b9fb22c3690f7462",
          copyright: "Taken May 22, 2017 by isabelle ferré (cc-by-sa)"
        }
      ],
      leaf: [
        {
          id: 227353,
          image_url: "https://bs.plantnet.org/image/o/e65439a5eb321e3764845ea5b8c25f9eba0615b9",
          copyright: "Taken Feb 8, 2019 by Creu Lopez (cc-by-sa)"
        }
      ],
      habit: [
        {
          id: 227358,
          image_url: "https://bs.plantnet.org/image/o/e2f50ff54e6033908f297103e5d73362e5f7d662",
          copyright: "Taken Jan 14, 2022 by Tristan Jaton-Maria (cc-by-sa)"
        }
      ],
      bark: [
        {
          id: 227363,
          image_url: "https://bs.plantnet.org/image/o/6b52b2f687354ff4ab9f141588e47cbc1b6a5600",
          copyright: "Taken Mar 21, 2022 by Pierre LEON (cc-by-sa)"
        }
      ],
      fruit: [
        {
          id: 227370,
          image_url: "https://bs.plantnet.org/image/o/f6d804e10489e2636d641c2215bc2f5cbccf07e0",
          copyright: "Taken Jun 7, 2019 by Mevi (cc-by-sa)"
        }
      ],
      other: [
        {
          id: 227375,
          image_url: "https://bs.plantnet.org/image/o/686f91963a6c9a65a3f6eea35409edd31ace4dbf",
          copyright: "Taken Jul 18, 2021 by Wouter (cc-by-sa)"
        }
      ],
      misc: [
        {
          id: 227342,
          image_url: "https://d2seqvvyy3b8p2.cloudfront.net/f3d29bcc3eb9e1915dc55265f32bb05e.jpg",
          copyright: "© Board of Trustees of the Royal Botanic Gardens, Kew."
        }
      ]
    },
    distribution: {
      native: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Austria",
        "Azores"
      ],
      introduced: [
        "Alabama",
        "Alaska",
        "Argentina Northeast",
        "Arizona",
        "Arkansas"
      ]
    },
    flower: {
      color: null,
      conspicuous: null
    },
    foliage: {
      texture: null,
      color: null,
      leaf_retention: null
    },
    fruit_or_seed: {
      conspicuous: null,
      color: null,
      shape: null,
      seed_persistence: null
    },
    specifications: {
      ligneous_type: null,
      growth_form: null,
      growth_habit: "Forb/herb",
      growth_rate: null,
      average_height: {
        cm: null
      },
      maximum_height: {
        cm: null
      },
      nitrogen_fixation: null,
      shape_and_orientation: null,
      toxicity: null
    },
    growth: {
      description: null,
      sowing: null,
      days_to_harvest: null,
      row_spacing: {
        cm: null
      },
      spread: {
        cm: null
      },
      ph_maximum: 6.5,
      ph_minimum: 5.5,
      light: 7,
      atmospheric_humidity: 4,
      growth_months: null,
      bloom_months: null,
      fruit_months: null,
      minimum_precipitation: {
        mm: null
      },
      maximum_precipitation: {
        mm: null
      },
      minimum_root_depth: {
        cm: null
      },
      minimum_temperature: {
        deg_f: null,
        deg_c: null
      },
      maximum_temperature: {
        deg_f: null,
        deg_c: null
      },
      soil_nutriments: 6,
      soil_salinity: 0,
      soil_texture: null,
      soil_humidity: null
    }
  },
  genusInfo: {
    id: 6597,
    name: "Plantago",
    slug: "plantago"
  },
  familyInfo: {
    id: 141,
    name: "Plantaginaceae",
    slug: "plantaginaceae"
  },
  sources: [
    {
      name: "WFO",
      url: null
    },
    {
      name: "IPNI",
      url: null
    },
    {
      name: "POWO",
      url: "http://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:321285-2"
    },
    {
      name: "GBIF",
      url: "https://www.gbif.org/species/8208358"
    },
    {
      name: "PlantNet",
      url: "https://identify.plantnet.org/species/the-plant-list/Plantago lanceolata L."
    }
  ],
  synonyms: [
    "Plantago intermedia",
    "Plantago lanceolata var. communis",
    "Plantago lanceifolia"
  ]
}

const imageTabs = [
  { key: "habit", label: "Habitus" },
  { key: "flower", label: "Blüte" },
  { key: "leaf", label: "Blatt" },
  { key: "fruit", label: "Frucht" },
  { key: "bark", label: "Rinde" },
  { key: "other", label: "Sonstiges" },
  { key: "misc", label: "Illustration" }
]

const selectedImageTab = ref("habit")

const growthValue = (value: number | null | undefined, max = 10) =>
    typeof value === "number" ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
</script>
<template>
  <v-container class="detail-page">
    <v-row>
      <v-col cols="12">
        <h1 class="title">
          {{ plant.commonName }} <span v-if="plant.commonName" class="subtitle">({{ plant.scientificName }})</span>
          <span v-else>{{ plant.scientificName }}</span>
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="image-card" elevation="2">
          <v-img
              v-if="plant.imageUrl"
              :src="plant.imageUrl"
              cover
              height="500"
          />
          <div v-else class="placeholder">
            Kein Bild vorhanden
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4" align="stretch">
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-4">
          <v-card-title>Basisinformationen</v-card-title>
          <v-card-text>
            <dl>
              <div class="row">
                <dt>ID</dt>
                <dd>{{ plant.id }}</dd>
              </div>
              <div class="row">
                <dt>Wissenschaftlicher Name</dt>
                <dd>{{ plant.scientificName }}</dd>
              </div>
              <div class="row" v-if="plant.commonName">
                <dt>Trivialname</dt>
                <dd>{{ plant.commonName }}</dd>
              </div>
              <div class="row">
                <dt>Slug</dt>
                <dd>{{ plant.slug }}</dd>
              </div>
              <div class="row">
                <dt>Gattung</dt>
                <dd>{{ plant.genus }}</dd>
              </div>
              <div class="row">
                <dt>Familie</dt>
                <dd>{{ plant.family }}</dd>
              </div>
              <div class="row">
                <dt>Erstbeschreibung</dt>
                <dd>{{ plant.year }} – {{ plant.author }}</dd>
              </div>
              <div class="row">
                <dt>Bibliographie</dt>
                <dd>{{ plant.bibliography }}</dd>
              </div>
              <div class="row">
                <dt>Gemüsepflanze</dt>
                <dd>{{ plant.vegetable ? "Ja" : "Nein" }}</dd>
              </div>
            </dl>
          </v-card-text>
        </v-card>
        <v-card elevation="2">
          <v-card-title>Taxonomie</v-card-title>
          <v-card-text>
            <dl>
              <div class="row">
                <dt>Gattung</dt>
                <dd>{{ plant.genusInfo.name }} ({{ plant.genusInfo.slug }})</dd>
              </div>
              <div class="row">
                <dt>Familie</dt>
                <dd>{{ plant.familyInfo.name }} ({{ plant.familyInfo.slug }})</dd>
              </div>
              <div class="row">
                <dt>Wachstumstyp</dt>
                <dd>{{ plant.mainSpecies.specifications.growth_habit ?? "Unbekannt" }}</dd>
              </div>
            </dl>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-4">
          <v-card-title>Beobachtungen</v-card-title>
          <v-card-text>
            <p>{{ plant.mainSpecies.observations }}</p>
          </v-card-text>
        </v-card>
        <v-card elevation="2" class="mb-4">
          <v-card-title>Wachstumsparameter</v-card-title>
          <v-card-text>
            <div class="metric-row">
              <span>pH-Bereich</span>
              <span>{{ plant.mainSpecies.growth.ph_minimum }} – {{ plant.mainSpecies.growth.ph_maximum }}</span>
            </div>
            <div class="metric-row">
              <span>Licht</span>
              <v-progress-linear
                  :model-value="growthValue(plant.mainSpecies.growth.light)"
                  height="6"
                  rounded
              />
            </div>
            <div class="metric-row">
              <span>Luftfeuchtigkeit</span>
              <v-progress-linear
                  :model-value="growthValue(plant.mainSpecies.growth.atmospheric_humidity)"
                  height="6"
                  rounded
              />
            </div>
            <div class="metric-row">
              <span>Bodennährstoffe</span>
              <v-progress-linear
                  :model-value="growthValue(plant.mainSpecies.growth.soil_nutriments)"
                  height="6"
                  rounded
              />
            </div>
            <div class="metric-row">
              <span>Bodensalinität</span>
              <v-progress-linear
                  :model-value="growthValue(plant.mainSpecies.growth.soil_salinity)"
                  height="6"
                  rounded
              />
            </div>
          </v-card-text>
        </v-card>
        <v-card elevation="2">
          <v-card-title>Externe Quellen</v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                  v-for="s in plant.sources"
                  :key="s.name"
              >
                <template #title>
                  <span>{{ s.name }}</span>
                </template>
                <template #subtitle>
                  <a v-if="s.url" :href="s.url" target="_blank" rel="noopener noreferrer">
                    {{ s.url }}
                  </a>
                  <span v-else>Keine URL verfügbar</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12" md="7">
        <v-card elevation="2" class="mb-4">
          <v-card-title>Verbreitung</v-card-title>
          <v-card-text>
            <v-expansion-panels multiple>
              <v-expansion-panel value="native">
                <v-expansion-panel-title>Heimisch (native)</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-chip-group column>
                    <v-chip
                        v-for="country in plant.mainSpecies.distribution.native"
                        :key="country"
                        class="ma-1"
                        size="small"
                    >
                      {{ country }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel value="introduced">
                <v-expansion-panel-title>Eingeführt (introduced)</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-chip-group column>
                    <v-chip
                        v-for="country in plant.mainSpecies.distribution.introduced"
                        :key="country"
                        class="ma-1"
                        size="small"
                    >
                      {{ country }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
        <v-card elevation="2">
          <v-card-title>Synonyme</v-card-title>
          <v-card-text>
            <v-list v-if="plant.synonyms.length" density="compact">
              <v-list-item
                  v-for="s in plant.synonyms"
                  :key="s"
                  :title="s"
              />
            </v-list>
            <p v-else>Keine Synonyme bekannt.</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card elevation="2">
          <v-card-title>Bilder</v-card-title>
          <v-card-text>
            <v-tabs
                v-model="selectedImageTab"
                density="compact"
                class="mb-2"
            >
              <v-tab
                  v-for="tab in imageTabs"
                  :key="tab.key"
                  :value="tab.key"
              >
                {{ tab.label }}
              </v-tab>
            </v-tabs>
            <div class="image-list">
              <v-img
                  v-for="img in plant.mainSpecies.images[selectedImageTab] || []"
                  :key="img.id"
                  :src="img.image_url"
                  class="mb-2 rounded-lg"
                  height="250"
                  contain
              />
              <div v-if="!(plant.mainSpecies.images[selectedImageTab] || []).length" class="placeholder small">
                Keine Bilder in dieser Kategorie
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>