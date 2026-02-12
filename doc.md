# Pflanzagotchi — Project Documentation

Last updated: 2026‑02‑09

## Overview

Pflanzagotchi is a Nuxt 4 (Vue 3) application to catalog household plants, visualize recent sensor readings, and enrich plant records with external botanical data from the Trefle API. It provides:

- An overview grid with search, filters, and sorting
- Detailed plant pages with images, taxonomy, and curated facts (from Trefle)
- A creation/editing workflow for local Plant records
- Embedded sensor trend sparklines (temperature, air humidity, soil humidity)
- A simple REST API (Nuxt server routes) backed by Prisma and PostgreSQL
- **XP & Achievement System**: Earn XP by caring for your plants (Water, Fertilize, Prune) and complete daily quests and achievements.
  - **Player Progression**: Overall level and XP for the user.
  - **Plant Evolution**: Each plant has its own XP, Level, and Health status. Level up plants by interacting with them!
- **Authentication System**: Login and Register pages with password hashing (scrypt) and session management via cookies.

The app uses Vuetify 3 for UI components and Prisma as ORM, with Docker Compose for a local Postgres database.

## Tech Stack

- Framework: Nuxt ^4.1 (Vue 3)
- UI: Vuetify ^3.10, Material Design Icons (@mdi/font)
- Language/Build: TypeScript, Vite (Nuxt’s Vite integration)
- Lint/Format: ESLint, Prettier
- Data layer: Prisma ^7 with @prisma/adapter-pg → PostgreSQL 15
- External data: Trefle API (proxied through Nuxt server endpoints)

## Project Layout

Root highlights:

- app/ … Application code (pages, components, composables, plugins, assets)
- server/ … Nuxt server routes (API) and utilities
- prisma/ … Prisma schema and migrations
- generated/ … Prisma Client output (configured via schema)
- lib/ … Prisma client bootstrap
- public/ … Static files
- docker-compose.yml … Local Postgres service
- nuxt.config.ts … Nuxt configuration (runtimeConfig, Vite/Vuetify integration)

App subfolders:

- app/pages
  - index.vue … Overview grid of plants from local DB
  - CreatePlantForm.vue … Form to create a local Plant
  - Plants/[slug].vue … Detailed view for a Trefle plant (slug/id)
  - Plants/edit/[id].vue … Edit (local Plant)
  - search/Plant.vue … Trefle search UI
- app/components (selection)
  - plantCard.vue, overViewHeader.vue, searchFilterBar.vue
  - sensorDataGraph.vue … Vuetify sparklines for recent readings
  - growthLoreCard.vue, plantHeroCard.vue, StatusBars.vue, etc.
- app/composables
  - usePlants.ts, useSensorData.ts, useApi.ts, useFormat.ts, usePlantUtils.ts
- app/plugins
  - vuetify.ts … Registers Vuetify and MDI icon set
- app/types
  - Plant.ts, SensorData.ts … DTOs, helper interfaces

Server subfolders:

- server/api
  - plant/ … REST for local Plant
  - sensorData/ … REST for local SensorData
  - trefle/ … Proxy endpoints for Trefle (plants/species/genus)
- server/utils/plantApi.ts … Builds Trefle URLs with runtime config and token

## Runtime Configuration

Defined in nuxt.config.ts as runtimeConfig:

