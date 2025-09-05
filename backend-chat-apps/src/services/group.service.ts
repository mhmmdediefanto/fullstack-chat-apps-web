import {
  addMemberToGroup,
  createConversationGroup,
  findGroupByCreateUser,
  findGroupById,
  findGroupBySlug,
  findGroupBySlugAndCreatedBy,
  getGroupMessages,
  isUserInGroup,
  sendMessageToGroup,
} from "../repository/group.repository";
import { isMutualFriend } from "../repository/contact.repository";

export default class GroupService {
  public static async createGroup({
    name,
    createdBy,
    slugGroup,
  }: {
    name: string;
    createdBy: number;
    slugGroup: string;
  }) {
    // cek apakah group dengan pembuat yang sama sudah ada
    // berdasarkan nama group yang di slug
    const existingGroup = await findGroupBySlugAndCreatedBy(
      slugGroup,
      createdBy
    );

    // jika sudah ada, kembalikan error
    if (existingGroup) {
      throw new Error("Group ini sudah anda buat sebelumnya");
    }

    // jika belum ada, buat group baru
    const groupConversation = await createConversationGroup({
      type: "GROUP",
      name,
      createdBy,
      slugGroup,
    });

    return groupConversation;
  }

  public static async addMember({
    groupId,
    userId,
    createdBy,
  }: {
    groupId: number;
    userId: number;
    createdBy: number;
  }) {
    // cek apakah teman yang di tambahkan sudah menjadi teman
    const isMutualFriendExisting = await isMutualFriend(createdBy, userId);
    if (!isMutualFriendExisting) {
      throw new Error("User yang ditambahkan harus merupakan teman anda");
    }

    // cek apakah group dengan id tersebut ada
    const groupExisting = await findGroupById(groupId);
    if (!groupExisting || groupExisting.type !== "GROUP") {
      throw new Error("Group tidak ditemukan");
    }

    // cek apakah yang menambahkan member adalah admin
    const isAdmin = groupExisting.participants.find(
      (participant) =>
        participant.userId === createdBy && participant.role === "ADMIN"
    );
    if (!isAdmin) {
      throw new Error("Hanya admin yang dapat menambahkan member ke group ini");
    }

    // tambahkan member ke group
    const group = await addMemberToGroup({ groupId, userId });
    return group;
  }

  //   list group yang dibuat oleh user tertentu
  public static async listMyGroups({ createdBy }: { createdBy: number }) {
    const groups = await findGroupByCreateUser({ createdBy });
    return groups;
  }

  //   send message ke group
  public static async sendMessageGroup({
    groupId,
    message,
    senderId,
  }: {
    groupId: number;
    message: string;
    senderId: number;
  }) {
    // cek apakah group dengan id tersebut ada
    const groupExisting = await findGroupById(groupId);
    if (!groupExisting || groupExisting.type !== "GROUP") {
      throw new Error("Group tidak ditemukan");
    }

    // cek apakah sender adalah member dari group
    const isMember = await isUserInGroup({ groupId, userId: senderId });
    if (!isMember) {
      throw new Error("Anda bukan member dari group ini");
    }

    // jika iya, buat message baru
    const messageResult = await sendMessageToGroup({
      groupId,
      message,
      senderId,
    });

    return messageResult;
  }

  //get messages dari group
  public static async getMessagesGroup({
    slugGroup,
    userId, // kirim dari controller (req.user.id)
  }: {
    slugGroup: string;
    userId: number;
  }) {
    // cek apakah group dengan slug tersebut ada
    const groupExisting = await findGroupBySlug(slugGroup);
    if (!groupExisting || groupExisting.type !== "GROUP") {
      throw new Error("Group tidak ditemukan");
    }

    // ambil idnya
    const groupId = groupExisting.id;
    const messages = await getGroupMessages({ idGroup: groupId });

    const result = {
      group: {
        id: groupId,
        name: groupExisting.name,
        slug: groupExisting.slug_group,
      },
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        sender: {
          id: msg.sender.id,
          username: msg.sender.username,
          fullname: msg.sender.fullname,
        },
        isMine: msg.senderId === userId,
      })),
    };

    return result;
  }
}
