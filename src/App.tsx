import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import KYC from "./pages/KYC";
import Playlists from "./pages/Playlists";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import BotSettings from "./pages/BotSettings";
import RewardSettings from "./pages/RewardSettings";
import CMS from "./pages/CMS";
import Profile from "./pages/Profile";
import UserDetail from "./pages/UserDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/:userId" 
              element={
                <ProtectedRoute requireAdmin>
                  <UserDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/akshayrajput2616" 
              element={
                <ProtectedRoute requireAdmin>
                  <UserDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/kyc" 
              element={
                <ProtectedRoute requireAdmin>
                  <KYC />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/playlists" 
              element={
                <ProtectedRoute requireAdmin>
                  <Playlists />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute requireAdmin>
                  <Transactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute requireAdmin>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bots/settings" 
              element={
                <ProtectedRoute requireAdmin>
                  <BotSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rewards/settings" 
              element={
                <ProtectedRoute requireAdmin>
                  <RewardSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cms" 
              element={
                <ProtectedRoute requireAdmin>
                  <CMS />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAdmin>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;