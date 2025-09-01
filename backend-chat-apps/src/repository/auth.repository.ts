import prisma from "../plugins/db";

export async function register(params: any) {
  const user = await prisma.user.create({
    data: {
      username: params.username,
      email: params.email,
      fullname: params.fullname,
      password: params.password,
      createdAt: new Date(),
    },
  });
  return user;
}

export async function getByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}
