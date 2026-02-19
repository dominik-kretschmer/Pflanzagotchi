import { prisma } from "./lib/prisma";
async function main() {
  await prisma.plant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      custom_name: "Test Plant",
      name: "Test Plant",
      type: "Test",
      location: "Indoor",
      date_planted: new Date(),
      last_pruning: new Date(),
      last_water: new Date(),
      last_fertilized: new Date(),
      gen_data: {},
      botanical_name: "Test Botanical",
      pref_sun: 50,
      pref_air_humidity: 50,
      pref_soil_humidity: 50,
      userId: 1,
    },
  });
  console.log("Plant created/ensured");
}
main();
