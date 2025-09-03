import { getById } from "../repository/auth.repository";
import {
  addFriend,
  deleteFriend,
  getByUserIdAndContactId,
  getFriends,
} from "../repository/contact.repository";

export class ContactService {
  async addFriends(userId: number, friendId: number) {
    // cek apakah user mencoba menambahkan dirinya sendiri
    if (userId === friendId) {
      throw new Error("You cannot add yourself as a friend");
    }

    // cek apakah friendId ada di tabel user
    const user = await getById(friendId);
    if (!user) {
      throw new Error("User not found");
    }

    // cek apakah teman sudah ada
    const existingContact = await getByUserIdAndContactId(userId, friendId);
    if (existingContact) {
      throw new Error("This user is already your friend");
    }

    // Logic to add a friend
    const addContact = await addFriend(userId, friendId);

    if (!addContact) {
      throw new Error("Failed to add friend");
    }

    return { message: `Friend with ID ${friendId} added for user ${userId}` };
  }

  async deleteFriends(userId: number, friendId: number) {
    const deletedContact = await deleteFriend(userId, friendId);

    if (deletedContact.count === 0) {
      throw new Error("This user is not your friend");
    }
    return { message: `Friend with ID ${friendId} deleted for user ${userId}` };
  }

  async getFriendsAll(userId: number) {
    const friends = await getFriends(userId);

    if (!friends || friends.length === 0) {
      return [];
    }

    return friends.map((friend) => friend.contact);
  }
}
