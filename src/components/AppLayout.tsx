import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Globe, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { RoleBadge } from "@/components/RoleBadge";
import { ResetDemoButton } from "@/components/ResetDemoButton";
import { DemoTourLauncher } from "@/components/DemoTourLauncher";

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "th" ? "en" : "th");
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 glass-strong border-b border-border flex items-center justify-between px-4 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge />
              <ResetDemoButton />
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary gap-1.5 text-xs font-medium"
                onClick={toggleLanguage}
              >
                <Globe className="h-3.5 w-3.5" />
                {i18n.language === "th" ? "EN" : "TH"}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5">
                    <User className="h-4 w-4" />
                    {state.currentUser && (
                      <span className="text-xs font-medium hidden sm:inline">
                        {state.currentUser.name}
                        <span className="text-muted-foreground ml-1">({t(`roles.${state.currentUser.role}`)})</span>
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
          <DemoTourLauncher />
        </div>
      </div>
    </SidebarProvider>
  );
}
