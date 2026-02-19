# Pflanzagotchi — Projektdokumentation

Zuletzt aktualisiert: 19.02.2026

## Übersicht

Pflanzagotchi ist eine Nuxt 4 (Vue 3) Anwendung zur Katalogisierung von Zimmerpflanzen, zur Visualisierung aktueller Sensordaten und zur Anreicherung von Pflanzendaten mit externen botanischen Informationen der Trefle API. Die Anwendung basiert auf einer **SOLID-konformen Architektur** mit einem dedizierten **Service-Layer** und bietet folgende Kernfunktionen:

- **Pflanzen-Management**: Übersichtsgitter mit Suche, Filtern und Sortierung für die eigenen Pflanzen.
- **Detailansichten**: Detaillierte Seiten pro Pflanze mit Bildern, Taxonomie und kuratierten Fakten (via Trefle).
- **Interaktive Pflege**: Workflows zum Gießen, Düngen und Zurückschneiden von Pflanzen.
- **Sensordaten**: Eingebettete Trend-Graphen für Temperatur, Luftfeuchtigkeit und Bodenfeuchtigkeit.
- **XP & Achievement-System**: Nutzer sammeln XP durch die Pflege ihrer Pflanzen und können tägliche Quests sowie Erfolge (Achievements) abschließen.
  - **Spieler-Fortschritt**: Globales Level und XP für den Benutzer.
  - **Pflanzen-Evolution**: Jede Pflanze hat eigene XP, Level und einen Gesundheitsstatus.
- **Multi-User & Authentifizierung**: Registrierung und Login-System mit Passwort-Hashing (scrypt) und Sitzungsverwaltung via Cookies. Daten sind nutzerspezifisch getrennt.

Die App nutzt Vuetify 3 für die UI-Komponenten, Prisma als ORM und PostgreSQL (via Docker Compose) als Datenbank.

## Tech-Stack

- **Framework**: Nuxt ^4.1 (Vue 3)
- **UI**: Vuetify ^3.10, Material Design Icons (@mdi/font)
- **Sprache/Build**: TypeScript, Vite
- **Lint/Format**: ESLint, Prettier
- **Datenschicht**: Prisma ^7 mit @prisma/adapter-pg → PostgreSQL 15 (Service-Layer Pattern)
- **Konfiguration**: Vollständig über Umgebungsvariablen (`.env`) steuerbar.
- **Externe Daten**: Trefle API (geproxied über Nuxt Server-Endpoints)

## Projektstruktur

Wichtige Ordner und Dateien im Root:

- `app/`: Frontend-Code (Seiten, Komponenten, Composables, Plugins).
- `server/`: Nuxt Server-Routes (API) und Utilities.
- `prisma/`: Prisma-Schema und Seed-Skripte.
- `generated/`: Output des Prisma Clients.
- `lib/`: Prisma-Client Bootstrap.
- `public/`: Statische Dateien.
- `docker-compose.yml`: Konfiguration für die lokale Postgres-Datenbank.
- `nuxt.config.ts`: Nuxt-Konfiguration (RuntimeConfig, Vite/Vuetify Integration).

### Frontend (app/)

- **Seiten (app/pages/)**:
  - `index.vue`: Übersicht der eigenen Pflanzen.
  - `login.vue` / `register.vue`: Authentifizierungsseiten.
  - `quests.vue`: Übersicht der täglichen Aufgaben.
  - `achievements.vue`: Übersicht der freigeschalteten Erfolge.
  - `Plant[id].vue`: Detailansicht einer lokalen Pflanze (inkl. Aktionen).
  - `Plants/[slug].vue`: Detailansicht einer Pflanze aus der Trefle-Datenbank.
  - `CreatePlantForm.vue`: Formular zum Anlegen einer neuen Pflanze.
  - `search/Plant.vue`: Suche in der Trefle-API.
- **Komponenten (app/components/)**:
  - `plantCard.vue`: Karteikarte in der Übersicht.
  - `sensorDataGraph.vue`: Sparklines für Sensordaten.
  - `StatusBars.vue`, `GrowthLoreCard.vue`, etc.: Detail-Komponenten.
- **Composables (app/composables/)**:
  - `usePlants.ts`: API-Calls für lokale Pflanzen (mit Cookie-Forwarding für SSR).
  - `useApi.ts`: Kommunikation mit der Trefle-Proxy-API.

