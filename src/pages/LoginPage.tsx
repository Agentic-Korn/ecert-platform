import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import type { AuthSession } from "@/lib/types";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "th" ? "en" : "th");
  };

  const handleLogin = () => {
    const user = state.users.find((u) => u.id === selectedUserId);
    if (!user) return;

    const session: AuthSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    dispatch({ type: "LOGIN", payload: session });

    if (user.role === "holder") {
      navigate("/portal");
    } else {
      navigate("/");
    }
  };

  const roleLabel = (role: string) => t(`roles.${role}`);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary gap-1.5 text-xs font-medium"
          onClick={toggleLanguage}
        >
          <Globe className="h-3.5 w-3.5" />
          {i18n.language === "th" ? "EN" : "TH"}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-strong rounded-2xl border border-border p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">{t("auth.loginTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("auth.loginSubtitle")}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.selectUser")}</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("auth.selectUser")} />
                </SelectTrigger>
                <SelectContent>
                  {state.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <span className="flex items-center gap-2">
                        {user.name}
                        <span className="text-xs text-muted-foreground">({roleLabel(user.role)})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleLogin}
              disabled={!selectedUserId}
            >
              {t("auth.login")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
