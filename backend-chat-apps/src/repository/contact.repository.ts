import prisma from "../plugins/db";

export async function addFriend(
  userId: number,
  contactId: number,
  status: "PENDING" | "ACCEPTED"
) {
  return await prisma.contact.create({
    data: {
      userId: userId,
      contactId: contactId,
      status: status,
    },
  });
}

// mengupdate status teman (contact) dari user
export async function updateFriendStatus({
  userId,
  contactId,
  status,
}: {
  userId: number;
  contactId: number;
  status: "PENDING" | "ACCEPTED";
}) {
  return await prisma.contact.updateMany({
    where: {
      userId: userId,
      contactId: contactId,
    },
    data: {
      status: status,
    },
  });
}

// mengambil data contact berdasarkan userId dan contactId
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


// menghapus teman (contact) dari user
export async function deleteFriend(userId: number, friendId: number) {
  return await prisma.contact.deleteMany({
    where: {
      userId: userId,
      contactId: friendId,
    },
  });
}

// mengambil list teman (contact) dari user
export async function getFriends(userId: number, status: "PENDING" | "ACCEPTED" = "ACCEPTED") {
  return await prisma.contact.findMany({
    where: {
      userId: userId,
      status: "ACCEPTED",
    },
    include: {
      contact: { select: { id: true, username: true, fullname: true } },
    },
  });
}

// mengambil list request teman yang masuk
export async function getRequestFriends(userId: number) {
  return await prisma.contact.findMany({
    where: {
      contactId: userId,
      status: "PENDING",
    },
    include: {
      user: { select: { id: true, username: true, fullname: true } },
    },
  });
}

// cek apakah dua user adalah teman (mutual friend)
export async function isMutualFriend(userId: number, friendId: number) {
  const following = await prisma.contact.findFirst({
    where: { userId, contactId: friendId },
  });
  const follower = await prisma.contact.findFirst({
    where: { userId: friendId, contactId: userId },
  });
  return !!(following && follower);
}
