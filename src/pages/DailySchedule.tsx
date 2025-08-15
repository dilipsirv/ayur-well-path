import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Sun, Sunrise, Sunset, Moon } from "lucide-react";
import { Link } from "react-router-dom";

const scheduleRecommendations = {
  Vata: {
    wakeUp: "6:00 AM",
    meditation: "6:15 AM - 6:45 AM",
    exercise: "7:00 AM - 7:30 AM (Gentle yoga, walking)",
    breakfast: "8:00 AM",
    work: "9:00 AM - 1:00 PM",
    lunch: "1:00 PM",
    rest: "1:30 PM - 2:00 PM",
    work2: "2:00 PM - 6:00 PM",
    dinner: "7:00 PM",
    relaxation: "8:00 PM - 9:00 PM (Reading, music)",
    sleep: "10:00 PM",
    tips: ["Maintain regular timing", "Avoid overexertion", "Include warming activities", "Create calming environment"]
  },
  Pitta: {
    wakeUp: "5:30 AM",
    meditation: "5:45 AM - 6:15 AM",
    exercise: "6:30 AM - 7:30 AM (Swimming, moderate intensity)",
    breakfast: "8:00 AM",
    work: "9:00 AM - 12:30 PM",
    lunch: "12:30 PM",
    rest: "1:00 PM - 1:30 PM",
    work2: "1:30 PM - 5:30 PM",
    dinner: "7:30 PM",
    relaxation: "8:30 PM - 9:30 PM (Cool activities)",
    sleep: "10:30 PM",
    tips: ["Avoid midday heat", "Include cooling activities", "Don't skip meals", "Moderate intensity workouts"]
  },
  Kapha: {
    wakeUp: "5:00 AM",
    meditation: "5:15 AM - 5:45 AM",
    exercise: "6:00 AM - 7:00 AM (Vigorous exercise, running)",
    breakfast: "8:30 AM (Light)",
    work: "9:00 AM - 1:00 PM",
    lunch: "1:00 PM (Main meal)",
    work2: "2:00 PM - 6:00 PM",
    dinner: "6:30 PM (Light)",
    relaxation: "8:00 PM - 9:00 PM (Stimulating activities)",
    sleep: "10:00 PM",
    tips: ["Early rising essential", "Vigorous morning exercise", "Light dinner", "Stay active throughout day"]
  }
};

const DailySchedule = () => {
  const { user } = useAuth();
  const [prakritiType, setPrakritiType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrakritiType();
  }, [user]);

  const fetchPrakritiType = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('prakriti_results')
        .select('prakriti_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setPrakritiType(data.prakriti_type);
      }
    } catch (error) {
      console.error('Error fetching prakriti type:', error);
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

  const schedule = prakritiType ? scheduleRecommendations[prakritiType as keyof typeof scheduleRecommendations] : null;

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="Daily Schedule — AyurWell" description="Personalized daily routine recommendations based on your Ayurvedic constitution." canonical="/daily-schedule" />
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="section-title">Your Daily Schedule</h1>
          <p className="text-muted-foreground">Optimal routine for your Prakriti type</p>
        </div>
      </div>

      {!prakritiType ? (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Prakriti Analysis First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To get personalized daily schedule recommendations, you need to complete your Prakriti analysis first.
            </p>
            <Button asChild>
              <Link to="/prakriti-analysis">Take Prakriti Analysis</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {prakritiType} Daily Routine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This schedule is designed specifically for {prakritiType} constitution to maintain optimal health and balance.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sunrise className="h-5 w-5 text-orange-500" />
                    Morning Routine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Wake Up</span>
                    <Badge variant="outline">{schedule?.wakeUp}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Meditation</span>
                    <Badge variant="outline">{schedule?.meditation}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Exercise</span>
                    <Badge variant="outline">{schedule?.exercise}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Breakfast</span>
                    <Badge variant="outline">{schedule?.breakfast}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    Daytime
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Morning Work</span>
                    <Badge variant="outline">{schedule?.work}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Lunch</span>
                    <Badge variant="outline">{schedule?.lunch}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Rest</span>
                    <Badge variant="outline">1:30 PM - 2:00 PM</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Afternoon Work</span>
                    <Badge variant="outline">{schedule?.work2}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sunset className="h-5 w-5 text-orange-600" />
                    Evening Routine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Dinner</span>
                    <Badge variant="outline">{schedule?.dinner}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium">Relaxation</span>
                    <Badge variant="outline">{schedule?.relaxation}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Sleep Time
                    </span>
                    <Badge variant="outline">{schedule?.sleep}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Tips for {prakritiType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {schedule?.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm">Customization Note</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>This is a general schedule. Adjust timing based on your lifestyle, work commitments, and seasonal changes. The key is maintaining consistency and balance.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySchedule;