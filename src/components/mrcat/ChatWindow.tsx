import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import type { Chat, Message } from "./MessengerApp";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSend: (text: string) => void;
  onBack: () => void;
}

export default function ChatWindow({ chat, messages, onSend, onBack }: ChatWindowProps) {
  const [text, setText] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(22,27,38,0.95)" }}>
        <button onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors mr-1">
          <Icon name="ChevronLeft" size={20} style={{ color: "rgba(255,255,255,0.5)" }} />
        </button>

        <div className="relative">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(255,107,26,0.15)" }}>
            {chat.avatar}
          </div>
          {chat.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
              style={{ background: "var(--mrcat-online)", borderColor: "var(--mrcat-panel)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{chat.name}</p>
          <p className="text-xs" style={{ color: chat.online ? "var(--mrcat-online)" : "rgba(255,255,255,0.3)" }}>
            {chat.online ? "в сети" : "не в сети"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button onClick={() => setIsCallActive(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110">
            <Icon name="Phone" size={18} style={{ color: "var(--mrcat-orange)" }} />
          </button>
          <button onClick={() => setIsCallActive(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110">
            <Icon name="Video" size={18} style={{ color: "var(--mrcat-cyan)" }} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <Icon name="MoreVertical" size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {/* Date separator */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <span className="text-xs px-3 py-1 rounded-full" style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)" }}>
            Сегодня
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "rgba(255,107,26,0.08)" }}>
              {chat.avatar}
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Начните общение с {chat.name}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={msg.id} message={msg} showAvatar={
              !msg.isOwn && (index === 0 || messages[index - 1].isOwn)
            } avatar={chat.avatar} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(22,27,38,0.95)" }}>
        <div className="flex items-end gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0 mb-0.5">
            <Icon name="Paperclip" size={18} style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Сообщение..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder:opacity-30 outline-none resize-none transition-all border focus:border-orange-500/40"
              style={{
                background: "rgba(255,255,255,0.07)",
                borderColor: "rgba(255,255,255,0.08)",
                maxHeight: "120px",
                fontFamily: "Golos Text, sans-serif",
                lineHeight: "1.5",
              }}
            />
          </div>

          <button onClick={handleSend}
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 mb-0.5"
            style={{ background: text.trim() ? "linear-gradient(135deg, #FF6B1A, #FF4500)" : "rgba(255,255,255,0.08)" }}>
            <Icon name="Send" size={17} style={{ color: text.trim() ? "white" : "rgba(255,255,255,0.3)", transform: "translateX(1px)" }} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
          🔒 Сообщения защищены сквозным шифрованием
        </p>
      </div>

      {/* Call overlay */}
      {isCallActive && (
        <CallOverlay chat={chat} onEnd={() => setIsCallActive(false)} />
      )}
    </div>
  );
}

function MessageBubble({ message, showAvatar, avatar }: { message: Message; showAvatar: boolean; avatar: string }) {
  return (
    <div className={`flex items-end gap-2 ${message.isOwn ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
      {!message.isOwn && (
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-base flex-shrink-0 mb-0.5"
          style={{ background: showAvatar ? "rgba(255,107,26,0.15)" : "transparent", opacity: showAvatar ? 1 : 0 }}>
          {showAvatar ? avatar : ""}
        </div>
      )}

      <div className={`max-w-[65%] ${message.isOwn ? "msg-bubble-out" : "msg-bubble-in"} px-4 py-2.5`}>
        <p className="text-sm text-white leading-relaxed" style={{ fontFamily: "Golos Text, sans-serif" }}>
          {message.text}
        </p>
        <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px]" style={{ color: message.isOwn ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}>
            {message.time}
          </span>
          {message.isOwn && (
            <Icon name={message.status === "read" ? "CheckCheck" : "Check"} size={12}
              style={{ color: message.status === "read" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)" }} />
          )}
        </div>
      </div>
    </div>
  );
}

function CallOverlay({ chat, onEnd }: { chat: Chat; onEnd: () => void }) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-fade-in"
      style={{ background: "linear-gradient(180deg, #0E1117 0%, #1A0A00 50%, #0E1117 100%)" }}>

      {/* Animated rings */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: "radial-gradient(circle, #FF6B1A, transparent)", transform: "scale(1.5)" }} />
        <div className="absolute inset-0 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FF6B1A, transparent)", transform: "scale(2)", animation: "callPulse 2s ease-in-out infinite" }} />

        <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl relative z-10 call-btn-pulse"
          style={{ background: "linear-gradient(135deg, rgba(255,107,26,0.3), rgba(255,69,0,0.2))", border: "2px solid rgba(255,107,26,0.3)" }}>
          {chat.avatar}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Rubik, sans-serif" }}>
        {chat.name}
      </h2>
      <p className="text-lg font-mono mb-12" style={{ color: "var(--mrcat-orange)" }}>
        {formatDuration(duration)}
      </p>

      <div className="flex items-center gap-5">
        <CallActionBtn icon={isMuted ? "MicOff" : "Mic"} label={isMuted ? "Вкл. микро" : "Выкл. микро"}
          active={isMuted} onClick={() => setIsMuted(!isMuted)} color="#8B5CF6" />
        <button onClick={onEnd}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}>
          <Icon name="PhoneOff" size={26} style={{ color: "white" }} />
        </button>
        <CallActionBtn icon={isSpeaker ? "Volume2" : "VolumeX"} label={isSpeaker ? "Динамик" : "Тихо"}
          active={!isSpeaker} onClick={() => setIsSpeaker(!isSpeaker)} color="#06B6D4" />
      </div>

      <p className="mt-8 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
        🔒 Звонок зашифрован E2E
      </p>
    </div>
  );
}

function CallActionBtn({ icon, label, active, onClick, color }: {
  icon: string; label: string; active: boolean; onClick: () => void; color: string;
}) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-2 transition-all hover:scale-110">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
        style={{ background: active ? `${color}22` : "rgba(255,255,255,0.08)" }}>
        <Icon name={icon} fallback="Circle" size={20} style={{ color: active ? color : "rgba(255,255,255,0.6)" }} />
      </div>
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
    </button>
  );
}
