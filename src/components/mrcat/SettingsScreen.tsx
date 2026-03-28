import { useState } from "react";
import Icon from "@/components/ui/icon";

interface SettingsScreenProps {
  onLogout: () => void;
}

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [theme, setTheme] = useState<"dark" | "auto">("dark");

  return (
    <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
      <div className="px-6 pt-6 pb-8 max-w-xl mx-auto w-full">
        <h2 className="text-xl font-bold text-white mb-6">Настройки</h2>

        {/* Notifications */}
        <SettingsGroup title="Уведомления" icon="Bell">
          <ToggleRow label="Уведомления" desc="Показывать всплывающие уведомления" value={notifications} onChange={setNotifications} />
          <ToggleRow label="Звуки" desc="Звуки сообщений и вызовов" value={sounds} onChange={setSounds} />
        </SettingsGroup>

        {/* Privacy & Security */}
        <SettingsGroup title="Конфиденциальность" icon="Shield">
          <ToggleRow label="Двухфакторная аутентификация" desc="Дополнительная защита аккаунта" value={twoFactor} onChange={setTwoFactor} />
          <SettingsItem label="Активные сессии" desc="1 устройство" icon="Monitor" />
          <SettingsItem label="Чёрный список" desc="0 заблокированных" icon="UserX" />
        </SettingsGroup>

        {/* Media & Storage */}
        <SettingsGroup title="Медиа и хранилище" icon="HardDrive">
          <ToggleRow label="Авто-загрузка медиа" desc="Загружать фото и видео автоматически" value={autoDownload} onChange={setAutoDownload} />
          <SettingsItem label="Кэш" desc="12.4 МБ" icon="Trash2" action="Очистить" />
        </SettingsGroup>

        {/* Appearance */}
        <SettingsGroup title="Оформление" icon="Palette">
          <div className="px-4 py-3">
            <p className="text-sm text-white mb-3">Тема</p>
            <div className="flex gap-2">
              {(["dark", "auto"] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: theme === t ? "rgba(255,107,26,0.15)" : "rgba(255,255,255,0.05)",
                    color: theme === t ? "var(--mrcat-orange)" : "rgba(255,255,255,0.4)",
                    border: `1px solid ${theme === t ? "rgba(255,107,26,0.3)" : "transparent"}`,
                  }}>
                  <Icon name={t === "dark" ? "Moon" : "Sunset"} fallback="Sun" size={14} />
                  {t === "dark" ? "Тёмная" : "Авто"}
                </button>
              ))}
            </div>
          </div>
        </SettingsGroup>

        {/* About */}
        <SettingsGroup title="О приложении" icon="Info">
          <SettingsItem label="MR CAT" desc="Версия 1.0.0" icon="Cat" />
          <SettingsItem label="Лицензия" desc="Открытый протокол · E2E шифрование" icon="FileText" />
          <SettingsItem label="Связаться с поддержкой" desc="help@mrcat.app" icon="Mail" />
        </SettingsGroup>

        {/* Logout */}
        <button onClick={onLogout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.15)" }}>
            <Icon name="LogOut" size={17} style={{ color: "#EF4444" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>Выйти из аккаунта</p>
            <p className="text-xs" style={{ color: "rgba(239,68,68,0.5)" }}>Сессия будет завершена</p>
          </div>
          <Icon name="ChevronRight" size={16} style={{ color: "rgba(239,68,68,0.4)" }} />
        </button>
      </div>
    </div>
  );
}

function SettingsGroup({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Icon name={icon} fallback="Settings" size={13} style={{ color: "var(--mrcat-orange)" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,107,26,0.7)" }}>
          {title}
        </span>
      </div>
      <div className="rounded-2xl overflow-hidden divide-y"
        style={{ background: "rgba(255,255,255,0.04)", divideColor: "rgba(255,255,255,0.05)" }}>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{desc}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
        style={{ background: value ? "var(--mrcat-orange)" : "rgba(255,255,255,0.15)" }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }} />
      </button>
    </div>
  );
}

function SettingsItem({ label, desc, icon, action }: {
  label: string; desc: string; icon: string; action?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors">
      <Icon name={icon} fallback="Circle" size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
      <div className="flex-1">
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{desc}</p>
      </div>
      {action ? (
        <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: "rgba(255,107,26,0.1)", color: "var(--mrcat-orange)" }}>
          {action}
        </span>
      ) : (
        <Icon name="ChevronRight" size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
      )}
    </div>
  );
}
