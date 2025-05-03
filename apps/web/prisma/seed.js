const { PrismaClient } = require("@prisma/client");
const { categories } = require("./data.js");

const prisma = new PrismaClient();

const load = async () => {
  try {
    console.log("Seeding database...");
    const transaction = categories.map((category) => {
      return prisma.category.create({
        data: {
          name: category.name,
        },
      });
    });

    await prisma.$transaction(transaction);
    console.log("Seeding complete!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
