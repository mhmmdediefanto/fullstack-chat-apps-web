import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // seed user
  await prisma.user.create({
    data: {
      username: "admin",
      email: "a@b.com",
      fullname: "Administrator",
      password: "secret123", // nanti sebaiknya di-hash
    },
  });

  // seed products
  await prisma.products.createMany({
    data: [
      { name: "Produk 1", slug: "produk-1", price: 10000, stock: 10 },
      { name: "Produk 2", slug: "produk-2", price: 20000, stock: 5 },
    ],
  });
}

main()
  .then(() => console.log("Seeding selesai!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
