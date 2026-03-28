import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ProfileScreenProps {
  user: { email: string; name: string; avatar: string };
}

const STATS = [
  { label: "Сообщений", value: "1 247" },
  { label: "Контактов", value: "42" },
  { label: "Вызовов", value: "89" },
];

export default function ProfileScreen({ user }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState("Люблю котиков и шифрование 🔐");
  const [nickname, setNickname] = useState("@" + user.name.toLowerCase().replace(/\s/g, "_"));

  return (
    <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
      {/* Cover gradient */}
      <div className="h-40 flex-shrink-0 relative"
        style={{ background: "linear-gradient(135deg, #FF6B1A22, #8B5CF622, #06B6D422)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #FF6B1A 0%, transparent 50%), radial-gradient(circle at 70% 30%, #8B5CF6 0%, transparent 50%)" }} />
      </div>

      {/* Profile card */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl border-4 mrcat-glow"
              style={{ background: "linear-gradient(135deg, #1A2030, #252B40)", borderColor: "var(--mrcat-bg)" }}>
              🐱
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center border-2"
              style={{ background: "var(--mrcat-orange)", borderColor: "var(--mrcat-bg)" }}>
              <Icon name="Camera" size={13} style={{ color: "white" }} />
            </button>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{
              background: isEditing ? "rgba(255,107,26,0.15)" : "rgba(255,255,255,0.08)",
              color: isEditing ? "var(--mrcat-orange)" : "rgba(255,255,255,0.7)",
              border: `1px solid ${isEditing ? "rgba(255,107,26,0.3)" : "rgba(255,255,255,0.1)"}`,
            }}>
            <Icon name={isEditing ? "Check" : "Edit2"} size={14} />
            {isEditing ? "Сохранить" : "Изменить"}
          </button>
        </div>

        {/* Name & Nick */}
        {isEditing ? (
          <div className="space-y-3 mb-4">
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white outline-none border focus:border-orange-500/50 text-lg font-bold"
              style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.1)" }} />
            <input value={nickname} onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none border focus:border-orange-500/50 text-sm"
              style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.1)", color: "var(--mrcat-orange)" }} />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2}
              className="w-full px-4 py-3 rounded-xl text-white outline-none border focus:border-orange-500/50 text-sm resize-none"
              style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.1)" }} />
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Rubik, sans-serif" }}>{name}</h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: "var(--mrcat-orange)" }}>{nickname}</p>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>{bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(stat => (
            <div key={stat.label} className="flex flex-col items-center py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "Rubik, sans-serif" }}>{stat.value}</span>
              <span className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Info blocks */}
        <div className="space-y-2">
          <InfoRow icon="Mail" label="Email" value={user.email} />
          <InfoRow icon="Phone" label="Телефон" value="Не указан" dimmed />
          <InfoRow icon="Globe" label="Сайт" value="Не указан" dimmed />
          <InfoRow icon="Calendar" label="В MR CAT с" value="Март 2026" />
        </div>

        {/* Security block */}
        <div className="mt-6 p-4 rounded-2xl"
          style={{ background: "rgba(255,107,26,0.06)", border: "1px solid rgba(255,107,26,0.15)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Shield" size={16} style={{ color: "var(--mrcat-orange)" }} />
            <span className="text-sm font-semibold text-white">Безопасность</span>
          </div>
          <div className="space-y-2">
            <SecurityRow label="Сквозное шифрование" enabled />
            <SecurityRow label="Двухфакторная аутентификация" enabled={false} />
            <SecurityRow label="Активные сессии" value="1 устройство" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, dimmed }: { icon: string; label: string; value: string; dimmed?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.04)" }}>
      <Icon name={icon} fallback="Info" size={16} style={{ color: "rgba(255,107,26,0.7)" }} />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
        <span className="text-sm" style={{ color: dimmed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)" }}>{value}</span>
      </div>
    </div>
  );
}

function SecurityRow({ label, enabled, value }: { label: string; enabled?: boolean; value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
      {value ? (
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{value}</span>
      ) : (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: enabled ? "rgba(46,204,113,0.15)" : "rgba(239,68,68,0.1)",
            color: enabled ? "var(--mrcat-online)" : "#EF4444",
          }}>
          {enabled ? "Включено" : "Выключено"}
        </span>
      )}
    </div>
  );
}
