import { useState } from "react";
import Icon from "@/components/ui/icon";

const CONTACTS = [
  { id: "1", name: "Алиса Морозова", nick: "@alisa_moro", avatar: "🦊", online: true, mutual: 5 },
  { id: "2", name: "Артём Кот", nick: "@artem_kot", avatar: "🐱", online: false, mutual: 2 },
  { id: "3", name: "Денис Волков", nick: "@d_volkov", avatar: "🐘", online: false, mutual: 8 },
  { id: "4", name: "Катя Звёздная", nick: "@kstarr", avatar: "🌟", online: true, mutual: 3 },
  { id: "5", name: "Макс Тёмный", nick: "@max_dark", avatar: "🐺", online: true, mutual: 6 },
  { id: "6", name: "Соня Лисова", nick: "@sonya_fox", avatar: "🌸", online: true, mutual: 1 },
  { id: "7", name: "Иван Смирнов", nick: "@ivan_s", avatar: "🦁", online: false, mutual: 0 },
  { id: "8", name: "Лера Небесная", nick: "@lera_sky", avatar: "☁️", online: false, mutual: 4 },
];

export default function ContactsList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online">("all");

  const filtered = CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.nick.includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.online;
    return matchSearch && matchFilter;
  });

  const online = CONTACTS.filter(c => c.online).length;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Контакты</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {CONTACTS.length} контактов · <span style={{ color: "var(--mrcat-online)" }}>{online} онлайн</span>
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
            <Icon name="UserPlus" size={15} />
            Добавить
          </button>
        </div>

        <div className="relative mb-4">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(255,255,255,0.3)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск контакта..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:opacity-30 outline-none border focus:border-orange-500/40"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.08)" }} />
        </div>

        <div className="flex gap-2">
          {(["all", "online"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filter === f ? "rgba(255,107,26,0.15)" : "rgba(255,255,255,0.05)",
                color: filter === f ? "var(--mrcat-orange)" : "rgba(255,255,255,0.4)",
                border: `1px solid ${filter === f ? "rgba(255,107,26,0.3)" : "transparent"}`,
              }}>
              {f === "all" ? "Все" : "Онлайн"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {filtered.map(contact => (
          <div key={contact.id}
            className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all group"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,255,255,0.08)" }}>
                {contact.avatar}
              </div>
              {contact.online && (
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: "var(--mrcat-online)", borderColor: "var(--mrcat-bg)" }} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">{contact.name}</p>
              <p className="text-xs truncate" style={{ color: "rgba(255,107,26,0.7)" }}>{contact.nick}</p>
              {contact.mutual > 0 && (
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {contact.mutual} общих контакта
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                <Icon name="MessageCircle" size={15} style={{ color: "var(--mrcat-orange)" }} />
              </button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                <Icon name="Phone" size={15} style={{ color: "var(--mrcat-cyan)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
