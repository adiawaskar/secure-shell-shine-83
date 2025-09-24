import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CLITerminal from "./pages/CLITerminal";
import AuditResults from "./pages/AuditResults";
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/cli" element={<CLITerminal />} />
            {/* Placeholder routes for future pages */}
            <Route path="/audit" element={<AuditResults />} />
            <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/logs" element={<div className="p-6"><h1 className="text-2xl font-bold">Activity Logs</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/profiles" element={<div className="p-6"><h1 className="text-2xl font-bold">Security Profiles</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/rollback" element={<div className="p-6"><h1 className="text-2xl font-bold">Rollback Manager</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/help" element={<div className="p-6"><h1 className="text-2xl font-bold">Help & Guide</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;