### Backend (server/)

- **API-Endpunkte (server/api/)**:
  - `auth/`: Login, Logout, Registrierung und Session-Info.
  - `plant/`: REST-API für lokale Pflanzen (aufgeteilt in spezialisierte Dateien wie `.get.ts`, `.put.ts`, etc.).
  - `sensorData/`: REST-API für Sensordaten.
  - `quests/`: Management täglicher Quests.
  - `achievements/`: Management der Erfolge.
  - `user/`: Endpunkte für Nutzerdaten, XP und Aktionen.
  - `trefle/`: Proxy für externe Trefle-Anfragen.
- **Utilities (server/utils/)**:
  - `services/`: **Service-Layer** (UserService, PlantService, etc.), der die gesamte Prisma-Kommunikation kapselt.
  - `actions.ts` & `actionConfigs.ts`: Zentraler Orchestrator für Spiel-Aktionen.
  - `health.ts`: Dynamische Berechnung der Pflanzengesundheit.
  - `auth.ts`: Passwort-Hashing und User-Identifizierung.
  - `fetch.ts`: Utility für interne Server-zu-Server API-Calls mit Header-Forwarding.
  - `transformers.ts`: Zentrale Daten-Validierung und -Transformation.

## Datenbank & ORM

Das Prisma-Schema (`prisma/schema.prisma`) definiert folgende Hauptmodelle:

- **Plant (Tabelle: PLANT)**:
  - Metadaten (Name, Typ, Ort, Botanischer Name).
  - Zeitstempel (Gepflanzt, Gießen, Düngen, Schneiden).
  - Progression (XP, Level, Health).
  - `last_interaction`: Zeitstempel der letzten Pflege zur Gesundheitsberechnung.
  - Relation zu User und SensorData.
- **User (Tabelle: USER)**:
  - Login-Daten (Email, Passwort-Hash).
  - Globaler Fortschritt (XP, Level).
- **SensorData (Tabelle: SENSOR_DATA)**:
  - Messwerte (Temp, Feuchtigkeit, CO2, Licht).
- **Achievement & UserAchievement**:
  - Definition von Erfolgen und deren Zuweisung zu Nutzern.
- **DailyQuest & UserQuest**:
  - Aufgaben-Vorlagen und nutzerspezifische Tages-Quests.
  - `UserQuest` besitzt einen Unique-Constraint auf `[userId, questId, date]`.

## API-Referenz

### Lokale Daten (Postgres)

- `GET /api/plant`: Liste der Pflanzen des aktuellen Users.
- `POST /api/plant`: Erstellt eine neue Pflanze.
- `GET /api/plant/:id`: Details einer spezifischen Pflanze (inkl. Sensordaten).
- `PUT /api/plant/:id`: Update von Feldern.
- `DELETE /api/plant/:id`: Löscht eine Pflanze.
- `POST /api/user/action`: Zentraler Endpunkt zum Triggern von Aktionen (Gießen, Düngen, etc.).
- `GET /api/quests`: Liefert die täglichen Quests des Users.
- `GET /api/achievements`: Liefert alle Achievements inkl. Status des Users.

### Interne Business-Logik (API-Driven)

Um SOLID-Prinzipien einzuhalten, werden Progressionen über interne API-Calls abgewickelt:
- `POST /api/user/xp`: Aktualisiert User-XP und Level.
- `POST /api/plant/:id/xp`: Aktualisiert Pflanzen-XP, Level und berechnet Gesundheit.
- `POST /api/achievements/award`: Verleiht einem Nutzer ein Achievement.
- `POST /api/quests/progress`: Aktualisiert den Fortschritt von Quests.
- `POST /api/user/achievement/check-level`: Prüft auf Level-basierte Erfolge.

### Sensordaten

- `GET /api/sensorData`: Liste aller Sensordaten.
- `POST /api/sensorData`: Erstellt einen neuen Datensatz (benötigt `plant_id`).
- `GET /api/sensorData/:id`: Details eines spezifischen Messwerts.
- `DELETE /api/sensorData/:id`: Löscht einen Messwert.

### Authentifizierung

