import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthScreenProps {
  onLogin: (email: string, name: string) => void;
}

type AuthStep = "welcome" | "email" | "code" | "profile";

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>("welcome");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSendCode = () => {
    if (!email.includes("@")) {
      triggerShake();
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("code");
    }, 1200);
  };

  const handleVerifyCode = () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      triggerShake();
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("profile");
    }, 1000);
  };

  const handleComplete = () => {
    if (!name.trim()) {
      triggerShake();
      return;
    }
    onLogin(email, name.trim());
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--mrcat-bg)" }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #FF6B1A, transparent)", filter: "blur(60px)", animation: "callPulse 4s ease-in-out infinite" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)", filter: "blur(80px)" }} />
        <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent)", filter: "blur(40px)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,107,26,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className={`relative z-10 w-full max-w-md mx-4 animate-slide-up ${shake ? "animate-[shake_0.5s_ease]" : ""}`}>

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-4 mrcat-glow animate-pulse-ring"
            style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
            <span className="text-5xl">🐱</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white text-glow" style={{ fontFamily: "Rubik, sans-serif" }}>
            MR CAT
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Защищённый мессенджер нового поколения
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border p-8 animate-fade-in"
          style={{ background: "var(--mrcat-panel)", borderColor: "rgba(255,107,26,0.15)" }}>

          {/* WELCOME */}
          {step === "welcome" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center mb-2">Добро пожаловать</h2>
              <p className="text-center text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                Войдите или создайте аккаунт — это займёт меньше минуты
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FeaturePill icon="Lock" text="E2E шифрование" />
                <FeaturePill icon="Phone" text="Бесплатные звонки" />
                <FeaturePill icon="MessageCircle" text="Без рекламы" />
                <FeaturePill icon="Zap" text="Молниеносно" />
              </div>
              <button onClick={() => setStep("email")} className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mrcat-glow"
                style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
                Начать →
              </button>
            </div>
          )}

          {/* EMAIL */}
          {step === "email" && (
            <div className="space-y-5">
              <button onClick={() => setStep("welcome")} className="flex items-center gap-1 text-sm mb-2 hover:opacity-80 transition-opacity"
                style={{ color: "var(--mrcat-orange)" }}>
                <Icon name="ChevronLeft" size={16} /> Назад
              </button>
              <h2 className="text-2xl font-bold text-white">Введите email</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Мы отправим код подтверждения на вашу почту
              </p>
              <div className="relative">
                <Icon name="Mail" size={18} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder:opacity-30 outline-none transition-all border focus:border-orange-500"
                  style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", fontFamily: "Golos Text, sans-serif" }}
                  autoFocus
                />
              </div>
              <button onClick={handleSendCode} disabled={isLoading}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
                {isLoading ? <LoadingDots /> : "Отправить код"}
              </button>
            </div>
          )}

          {/* CODE */}
          {step === "code" && (
            <div className="space-y-5">
              <button onClick={() => setStep("email")} className="flex items-center gap-1 text-sm mb-2 hover:opacity-80 transition-opacity"
                style={{ color: "var(--mrcat-orange)" }}>
                <Icon name="ChevronLeft" size={16} /> Назад
              </button>
              <h2 className="text-2xl font-bold text-white">Введите код</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Код отправлен на <span className="text-white font-medium">{email}</span>
              </p>

              <div className="flex gap-2 justify-between">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value.replace(/\D/, ""))}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-white rounded-xl outline-none transition-all border-2 focus:border-orange-500"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: digit ? "var(--mrcat-orange)" : "rgba(255,255,255,0.1)",
                      fontFamily: "Rubik, sans-serif"
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button onClick={handleVerifyCode} disabled={isLoading}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
                {isLoading ? <LoadingDots /> : "Подтвердить"}
              </button>
              <button className="w-full text-sm text-center hover:opacity-80 transition-opacity py-2"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                Отправить повторно через 59 сек
              </button>
            </div>
          )}

          {/* PROFILE */}
          {step === "profile" && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white">Ваш профиль</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Выберите имя и никнейм для MR CAT
              </p>

              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl cursor-pointer hover:scale-105 transition-transform border-2 border-dashed"
                  style={{ background: "rgba(255,107,26,0.1)", borderColor: "rgba(255,107,26,0.3)" }}>
                  🐱
                </div>
                <button className="text-xs font-medium" style={{ color: "var(--mrcat-orange)" }}>
                  Загрузить аватарку
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Icon name="User" size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-white placeholder:opacity-30 outline-none transition-all border focus:border-orange-500"
                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
                    autoFocus />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold"
                    style={{ color: "rgba(255,107,26,0.6)" }}>@</span>
                  <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    placeholder="никнейм"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-white placeholder:opacity-30 outline-none transition-all border focus:border-orange-500"
                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }} />
                </div>
              </div>

              <button onClick={handleComplete}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mrcat-glow"
                style={{ background: "linear-gradient(135deg, #FF6B1A, #FF4500)" }}>
                Войти в MR CAT 🚀
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          Сквозное шифрование E2E · Без рекламы · Open Protocol
        </p>
      </div>
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
      style={{ background: "rgba(255,107,26,0.08)", border: "1px solid rgba(255,107,26,0.15)" }}>
      <Icon name={icon} fallback="Star" size={14} style={{ color: "var(--mrcat-orange)" }} />
      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</span>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center justify-center gap-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="typing-dot w-2 h-2 rounded-full bg-white inline-block" />
      ))}
    </span>
  );
}