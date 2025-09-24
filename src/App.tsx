import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import CLITerminal from "./pages/CLITerminal";
import AuditResults from "./pages/AuditResults";
import EnhancedReports from "./pages/EnhancedReports";
import ActivityLogs from "./pages/ActivityLogs";
import EnhancedSecurityProfiles from "./pages/EnhancedSecurityProfiles";
import RollbackManager from "./pages/RollbackManager";
import Settings from "./pages/Settings";
import HelpGuide from "./pages/HelpGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<EnhancedDashboard />} />
            <Route path="/cli" element={<CLITerminal />} />
            {/* Placeholder routes for future pages */}
            <Route path="/audit" element={<AuditResults />} />
            <Route path="/reports" element={<EnhancedReports />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/profiles" element={<EnhancedSecurityProfiles />} />
            <Route path="/rollback" element={<RollbackManager />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;