import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Brain, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface PrakritiResult {
  id: string;
  prakriti_type: string;
  score: any;
  created_at: string;
}

interface FollowUp {
  id: string;
  reminder_date: string;
  feedback: string;
  progress_notes: string;
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [prakritiResults, setPrakritiResults] = useState<PrakritiResult[]>([]);
  const [recentFollowUps, setRecentFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    
    try {
      // Fetch Prakriti results
      const { data: prakritiData, error: prakritiError } = await (supabase as any)
        .from('prakriti_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (prakritiError) throw prakritiError;
      setPrakritiResults(prakritiData || []);

      // Fetch recent follow-ups
      const { data: followUpData, error: followUpError } = await (supabase as any)
        .from('follow_ups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (followUpError) throw followUpError;
      setRecentFollowUps(followUpData || []);
      
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="History — AyurWell" description="View your Ayurveda journey history including Prakriti analyses and follow-up progress." canonical="/history" />
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="section-title">Your Wellness History</h1>
          <p className="text-muted-foreground">Track your Ayurveda journey over time</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Prakriti Analysis History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prakritiResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No Prakriti analyses completed yet.</p>
                  <Button asChild>
                    <Link to="/prakriti-analysis">Take Your First Analysis</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {prakritiResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-sm">
                          {result.prakriti_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(result.created_at), 'PPP')}
                        </span>
                      </div>
                      
                      {result.score && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Score Breakdown:</p>
                          <div className="flex gap-4 text-xs">
                            <span>Vata: {result.score.vata || 0}</span>
                            <span>Pitta: {result.score.pitta || 0}</span>
                            <span>Kapha: {result.score.kapha || 0}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{prakritiResults.length}</div>
                  <div className="text-sm text-muted-foreground">Analyses Completed</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{recentFollowUps.length}</div>
                  <div className="text-sm text-muted-foreground">Follow-ups Recorded</div>
                </div>
              </div>
              
              {prakritiResults.length > 0 && (
                <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Current Constitution:</span> {prakritiResults[0].prakriti_type}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last analyzed on {format(new Date(prakritiResults[0].created_at), 'PPP')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentFollowUps.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No follow-ups recorded yet.</p>
                  <Button asChild>
                    <Link to="/follow-ups">Add Your First Follow-up</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentFollowUps.map((followUp) => (
                    <div key={followUp.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {followUp.reminder_date ? format(new Date(followUp.reminder_date), 'MMM dd, yyyy') : 'No date'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(followUp.created_at), 'MMM dd')}
                        </span>
                      </div>
                      
                      {followUp.feedback && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {followUp.feedback.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  ))}
                  
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/follow-ups">View All Follow-ups</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Journey Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prakritiResults.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Started Ayurveda journey on {format(new Date(prakritiResults[prakritiResults.length - 1].created_at), 'MMM dd, yyyy')}</span>
                  </div>
                )}
                
                {recentFollowUps.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Latest progress update on {format(new Date(recentFollowUps[0].created_at), 'MMM dd, yyyy')}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span>Continue your wellness journey today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default History;