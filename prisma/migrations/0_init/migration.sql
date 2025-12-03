-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "PLANT" (
    "id" SERIAL NOT NULL,
    "custom_name" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "date_planted" DATE NOT NULL,
    "last_prun" DATE NOT NULL,
    "last_water" DATE NOT NULL,
    "last_fertelized" DATE NOT NULL,
    "gen_data" JSONB NOT NULL,
    "botanical_name" VARCHAR(50) NOT NULL,
    "pref_sun" DECIMAL(65,2) NOT NULL,
    "pref_air_humidity" DECIMAL(65,2) NOT NULL,
    "pref_soil_humidity" DECIMAL(65,2) NOT NULL,

    CONSTRAINT "PLANT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SENSOR_DATA" (
    "sensor_data_id" SERIAL NOT NULL,
    "plant_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(0) NOT NULL,
    "temperature" DECIMAL(65,2) NOT NULL,
    "humidity_air" DECIMAL(65,2) NOT NULL,
    "light_intensity" DECIMAL(65,2) NOT NULL,
    "Humidity_soil" DECIMAL(65,2) NOT NULL,
    "CO2_amount" DECIMAL(65,2) NOT NULL,

    CONSTRAINT "SENSOR_DATA_pkey" PRIMARY KEY ("sensor_data_id")
);

-- CreateIndex
CREATE INDEX "SENSOR_DATA_plant_id_idx" ON "SENSOR_DATA"("plant_id");

-- AddForeignKey
ALTER TABLE "SENSOR_DATA" ADD CONSTRAINT "SENSOR_DATA_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "PLANT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

