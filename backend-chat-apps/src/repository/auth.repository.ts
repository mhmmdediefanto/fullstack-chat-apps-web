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

export async function getByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

export async function getById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullname: true,
    },
  });

  return user;
}

export async function findByUsernameOrEmail(identifier: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });

  return user;
}

export async function saveRefreshToken(id: number, token: string) {
  return prisma.user.update({
    where: {
      id: id,
    },
    data: {
      refresh_token: token,
    },
  });
}

export async function findByRefreshToken(token: string) {
  return prisma.user.findFirst({ where: { refresh_token: token } });
}

export async function deleteRefreshToken(refresh_token: string) {
  return prisma.user.updateMany({
    where: { refresh_token: refresh_token },
    data: { refresh_token: null },
  });
}
