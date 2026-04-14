import {
  LayoutDashboard,
  Award,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  Users,
  Key,
  FileText,
  Shield,
  BadgeCheck,
  MessageSquare,
  Settings,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface NavItem {
  titleKey: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNav: NavItem[] = [
  { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "nav.programs", url: "/programs", icon: Award },
  { titleKey: "nav.certificates", url: "/certificates", icon: BadgeCheck },
  { titleKey: "nav.approvals", url: "/approvals", icon: ClipboardCheck },
  { titleKey: "nav.reports", url: "/reports", icon: BarChart3 },
];

const trainingNav: NavItem[] = [
  { titleKey: "nav.courses", url: "/training", icon: GraduationCap },
  { titleKey: "nav.events", url: "/events", icon: Calendar },
];

const commNav: NavItem[] = [
  { titleKey: "nav.messages", url: "/messages", icon: MessageSquare },
  { titleKey: "nav.templates", url: "/templates", icon: FileText },
];

const adminNav: NavItem[] = [
  { titleKey: "nav.usersRoles", url: "/users", icon: Users },
  { titleKey: "nav.apiClients", url: "/api-clients", icon: Key },
  { titleKey: "nav.auditLogs", url: "/logs", icon: Shield },
  { titleKey: "nav.settings", url: "/settings", icon: Settings },
];

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-muted text-[11px] uppercase tracking-wider font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all text-sm"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.titleKey)}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { t } = useTranslation();
  return (
    <Sidebar className="border-r-0 glass-sidebar">
      <SidebarHeader className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sidebar-primary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-accent-foreground tracking-tight">{t("app.name")}</h1>
            <p className="text-[11px] text-sidebar-muted">{t("app.tagline")}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <NavSection label={t("nav.overview")} items={mainNav} />
        <NavSection label={t("nav.trainingEvents")} items={trainingNav} />
        <NavSection label={t("nav.communication")} items={commNav} />
        <NavSection label={t("nav.administration")} items={adminNav} />
      </SidebarContent>
    </Sidebar>
  );
}