- apiBase: Base URL of the Trefle API (e.g., https://trefle.io/api/v1)
- apiKey: API token for Trefle
- public: {} (reserved for future public config)

How to set values:

- Nuxt loads runtime config from environment variables. Define:
  - NUXT_API_BASE=https://trefle.io/api/v1
  - NUXT_API_KEY=your_trefle_token

These are consumed by server/utils/plantApi.ts to proxy and sign outbound calls.

## Database & ORM

Prisma schema (prisma/schema.prisma) maps two core models onto uppercase tables (via @@map):

- Plant (table: PLANT)
  - id (Int, PK, autoincrement)
  - custom_name, name, type, location (String)
  - date_planted, last_pruning, last_water, last_fertilized (Date)
  - xp, level, health (Int) … Plant-specific progression
  - gen_data (Json) … images, growth, sources
  - botanical_name (String)
  - pref_sun, pref_air_humidity, pref_soil_humidity (Decimal)
  - sensorData: SensorData[] (relation)

- SensorData (table: SENSOR_DATA)
  - sensor_data_id (Int, PK, autoincrement)
  - plant_id (Int, FK → PLANT.id)
  - timestamp (Timestamp(0))
  - temperature, humidity_air, light_intensity, humidity_soil, co2_amount (Decimal[65,2])
  - plant: Plant (relation)

- User (table: USER)
  - id, email, password, name, xp, level
- Achievement (table: ACHIEVEMENT)
  - id, name, description, xp_reward, icon
- DailyQuest (table: DAILY_QUEST)
  - id, name, description, xp_reward, type, target

Prisma Client is created with @prisma/adapter-pg in lib/prisma.ts using DATABASE_URL.

## API Reference (Nuxt Server Routes)

Base URL during dev: http://localhost:3000

Local data (Postgres via Prisma):

- GET /api/plant
  - Returns all plants including related sensorData.
- POST /api/plant
  - Creates a new plant. The handler converts ISO date strings to Date and numeric strings to float for decimal fields.
- GET /api/plant/:id
  - Returns a single plant by ID, including sensorData.
- PUT/PATCH /api/plant/:id
  - Updates provided fields. Same date/decimal mapping as POST.
- DELETE /api/plant/:id
  - Deletes the plant.

- GET /api/sensorData
  - Returns all sensor data with attached plant.
- POST /api/sensorData
  - Creates a sensor data record (expects valid plant_id, timestamp and measurement fields).
- GET /api/sensorData/:id
  - Returns a single sensor row (by sensor_data_id) with plant.
- PUT/PATCH /api/sensorData/:id
  - Updates the row.
- DELETE /api/sensorData/:id
  - Deletes the row.

External Trefle proxy (requires NUXT_API_BASE + NUXT_API_KEY):

- GET /api/trefle/plant/search?q=<query>&...
- GET /api/trefle/plant/:idOrSlug
- GET /api/trefle/plant (pagination params supported)
- GET /api/trefle/species, /api/trefle/species/search?q=...
- GET /api/trefle/genus, /api/trefle/genus/:idOrSlug

The proxy is implemented in server/utils/plantApi.ts (adds token and params).

## Frontend Features & Flows

- Overview (app/pages/index.vue)
  - Fetches local plants via usePlants() and displays as PlantCard grid
  - Search (text), filter (location, type), and sort (name, date, location)
  - Shows aggregated preference averages (sun/air/soil humidity)
  - Quick card to create a new plant (→ /CreatePlantForm)

- Plant detail (app/pages/Plants/[slug].vue)
  - Fetches a plant (by slug or id) from Trefle via useApi().getPlant
  - Shows hero image, taxonomy, quick facts (edible, pH, light, humidity)
  - Displays categorized image galleries and distribution chips

- Search (app/pages/search/Plant.vue)
  - Proxies Trefle’s /plants/search; shows cards with image + basic facts
  - Navigates to Plants/[slug] (detailed Trefle page)

- Create Plant (app/pages/CreatePlantForm.vue)
  - Complex Vuetify-based form with validation rules
  - Supports picking/deriving gen_data JSON from search defaults
  - Sends POST to /api/plant; shows progress/disabled while submitting

- Sensor trends (app/components/sensorDataGraph.vue)
  - Renders sparkline charts for the latest N entries (default ~24)
  - Displays min/max and time range labels for readings

## Types & Data Contracts

See app/types/Plant.ts (selection):

- PlantDTO … shape used on the client (dates as ISO strings; decimals as number)
- PlantGenData … image URLs, grouped images, growth info, sources
- Trefle types: TreflePlant, TrefleSearchResponse, TreflePlantDetails

Note: Server endpoints accept strings for dates/decimals and convert internally to Prisma-compatible Date/Decimal before persisting.

## Setup & Development

Prerequisites:

- Node.js 20+
- Docker (for local Postgres) or an external PostgreSQL instance
- Trefle API token (optional for local-only DB features; required for search/details)

1. Configure environment

- Create a .env in the project root for Docker and Prisma, for example:

  POSTGRES_USER=pflanzagotchi
  POSTGRES_PASSWORD=devpassword
  POSTGRES_DB=pflanzagotchi
  DATABASE_URL=postgresql://pflanzagotchi:devpassword@localhost:5432/pflanzagotchi

- Add Nuxt runtime config variables (same .env or your shell env):

  NUXT_API_BASE=https://trefle.io/api/v1
  NUXT_API_KEY=your_trefle_token

2. Start Postgres

- docker compose up -d

3. Generate client and run migrations

- npx prisma generate
- npx prisma migrate dev --name init

4. Install and run the app

- npm install
- npm run dev

Dev URLs:

- Web app: http://localhost:3000
- API routes (examples): http://localhost:3000/api/plant, /api/sensorData

## Data Entry & Examples

- Create a plant: POST /api/plant with JSON body like:

  {
  "custom_name": "Schreibtisch-Monstera",
  "name": "Monstera",
  "type": "Zimmerpflanze",
  "location": "Büro",
  "date_planted": "2025-12-01",
  "last_pruning": "2026-01-10",
  "last_water": "2026-01-24",
  "last_fertilized": "2026-01-05",
  "gen_data": {
  "api_id": 12345,
  "image_url": null,
  "images": {},
  "growth": {},
  "sources": []
  },
  "botanical_name": "Monstera deliciosa",
  "pref_sun": 5.0,
  "pref_air_humidity": 60.0,
  "pref_soil_humidity": 40.0
  }

- Add sensor data: POST /api/sensorData

  {
  "plant_id": 1,
  "timestamp": "2026-01-24T08:00:00Z",
  "temperature": 22.5,
  "humidity_air": 55.2,
  "light_intensity": 300.0,
  "humidity_soil": 42.0,
  "co2_amount": 410.0
  }

## Styling & Theming

- Vuetify is registered in app/plugins/vuetify.ts with default MDI icon set
- Global/feature CSS resides in app/assets/css/plant.css and component-scoped styles

## Quality & Tooling

- Lint: npm run lint (eslint . --fix)
- Format: npm run format (prettier --write .)

## Troubleshooting

- Database connection: Ensure DATABASE_URL matches running Postgres; for Docker the host is localhost:5432 by default in this compose file.
- Prisma issues: Re-run npx prisma generate after schema edits. For migration conflicts, use migrate dev in local development.
- Trefle API errors: Confirm NUXT_API_BASE and NUXT_API_KEY. The server proxy always injects the token as the token query param.
- CORS: Calls to Trefle are routed from the server (no browser CORS needed).

## Roadmap (from gant.mmd)

- Setup: Init milestone (2025‑10‑15)
- UI: Docker Compose (DB), Cards, Styling + Statusbars
- Prisma: Schema, connection, switch to Postgres
- API/Features: Plant + SensorData APIs & composables; overview refactor; Trefle proxy + search; detail page with real DB data; stronger typing; create page fixes; graph axis polishing (2026‑01‑20)
- Cleanup / Finish: Redesign, Growth data fixes, and final refactoring (2026‑01‑22); Project Documentation (2026‑02‑09)

## License

Internal/student project; add a proper license file if open-sourcing.
