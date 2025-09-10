import prisma from "../plugins/db";

// type: "GROUP" | "PRIVATE"
export async function createConversationGroup({
  type,
  name,
  createdBy,
  slugGroup,
}: {
  type: "GROUP" | "PRIVATE";
  name: string;
  createdBy: number;
  slugGroup: string;
}) {
  const groupConversation = await prisma.conversation.create({
    data: {
      type: type,
      name: name,
      createdBy: createdBy,
      slug_group: slugGroup,
      participants: {
        create: [{ userId: createdBy, role: "ADMIN" }],
      },
    },
    include: {
      participants: { select: { userId: true, role: true } },
    },
  });

  return groupConversation;
}

// cari group by id
export async function findGroupById(idGroup: number) {
  return prisma.conversation.findUnique({
    where: {
      id: idGroup,
    },
    include: {
      participants: { select: { userId: true, role: true } },
    },
  });
}

// cari group by slugGroup
export async function findGroupBySlug(slugGroup: string) {
  return prisma.conversation.findUnique({
    where: { slug_group: slugGroup },
    include: {
      participants: { select: { userId: true, role: true } },
    },
  });
}

// cek group by slug dan createdBy apakah sudah ada
export async function findGroupBySlugAndCreatedBy(
  slugGroup: string,
  createdBy: number
) {
  return prisma.conversation.findFirst({
    where: { slug_group: slugGroup, createdBy: createdBy },
    include: {
      participants: { select: { userId: true, role: true } },
    },
  });
}

// find group by createUser
export async function findListGroup({ userId }: { userId: number }) {
  return prisma.conversation.findMany({
    where: {
      participants: { some: { userId: userId } },
      type: "GROUP",
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          fullname: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullname: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// add member group
export async function addMemberToGroup({
  groupId,
  userId,
}: {
  groupId: number;
  userId: number;
}) {
  return prisma.conversationParticipant.create({
    data: {
      conversationId: groupId,
      userId: userId,
      role: "MEMBER", // default role MEMBER
    },
  });
}

export async function isUserInGroup({
  groupId,
  userId,
}: {
  groupId: number;
  userId: number;
}) {
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId: groupId, userId: userId },
  });
  return !!participant;
}

// send message ke group
export async function sendMessageToGroup({
  groupId,
  message,
  senderId,
}: {
  groupId: number;
  message: string;
  senderId: number;
}) {
  return prisma.message.create({
    data: {
      conversationId: groupId,
      senderId: senderId,
      content: message,
    },
  });
}

// get messages group
export async function getGroupMessages({ idGroup }: { idGroup: number }) {
  const message = await prisma.message.findMany({
    where: {
      conversationId: idGroup,
    },
    include: {
      sender: { select: { id: true, username: true, fullname: true } },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return message;
}

// update user member to admin
export async function updateMemberToAdmin({
  userId,
  groupId,
}: {
  userId: number;
  groupId: number;
}) {
  return prisma.conversationParticipant.updateMany({
    where: { conversationId: groupId, userId: userId },
    data: { role: "ADMIN" },
  });
}

// kik member
export async function kickMember({
  groupId,
  userId,
}: {
  groupId: number;
  userId: number;
}) {
  return prisma.conversationParticipant.deleteMany({
    where: { conversationId: groupId, userId: userId },
  });
}

// delete Group
export async function deleteGroupById({ groupId }: { groupId: number }) {
  return prisma.conversation.delete({
    where: { id: groupId },
  });
}
