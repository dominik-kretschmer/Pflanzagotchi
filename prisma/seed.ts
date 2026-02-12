import { prisma } from "../lib/prisma";

async function main() {
  // 1. Ensure a default user exists
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      xp: 0,
      level: 1,
    },
  });
  console.log("User ensured:", user);

  // 2. Seed Achievements
  const achievements = [
    {
      name: "Grüner Daumen",
      description: "Lege deine erste Pflanze an.",
      xp_reward: 100,
      icon: "mdi-sprout",
    },
    {
      name: "Botaniker",
      description: "Habe 5 verschiedene Pflanzen in deiner Sammlung.",
      xp_reward: 500,
      icon: "mdi-library-leaf",
    },
    {
      name: "Serien-Gießer",
      description: "Gieße deine Pflanzen regelmäßig.",
      xp_reward: 200,
      icon: "mdi-water-pump",
    },
    {
      name: "Daten-Experte",
      description: "Prüfe die Sensorwerte deiner Pflanzen.",
      xp_reward: 150,
      icon: "mdi-chart-timeline-variant",
    },
    {
      name: "Meister-Gärtner",
      description: "Erreiche Level 5.",
      xp_reward: 1000,
      icon: "mdi-medal",
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievements.indexOf(ach) + 1 }, // Using fixed IDs for simplicity in seed
      update: ach,
      create: {
        id: achievements.indexOf(ach) + 1,
        ...ach,
      },
    });
  }
  console.log("Achievements seeded.");

  // 3. Seed Daily Quests
  const dailyQuests = [
    {
      name: "Morgentau",
      description: "Gieße eine beliebige Pflanze.",
      xp_reward: 50,
      type: "WATER",
      target: 1,
    },
    {
      name: "Vitaminkur",
      description: "Dünge eine deiner Pflanzen.",
      xp_reward: 50,
      type: "FERTILIZE",
      target: 1,
    },
    {
      name: "Kontrollbesuch",
      description: "Checke die Sensordaten einer Pflanze.",
      xp_reward: 30,
      type: "SENSORS",
      target: 1,
    },
    {
      name: "Schönheitspflege",
      description: "Schneide eine Pflanze zurück.",
      xp_reward: 70,
      type: "PRUNE",
      target: 1,
    },
  ];

  for (const quest of dailyQuests) {
    const q = await prisma.dailyQuest.upsert({
      where: { id: dailyQuests.indexOf(quest) + 1 },
      update: quest,
      create: {
        id: dailyQuests.indexOf(quest) + 1,
        ...quest,
      },
    });

    // Link to user if not already linked
    await prisma.userQuest.upsert({
      where: {
        id: q.id, // Using same ID for simplicity in this single-user app
      },
      update: {},
      create: {
        id: q.id,
        userId: user.id,
        questId: q.id,
        currentValue: 0,
        isCompleted: false,
      },
    });
  }
  console.log("Daily Quests seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect(); // PrismaPg might not need this explicitly in this context but good practice
  });
