import prisma from "../plugins/db";

// fungsi untuk menyimpan pesan private
const saveMessagePrivate = async (
  senderId: number,
  message: string,
  conversationId: number
) => {
  const savedMessage = await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId,
      content: message,
    },
    include: {
      sender: { select: { id: true, username: true, fullname: true } },
    },
  });

  return savedMessage;
};

// cek apakah conversation private antara dua user sudah ada
const conversationExistsPrivate = async (
  userId1: number,
  userId2: number
): Promise<boolean> => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      type: "PRIVATE",
      participants: {
        some: { userId: userId1 },
      },
      AND: {
        participants: {
          some: { userId: userId2 },
        },
      },
    },
  });
  return !!conversation;
};

// fungsi untuk membuat conversation private antara dua user
const createConversationPrivate = async (userId1: number, userId2: number) => {
  const conversation = await prisma.conversation.create({
    data: {
      type: "PRIVATE",
      participants: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
  });
  return conversation;
};

// fungsi untuk mendapatkan conversationId dari dua user yang sudah pasti ada conversationnya
const getConversationIdPrivate = async (userId1: number, userId2: number) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      type: "PRIVATE",
      participants: {
        every: {
          userId: { in: [userId1, userId2] },
        },
      },
    },
  });
  //   jika ada conversation, return idnya
  return conversation?.id!;
};

// list semua pesan private conversation
const listPrivateMessagesConversation = async (userId: number) => {
  const conversationMessages = await prisma.conversation.findMany({
    where: {
      type: "PRIVATE",
      participants: {
        some: { userId: userId }, // semua conversation yang melibatkan dia
      },
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, username: true, fullname: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // ambil pesan terakhir
        include: {
          sender: { select: { id: true, username: true, fullname: true } },
        },
      },
    },
  });

  return conversationMessages;
};

// ambil semua pesan di conversation dengan id tertentu
const messagesPrivate = async (conversationId: number) => {
  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },
    include: {
      sender: { select: { id: true, username: true, fullname: true } },
    },
  });
  return messages;
};

export {
  saveMessagePrivate,
  conversationExistsPrivate,
  createConversationPrivate,
  getConversationIdPrivate,
  listPrivateMessagesConversation,
  messagesPrivate,
};
