import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Chat } from "./MessengerApp";

interface ChatListProps {
  chats: Chat[];
  selectedId?: string;
  onSelect: (chat: Chat) => void;
  userName: string;
}

export default function ChatList({ chats, selectedId, onSelect, userName }: ChatListProps) {
  const [search, setSearch] = useState("");

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Чаты</h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <Icon name="Edit" fallback="Pencil" size={15} style={{ color: "var(--mrcat-orange)" }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по чатам..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:opacity-30 outline-none border transition-all focus:border-orange-500/50"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.08)", fontFamily: "Golos Text, sans-serif" }}
          />
        </div>
      </div>

      {/* User greeting */}
      <div className="px-4 mb-2">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Привет, <span className="font-medium" style={{ color: "var(--mrcat-orange)" }}>{userName}</span> 👋
        </p>
      </div>

      {/* Chat items */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Icon name="Search" size={32} style={{ color: "rgba(255,255,255,0.1)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>Ничего не найдено</p>
          </div>
        ) : (
          filtered.map(chat => (
            <ChatItem key={chat.id} chat={chat} active={selectedId === chat.id} onClick={() => onSelect(chat)} />
          ))
        )}
      </div>
    </div>
  );
}

function ChatItem({ chat, active, onClick }: { chat: Chat; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-150 text-left group"
      style={{
        background: active ? "rgba(255,107,26,0.12)" : "transparent",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: active ? "rgba(255,107,26,0.2)" : "rgba(255,255,255,0.08)" }}>
          {chat.avatar}
        </div>
        {chat.online && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#111520]"
            style={{ background: "var(--mrcat-online)" }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm truncate"
            style={{ color: active ? "var(--mrcat-orange)" : "white" }}>
            {chat.name}
          </span>
          <span className="text-xs flex-shrink-0 ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            {chat.time}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
            {chat.isTyping ? <TypingIndicator /> : chat.lastMessage}
          </span>
          {chat.unread > 0 && (
            <span className="flex-shrink-0 ml-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "var(--mrcat-orange)" }}>
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1" style={{ color: "var(--mrcat-online)" }}>
      <span className="text-xs">печатает</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="typing-dot w-1 h-1 rounded-full inline-block"
            style={{ background: "var(--mrcat-online)" }} />
        ))}
      </span>
    </span>
  );
}
