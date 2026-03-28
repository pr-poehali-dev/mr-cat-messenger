import { useState } from "react";
import Icon from "@/components/ui/icon";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ContactsList from "./ContactsList";
import CallsScreen from "./CallsScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";

interface MessengerAppProps {
  user: { email: string; name: string; avatar: string };
  onLogout: () => void;
}

type Tab = "chats" | "contacts" | "calls" | "profile" | "settings";

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
}

const DEMO_CHATS: Chat[] = [
  { id: "1", name: "Алиса Морозова", lastMessage: "Привет! Как дела?", time: "14:32", unread: 3, online: true, avatar: "🦊" },
  { id: "2", name: "Макс Тёмный", lastMessage: "Встреча завтра в 10:00", time: "13:15", unread: 0, online: false, avatar: "🐺" },
  { id: "3", name: "Катя Звёздная", lastMessage: "Отправила файлы 📎", time: "11:48", unread: 1, online: true, avatar: "🌟" },
  { id: "4", name: "Группа: Команда", lastMessage: "Дима: Всё готово!", time: "10:20", unread: 7, online: false, avatar: "🚀" },
  { id: "5", name: "Денис Волков", lastMessage: "👍", time: "вчера", unread: 0, online: false, avatar: "🐘" },
  { id: "6", name: "Соня Лисова", lastMessage: "Спасибо большое!", time: "вчера", unread: 0, online: true, avatar: "🌸" },
  { id: "7", name: "Артём Кот", lastMessage: "Смотрел новый фильм?", time: "пн", unread: 0, online: false, avatar: "🐱" },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "1", text: "Привет! Давно не виделись 👋", time: "14:28", isOwn: false, status: "read" },
    { id: "2", text: "Привет! Всё отлично, спасибо! А у тебя?", time: "14:29", isOwn: true, status: "read" },
    { id: "3", text: "Тоже хорошо! Работаю над новым проектом 🚀", time: "14:30", isOwn: false, status: "read" },
    { id: "4", text: "О, интересно! Расскажешь подробнее?", time: "14:31", isOwn: true, status: "delivered" },
    { id: "5", text: "Привет! Как дела?", time: "14:32", isOwn: false, status: "read" },
  ],
  "2": [
    { id: "1", text: "Завтра встреча в офисе", time: "13:10", isOwn: false, status: "read" },
    { id: "2", text: "Хорошо, буду в 10:00", time: "13:12", isOwn: true, status: "read" },
    { id: "3", text: "Встреча завтра в 10:00", time: "13:15", isOwn: false, status: "read" },
  ],
};

export default function MessengerApp({ user, onLogout }: MessengerAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(DEMO_MESSAGES);
  const [chats] = useState<Chat[]>(DEMO_CHATS);

  const sendMessage = (chatId: string, text: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      status: "sent",
    };
    setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), newMsg] }));
  };

  const navItems: { id: Tab; icon: string; label: string; badge?: number }[] = [
    { id: "chats", icon: "MessageCircle", label: "Чаты", badge: chats.reduce((s, c) => s + c.unread, 0) },
    { id: "contacts", icon: "Users", label: "Контакты" },
    { id: "calls", icon: "Phone", label: "Вызовы" },
    { id: "profile", icon: "User", label: "Профиль" },
    { id: "settings", icon: "Settings", label: "Настройки" },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--mrcat-bg)", fontFamily: "Golos Text, sans-serif" }}>

      {/* Left sidebar — navigation */}
      <div className="flex flex-col w-[72px] py-4 items-center gap-1 flex-shrink-0"
        style={{ background: "var(--mrcat-sidebar)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Logo */}
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 mrcat-glow-sm cursor-pointer"
          style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
          <span className="text-xl">🐱</span>
        </div>

        {navItems.map(item => (
          <NavBtn key={item.id} item={item} active={activeTab === item.id}
            onClick={() => { setActiveTab(item.id); if (item.id !== "chats") setSelectedChat(null); }} />
        ))}

        <div className="flex-1" />

        <button onClick={onLogout} className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:bg-red-500/20 group"
          title="Выйти">
          <Icon name="LogOut" size={18} className="group-hover:text-red-400" style={{ color: "rgba(255,255,255,0.3)" }} />
        </button>
      </div>

      {/* Chat list panel */}
      {(activeTab === "chats" || (activeTab === "chats" && !selectedChat)) && (
        <div className="w-[320px] flex-shrink-0 flex flex-col"
          style={{ background: "var(--mrcat-panel)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <ChatList
            chats={chats}
            selectedId={selectedChat?.id}
            onSelect={setSelectedChat}
            userName={user.name}
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeTab === "chats" && selectedChat && (
          <ChatWindow
            chat={selectedChat}
            messages={messages[selectedChat.id] || []}
            onSend={(text) => sendMessage(selectedChat.id, text)}
            onBack={() => setSelectedChat(null)}
          />
        )}
        {activeTab === "chats" && !selectedChat && (
          <EmptyState />
        )}
        {activeTab === "contacts" && <ContactsList />}
        {activeTab === "calls" && <CallsScreen />}
        {activeTab === "profile" && <ProfileScreen user={user} />}
        {activeTab === "settings" && <SettingsScreen onLogout={onLogout} />}
      </div>
    </div>
  );
}

function NavBtn({ item, active, onClick }: {
  item: { id: string; icon: string; label: string; badge?: number };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 group"
      style={{
        background: active ? "rgba(255,107,26,0.15)" : "transparent",
      }}
      title={item.label}>
      <Icon name={item.icon} fallback="Circle" size={20}
        style={{ color: active ? "var(--mrcat-orange)" : "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
        className="group-hover:!text-orange-400"
      />
      {item.badge ? (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: "var(--mrcat-orange)" }}>
          {item.badge > 9 ? "9+" : item.badge}
        </span>
      ) : null}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
        style={{ background: "rgba(255,107,26,0.08)" }}>
        🐱
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-white/60">Выберите чат</p>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
          или начните новую беседу
        </p>
      </div>
    </div>
  );
}
