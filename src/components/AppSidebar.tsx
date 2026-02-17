import {
  LayoutDashboard,
  Award,
  ClipboardCheck,
  Search,
  GraduationCap,
  Calendar,
  Users,
  Key,
  FileText,
  Shield,
  BadgeCheck,
  MessageSquare,
  Settings,
} from "lucide-react";
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

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Programs", url: "/programs", icon: Award },
  { title: "Certificates", url: "/certificates", icon: BadgeCheck },
  { title: "Approvals", url: "/approvals", icon: ClipboardCheck },
];

const trainingNav = [
  { title: "Courses", url: "/training", icon: GraduationCap },
  { title: "Events", url: "/events", icon: Calendar },
];

const commNav = [
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Templates", url: "/templates", icon: FileText },
];

const adminNav = [
  { title: "Users & Roles", url: "/users", icon: Users },
  { title: "API Clients", url: "/api-clients", icon: Key },
  { title: "Audit Logs", url: "/logs", icon: Shield },
  { title: "Settings", url: "/settings", icon: Settings },
];

function NavSection({ label, items }: { label: string; items: typeof mainNav }) {
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
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
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
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-accent-foreground tracking-tight">eCert</h1>
            <p className="text-[11px] text-sidebar-muted">Certification Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <NavSection label="Overview" items={mainNav} />
        <NavSection label="Training & Events" items={trainingNav} />
        <NavSection label="Communication" items={commNav} />
        <NavSection label="Administration" items={adminNav} />
      </SidebarContent>
    </Sidebar>
  );
}
