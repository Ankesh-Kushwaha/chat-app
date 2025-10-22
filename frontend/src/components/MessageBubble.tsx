import React from "react";

export const MessageBubble = ({
who,
text,
accent = false,
}: {
who: string;
text: string;
accent?: boolean;
}) => (

  <div className={`flex ${accent ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-xs ${
        accent ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
      } px-4 py-2 rounded-xl border`}
    >
      <div className="text-xs font-semibold">{who}</div>
      <div className="text-sm mt-0.5">{text}</div>
    </div>
  </div>
);
