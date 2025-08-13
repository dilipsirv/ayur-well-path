import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Coffee, Sun, Moon, Apple } from "lucide-react";
import { Link } from "react-router-dom";

interface DietChart {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  prakriti_type: string;
}

const dietRecommendations = {
  Vata: {
    breakfast: "Warm oatmeal with nuts and honey, herbal tea with ginger",
    lunch: "Rice with cooked vegetables, dal, and ghee",
    dinner: "Soup with root vegetables, whole grain bread",
    snacks: "Dates, almonds, warm milk with spices",
    characteristics: ["Warm foods", "Cooked meals", "Regular timing", "Ghee and oils"],
    avoid: ["Cold foods", "Raw vegetables", "Irregular meals", "Caffeine excess"]
  },
  Pitta: {
    breakfast: "Fresh fruits, coconut water, cooling cereals",
    lunch: "Quinoa salad with cucumber, leafy greens, coconut oil",
    dinner: "Steamed vegetables with rice, cooling herbs",
    snacks: "Sweet fruits, coconut, rose water drinks",
    characteristics: ["Cool foods", "Sweet tastes", "Fresh ingredients", "Coconut oil"],
    avoid: ["Spicy foods", "Sour fruits", "Hot spices", "Fried foods"]
  },
  Kapha: {
    breakfast: "Light fruits, herbal teas, honey (small amount)",
    lunch: "Spiced vegetables, legumes, small portion grains",
    dinner: "Light soup, steamed vegetables with warming spices",
    snacks: "Spiced tea, small portion of nuts",
    characteristics: ["Light foods", "Warming spices", "Less oil", "Smaller portions"],
    avoid: ["Heavy foods", "Dairy excess", "Sweet foods", "Cold drinks"]
  }
};

const DietChart = () => {
  const { user } = useAuth();
  const [prakritiType, setPrakritiType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrakritiType();
  }, [user]);

  const fetchPrakritiType = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
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

  const recommendations = prakritiType ? dietRecommendations[prakritiType as keyof typeof dietRecommendations] : null;

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="Diet Chart — AyurWell" description="Personalized Ayurvedic diet recommendations based on your Prakriti constitution." canonical="/diet-chart" />
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="section-title">Your Diet Chart</h1>
          <p className="text-muted-foreground">Personalized nutrition based on your Prakriti</p>
        </div>
      </div>

      {!prakritiType ? (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Prakriti Analysis First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To get personalized diet recommendations, you need to complete your Prakriti analysis first.
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
                <Apple className="h-5 w-5" />
                Your Constitution: {prakritiType}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your diet recommendations are tailored for {prakritiType} constitution. 
                Follow these guidelines for optimal health and balance.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    Breakfast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{recommendations?.breakfast}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Lunch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{recommendations?.lunch}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    Dinner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{recommendations?.dinner}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5" />
                    Snacks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{recommendations?.snacks}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendations?.characteristics.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Foods to Avoid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendations?.avoid.map((item, index) => (
                      <Badge key={index} variant="destructive">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm">Important Note</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>These recommendations are general guidelines based on Ayurvedic principles. 
                  Always consult with a qualified Ayurvedic practitioner or healthcare provider 
                  for personalized advice, especially if you have specific health conditions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietChart;