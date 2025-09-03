import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/helpers/hashingPassword";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      username: "mhmmdedfan",
      email: "ediefanto778@gmail.com",
      fullname: "Muhammad Efanto",
      password: "password123",
    },
    {
      username: "sitiarifah456",
      email: "sitiarifah456@gmail.com",
      fullname: "Siti Arifah",
      password: "password123",
    },
    {
      username: "rizkyputra789",
      email: "rizkyputra789@gmail.com",
      fullname: "Rizky Putra",
      password: "password123",
    },
    {
      username: "auliasaputra234",
      email: "auliasaputra234@gmail.com",
      fullname: "Aulia Saputra",
      password: "password123",
    },
    {
      username: "dewirahma567",
      email: "dewirahma567@gmail.com",
      fullname: "Dewi Rahma",
      password: "password123",
    },
    {
      username: "fadlisyah890",
      email: "fadlisyah890@gmail.com",
      fullname: "Fadli Syah",
      password: "password123",
    },
    {
      username: "ahmadkurnia123",
      email: "ahmadkurnia123@gmail.com",
      fullname: "Ahmad Kurnia",
      password: "password123",
    },
    {
      username: "nadiahidayat456",
      email: "nadiahidayat456@gmail.com",
      fullname: "Nadia Hidayat",
      password: "password123",
    },
    {
      username: "putrasetiawan789",
      email: "putrasetiawan789@gmail.com",
      fullname: "Putra Setiawan",
      password: "password123",
    },
    {
      username: "efantorachma234",
      email: "efantorachma234@gmail.com",
      fullname: "Efanto Rachma",
      password: "password123",
    },
    {
      username: "budiakbar567",
      email: "budiakbar567@gmail.com",
      fullname: "Budi Akbar",
      password: "password123",
    },
    {
      username: "salsawijaya890",
      email: "salsawijaya890@gmail.com",
      fullname: "Salsa Wijaya",
      password: "password123",
    },
  ];

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        password: hashedPassword,
      },
    });
  }

  console.log(`${users.length} users berhasil dibuat!`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
