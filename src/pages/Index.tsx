import { useState } from "react";
import AuthScreen from "@/components/mrcat/AuthScreen";
import MessengerApp from "@/components/mrcat/MessengerApp";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; avatar: string } | null>(null);

  const handleLogin = (email: string, name: string) => {
    setCurrentUser({ email, name, avatar: "" });
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <MessengerApp user={currentUser!} onLogout={() => setIsAuthenticated(false)} />;
}
