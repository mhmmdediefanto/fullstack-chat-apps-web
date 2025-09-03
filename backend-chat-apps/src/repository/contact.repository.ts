import prisma from "../plugins/db";

export async function addFriend(userId: number, contactId: number) {
  return await prisma.contact.create({
    data: {
      userId: userId,
      contactId: contactId,
    },
  });
}

export async function getByUserIdAndContactId(
  userId: number,
  contactId: number
) {
  return await prisma.contact.findFirst({
    where: {
      userId: userId,
      contactId: contactId,
    },
  });
}

export async function deleteFriend(userId: number, friendId: number) {
  return await prisma.contact.deleteMany({
    where: {
      userId: userId,
      contactId: friendId,
    },
  });
}

export async function getFriends(userId: number) {
  return await prisma.contact.findMany({
    where: {
      userId: userId,
    },
    include: { contact: { select: { id: true, username: true, fullname: true } } },
  });
}

