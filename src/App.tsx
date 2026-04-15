import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { RouteGuard } from "@/components/RouteGuard";
import { AppProvider } from "@/lib/store";
import "@/lib/i18n";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import Certificates from "./pages/Certificates";
import Approvals from "./pages/Approvals";
import Training from "./pages/Training";
import Events from "./pages/Events";
import Messages from "./pages/Messages";
import Templates from "./pages/Templates";
import UsersRoles from "./pages/UsersRoles";
import ApiClients from "./pages/ApiClients";
import AuditLogs from "./pages/AuditLogs";
import SettingsPage from "./pages/SettingsPage";
import Reports from "./pages/Reports";
import VerifyPublic from "./pages/VerifyPublic";
import HolderPortal from "./pages/HolderPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes (no sidebar, no auth) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<VerifyPublic />} />
            <Route path="/verify/:certNo" element={<VerifyPublic />} />

            {/* Holder portal (auth required, no sidebar) */}
            <Route element={<RouteGuard allowedRoles={["holder", "admin", "approver", "trainer"]} />}>
              <Route path="/portal" element={<HolderPortal />} />
            </Route>

            {/* Admin routes (auth required, with sidebar) */}
            <Route element={<RouteGuard allowedRoles={["admin", "approver", "trainer"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/training" element={<Training />} />
                <Route path="/events" element={<Events />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/users" element={<UsersRoles />} />
                <Route path="/api-clients" element={<ApiClients />} />
                <Route path="/logs" element={<AuditLogs />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
