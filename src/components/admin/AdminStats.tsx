import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStatsProps {
  className?: string;
}

export const AdminStats = ({ className }: AdminStatsProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrakritiTests: 0,
    totalFollowUps: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('users' as any)
        .select('*', { count: 'exact', head: true });

      // Fetch prakriti results count
      const { count: prakritiCount } = await supabase
        .from('prakriti_results' as any)
        .select('*', { count: 'exact', head: true });

      // Fetch follow-ups count
      const { count: followUpCount } = await supabase
        .from('follow_ups' as any)
        .select('*', { count: 'exact', head: true });

      // Fetch recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentCount } = await supabase
        .from('follow_ups' as any)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalUsers: userCount || 0,
        totalPrakritiTests: prakritiCount || 0,
        totalFollowUps: followUpCount || 0,
        recentActivity: recentCount || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users"
    },
    {
      title: "Prakriti Tests",
      value: stats.totalPrakritiTests,
      icon: FileText,
      description: "Completed assessments"
    },
    {
      title: "Follow-ups",
      value: stats.totalFollowUps,
      icon: Calendar,
      description: "Total follow-ups"
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: Activity,
      description: "Last 7 days"
    }
  ];

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};