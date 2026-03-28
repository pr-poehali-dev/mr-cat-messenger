import { useState } from "react";
import Icon from "@/components/ui/icon";

const CALLS = [
  { id: "1", name: "Алиса Морозова", avatar: "🦊", type: "in", status: "missed", time: "Сегодня, 14:30", duration: "" },
  { id: "2", name: "Макс Тёмный", avatar: "🐺", type: "out", status: "completed", time: "Сегодня, 11:15", duration: "5:42" },
  { id: "3", name: "Катя Звёздная", avatar: "🌟", type: "in", status: "completed", time: "Вчера, 20:00", duration: "12:08" },
  { id: "4", name: "Артём Кот", avatar: "🐱", type: "out", status: "missed", time: "Вчера, 15:30", duration: "" },
  { id: "5", name: "Соня Лисова", avatar: "🌸", type: "in", status: "completed", time: "Пн, 10:20", duration: "3:15" },
  { id: "6", name: "Денис Волков", avatar: "🐘", type: "video", status: "completed", time: "Вс, 19:45", duration: "28:50" },
];

export default function CallsScreen() {
  const [activeCall, setActiveCall] = useState<(typeof CALLS)[0] | null>(null);
  const [filter, setFilter] = useState<"all" | "missed">("all");

  const filtered = CALLS.filter(c => filter === "all" || c.status === "missed");

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Вызовы</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {CALLS.filter(c => c.status === "missed").length} пропущенных
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
            <Icon name="Phone" size={15} />
            Новый вызов
          </button>
        </div>

        <div className="flex gap-2">
          {(["all", "missed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filter === f ? "rgba(255,107,26,0.15)" : "rgba(255,255,255,0.05)",
                color: filter === f ? "var(--mrcat-orange)" : "rgba(255,255,255,0.4)",
                border: `1px solid ${filter === f ? "rgba(255,107,26,0.3)" : "transparent"}`,
              }}>
              {f === "all" ? "Все" : "Пропущенные"}
            </button>
          ))}
        </div>
      </div>

      {/* Call list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {filtered.map(call => (
          <div key={call.id}
            className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all group"
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>

            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.08)" }}>
              {call.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">{call.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon
                  name={call.type === "video" ? "Video" : call.type === "out" ? "PhoneOutgoing" : "PhoneIncoming"}
                  fallback="Phone"
                  size={12}
                  style={{ color: call.status === "missed" ? "#EF4444" : "var(--mrcat-online)" }}
                />
                <span className="text-xs" style={{ color: call.status === "missed" ? "#EF4444" : "rgba(255,255,255,0.35)" }}>
                  {call.status === "missed" ? "Пропущен" : call.duration}
                </span>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>· {call.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setActiveCall(call)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                <Icon name="Phone" size={16} style={{ color: "var(--mrcat-orange)" }} />
              </button>
              {call.type === "video" && (
                <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Icon name="Video" size={16} style={{ color: "var(--mrcat-cyan)" }} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active call modal */}
      {activeCall && (
        <div className="absolute inset-0 flex items-center justify-center z-50 animate-fade-in"
          style={{ background: "rgba(14,17,23,0.96)", backdropFilter: "blur(20px)" }}>
          <div className="flex flex-col items-center gap-6 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping opacity-15"
                style={{ background: "radial-gradient(circle, #FF6B1A, transparent)", transform: "scale(1.8)" }} />
              <div className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl"
                style={{ background: "rgba(255,107,26,0.15)", border: "2px solid rgba(255,107,26,0.3)" }}>
                {activeCall.avatar}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{activeCall.name}</h3>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Вызов...</p>
            </div>
            <div className="flex items-center gap-6">
              <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <Icon name="VideoOff" size={22} style={{ color: "rgba(255,255,255,0.6)" }} />
              </button>
              <button onClick={() => setActiveCall(null)}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}>
                <Icon name="PhoneOff" size={26} style={{ color: "white" }} />
              </button>
              <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <Icon name="Volume2" size={22} style={{ color: "rgba(255,255,255,0.6)" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
