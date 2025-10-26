export interface User {
  id: string;
  name: string;
  bio: string;
  avatar: string;
}

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: "pending" | "accepted" | "declined";
}