- `POST /api/auth/register`: Erstellt einen neuen Account.
- `POST /api/auth/login`: Authentifiziert den User und setzt ein `user-id` Cookie.
- `POST /api/auth/logout`: Löscht das Session-Cookie.
- `GET /api/auth/me`: Liefert Informationen zum aktuell angemeldeten User.

### Trefle Proxy

- `GET /api/trefle/plant/search?q=<query>`: Sucht in der botanischen Datenbank.
- `GET /api/trefle/plant/:idOrSlug`: Detaildaten einer Spezies.

## Setup & Entwicklung

### Voraussetzungen

- Node.js 20+
- Docker (für die lokale Datenbank)
- Trefle API-Token (für Suche/Details)

### Installation

1. **Umgebung konfigurieren**:
   Erstellen Sie eine `.env`-Datei im Root-Verzeichnis:

   ```env
   DATABASE_URL=postgresql://pflanzagotchi:devpassword@localhost:5432/pflanzagotchi
   NUXT_API_BASE=https://trefle.io/api/v1
   NUXT_API_KEY=dein_trefle_token
   ```

2. **Datenbank starten**:

   ```bash
   docker compose up -d
   ```

3. **Prisma & Initialisierung**:

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Anwendung starten**:
   ```bash
   npm run dev
   ```

## XP- & Level-Logik

Das gesamte Balancing ist über die `.env`-Datei konfigurierbar.

### Nutzer-Level

- Nutzer erhalten XP für verschiedene Aktionen (Standardwerte):
  - Hinzufügen einer Pflanze: 100 XP (Achievement) + 50 XP (Quest).
  - Gießen: 10 XP.
  - Düngen: 20 XP.
  - Sensoren prüfen: 5 XP.
  - Zurückschneiden: 15 XP.
- Ein Level-Up erfolgt standardmäßig alle 1000 XP.

### Pflanzen-Level & Gesundheit

- Pflanzen erhalten pro Aktion standardmäßig 50 XP.
- Ein Level-Up erfolgt alle 500 XP.
- **Dynamische Gesundheit**:
  - Die Gesundheit sinkt automatisch um **20% pro Woche** (konfigurierbar), wenn keine Interaktion stattfindet.
  - Die Berechnung erfolgt linear beim Abruf der Daten (`health.ts`).
  - Jede Pflege-Aktion (Gießen, Düngen, Schneiden) erhöht die Gesundheit um **5 Punkte** (bis max. 100%).

## Styling & Theming

- Vuetify wird in `app/plugins/vuetify.ts` mit dem Standard MDI-Icon-Set registriert.
- Globale Stile befinden sich in `app/assets/css/plant.css`.

## Qualitätssicherung & Tooling

- **Linting**: `npm run lint` (eslint . --fix)
- **Formatierung**: `npm run format` (prettier --write .)

## Fehlerbehebung

- **Datenbank-Verbindung**: Stellen Sie sicher, dass `DATABASE_URL` mit der laufenden Postgres-Instanz übereinstimmt.
- **Prisma-Probleme**: Führen Sie nach Schema-Änderungen `npx prisma generate` aus.
- **SSR 401 Fehler**: Die Composables (z.B. `usePlants.ts`) müssen Cookies explizit weiterleiten, wenn sie auf dem Server ausgeführt werden.
- **Trefle API-Fehler**: Überprüfen Sie `NUXT_API_BASE` und `NUXT_API_KEY`. Der Proxy hängt den Token automatisch an.

## Roadmap

### Abgeschlossen (✓)

- Grundlegende UI & Vuetify Integration.
- Prisma & PostgreSQL Setup.
- Trefle API Proxy & Integration.
- Authentifizierung & Multi-User Support.
- XP-, Quest- & Achievement-System.
- Daten-Isolation für mehrere Nutzer.
- **SOLID-Refactoring & Service-Layer**.
- **Dynamisches Gesundheitssystem (Zeit-basierter Verfall)**.
- **API-Driven Architecture** (Interne Progression via $fetch).
- **Zentrale Konfiguration** via `.env` und RuntimeConfig.

### Geplant

- Benachrichtigungen bei niedriger Bodenfeuchtigkeit.
- Erweiterte Statistiken über das Pflanzenwachstum.
- Foto-Upload für eigene Pflanzen.
- Social Features: Vergleiche deinen Garten mit Freunden.

## Lizenz

Internes Studienprojekt.
