"use client";

import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("@/components/ChatBot"), {
  ssr: false,
  loading: () => null,
});

export default function ChatBotLoader({ project = "zevtabs", color }: { project?: string; color?: string }) {
  if (process.env.NEXT_PUBLIC_DISABLE_CHAT === "1") {
    return null;
  }
  return <ChatBot project={project} color={color} />;
}
