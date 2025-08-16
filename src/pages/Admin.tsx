import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStats } from "@/components/admin/AdminStats";
import { UserManagement } from "@/components/admin/UserManagement";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { Shield, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-10">
        <SEO title="Access Denied — AyurWell" description="Admin access required" canonical="/admin" />
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="section-title mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            You don't have admin privileges to access this page. Contact an administrator if you believe this is an error.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="Admin Panel — AyurWell" description="Secure admin panel to manage users, follow-ups, and analytics." canonical="/admin" />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="section-title">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, monitor activity, and view system analytics
        </p>
      </div>

      <div className="space-y-8">
        {/* Stats Overview */}
        <AdminStats />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Management - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <UserManagement />
          </div>
          
          {/* Recent Activity - Takes up 1 column */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;