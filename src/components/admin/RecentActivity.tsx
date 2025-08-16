import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  type: 'prakriti' | 'follow_up';
  user_name?: string;
  user_email?: string;
  created_at: string;
  prakriti_type?: string;
  feedback?: string;
}

export const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent prakriti results
      const { data: prakritiData, error: prakritiError } = await supabase
        .from('prakriti_results' as any)
        .select(`
          id,
          created_at,
          prakriti_type,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent follow-ups
      const { data: followUpData, error: followUpError } = await supabase
        .from('follow_ups' as any)
        .select(`
          id,
          created_at,
          feedback,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (prakritiError) throw prakritiError;
      if (followUpError) throw followUpError;

      // Get user details for all activities
      const allUserIds = [
        ...((prakritiData as any)?.map((item: any) => item.user_id) || []),
        ...((followUpData as any)?.map((item: any) => item.user_id) || [])
      ];

      const { data: usersData } = await supabase
        .from('users' as any)
        .select('id, name, email')
        .in('id', allUserIds);

      // Combine and format activities
      const prakritiActivities = (prakritiData as any)?.map((item: any) => ({
        ...item,
        type: 'prakriti' as const,
        user_name: (usersData as any)?.find((u: any) => u.id === item.user_id)?.name,
        user_email: (usersData as any)?.find((u: any) => u.id === item.user_id)?.email
      })) || [];

      const followUpActivities = (followUpData as any)?.map((item: any) => ({
        ...item,
        type: 'follow_up' as const,
        user_name: (usersData as any)?.find((u: any) => u.id === item.user_id)?.name,
        user_email: (usersData as any)?.find((u: any) => u.id === item.user_id)?.email
      })) || [];

      // Combine and sort by date
      const allActivities = [...prakritiActivities, ...followUpActivities]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prakriti':
        return <FileText className="h-4 w-4" />;
      case 'follow_up':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'prakriti':
        return `Completed Prakriti analysis (${activity.prakriti_type})`;
      case 'follow_up':
        return `Added follow-up${activity.feedback ? ': ' + activity.feedback.substring(0, 50) + (activity.feedback.length > 50 ? '...' : '') : ''}`;
      default:
        return 'Unknown activity';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.user_name || activity.user_email}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {activity.type === 'prakriti' ? 'Assessment' : 'Follow-up'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No recent activity found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};