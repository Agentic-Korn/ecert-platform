import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
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
import VerifyPublic from "./pages/VerifyPublic";
import HolderPortal from "./pages/HolderPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes (no sidebar) */}
          <Route path="/verify" element={<VerifyPublic />} />
          <Route path="/verify/:certNo" element={<VerifyPublic />} />
          <Route path="/portal" element={<HolderPortal />} />

          {/* Admin routes (with sidebar) */}
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
