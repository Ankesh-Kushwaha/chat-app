export type User = {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
};

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: "pending" | "accepted" | "declined";
}
