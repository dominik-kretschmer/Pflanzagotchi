-- CreateTable
CREATE TABLE `PLANT` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `custom_name` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `date_planted` DATE NOT NULL,
    `last_prun` DATE NOT NULL,
    `last_water` DATE NOT NULL,
    `last_fertelized` DATE NOT NULL,
    `gen_data` JSON NOT NULL,
    `botanical_name` VARCHAR(50) NOT NULL,
    `pref_sun` DECIMAL(65, 2) NOT NULL,
    `pref_air_humidity` DECIMAL(65, 2) NOT NULL,
    `pref_soil_humidity` DECIMAL(65, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SENSOR_DATA` (
    `sensor_data_id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant_id` INTEGER NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL,
    `temperature` DECIMAL(65, 2) NOT NULL,
    `humidity_air` DECIMAL(65, 2) NOT NULL,
    `light_intensity` DECIMAL(65, 2) NOT NULL,
    `Humidity_soil` DECIMAL(65, 2) NOT NULL,
    `CO2_amount` DECIMAL(65, 2) NOT NULL,

    INDEX `SENSOR_DATA_plant_id_idx`(`plant_id`),
    PRIMARY KEY (`sensor_data_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SENSOR_DATA` ADD CONSTRAINT `SENSOR_DATA_plant_id_fkey` FOREIGN KEY (`plant_id`) REFERENCES `PLANT`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

