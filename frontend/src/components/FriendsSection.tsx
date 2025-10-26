import React from "react";

interface FriendsSectionProps {
  title: string;
  children: React.ReactNode;
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-100 mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

export default FriendsSection;
