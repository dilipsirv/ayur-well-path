import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Brain, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "What is your body build?",
    options: [
      { value: "vata", label: "Thin, light frame", type: "Vata" },
      { value: "pitta", label: "Medium, muscular build", type: "Pitta" },
      { value: "kapha", label: "Heavy, broad frame", type: "Kapha" }
    ]
  },
  {
    id: 2,
    question: "How is your skin texture?",
    options: [
      { value: "vata", label: "Dry, rough, cool", type: "Vata" },
      { value: "pitta", label: "Warm, oily, soft", type: "Pitta" },
      { value: "kapha", label: "Thick, moist, cool", type: "Kapha" }
    ]
  },
  {
    id: 3,
    question: "How is your appetite?",
    options: [
      { value: "vata", label: "Variable, irregular", type: "Vata" },
      { value: "pitta", label: "Strong, regular", type: "Pitta" },
      { value: "kapha", label: "Slow, steady", type: "Kapha" }
    ]
  },
  {
    id: 4,
    question: "How do you handle stress?",
    options: [
      { value: "vata", label: "Get anxious easily", type: "Vata" },
      { value: "pitta", label: "Get irritated quickly", type: "Pitta" },
      { value: "kapha", label: "Stay calm and composed", type: "Kapha" }
    ]
  },
  {
    id: 5,
    question: "What is your sleep pattern?",
    options: [
      { value: "vata", label: "Light, restless sleep", type: "Vata" },
      { value: "pitta", label: "Moderate, sound sleep", type: "Pitta" },
      { value: "kapha", label: "Deep, heavy sleep", type: "Kapha" }
    ]
  }
];

const PrakritiAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingResult, setExistingResult] = useState<any>(null);

  useEffect(() => {
    fetchExistingResult();
  }, [user]);

  const fetchExistingResult = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('prakriti_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setExistingResult(data);
      }
    } catch (error) {
      console.error('Error fetching existing result:', error);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = async () => {
    setLoading(true);
    
    // Count answers
    const counts = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(answers).forEach(answer => {
      counts[answer as keyof typeof counts]++;
    });

    // Determine dominant prakriti
    const dominant = Object.entries(counts).reduce((a, b) => 
      counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b
    )[0];

    const prakritiType = dominant.charAt(0).toUpperCase() + dominant.slice(1);
    
    try {
      const { error } = await supabase
        .from('prakriti_results')
        .insert({
          user_id: user?.id,
          prakriti_type: prakritiType,
          score: counts
        });

      if (error) throw error;

      setResult(prakritiType);
      toast({
        title: "Analysis Complete",
        description: `Your Prakriti type is ${prakritiType}`,
      });
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: "Error",
        description: "Failed to save analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const restartAnalysis = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setExistingResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (result) {
    return (
      <div className="container mx-auto px-6 py-8">
        <SEO title="Prakriti Analysis Results — AyurWell" description="Your Ayurvedic constitution analysis results and personalized recommendations." canonical="/prakriti-analysis" />
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="section-title mb-4">Your Prakriti Type</h1>
            <div className="text-4xl font-bold text-primary mb-2">{result}</div>
            <p className="text-muted-foreground">Based on your responses to the questionnaire</p>
          </div>

          {result === 'Vata' && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Vata Constitution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You have a Vata constitution, characterized by the elements of air and space.</p>
                <h4 className="font-semibold mb-2">Key Characteristics:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Creative, energetic, and flexible</li>
                  <li>Tendency towards dry skin and variable appetite</li>
                  <li>May experience anxiety when imbalanced</li>
                  <li>Benefits from routine and grounding activities</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {result === 'Pitta' && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Pitta Constitution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You have a Pitta constitution, characterized by the elements of fire and water.</p>
                <h4 className="font-semibold mb-2">Key Characteristics:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Intelligent, focused, and determined</li>
                  <li>Strong digestion and regular appetite</li>
                  <li>May experience irritability when imbalanced</li>
                  <li>Benefits from cooling foods and activities</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {result === 'Kapha' && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Kapha Constitution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You have a Kapha constitution, characterized by the elements of earth and water.</p>
                <h4 className="font-semibold mb-2">Key Characteristics:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Stable, patient, and nurturing</li>
                  <li>Strong immunity and steady energy</li>
                  <li>May experience lethargy when imbalanced</li>
                  <li>Benefits from stimulating and warming activities</li>
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 space-y-4">
            <Button onClick={restartAnalysis} variant="outline">
              Take Analysis Again
            </Button>
            <Button asChild className="ml-4">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <SEO title="Prakriti Analysis — AyurWell" description="Discover your Ayurvedic constitution through our comprehensive questionnaire." canonical="/prakriti-analysis" />
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="section-title">Prakriti Analysis</h1>
          <p className="text-muted-foreground">Discover your Ayurvedic constitution</p>
        </div>
      </div>

      {existingResult && !result && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Previous Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You previously completed this analysis and your result was: <strong>{existingResult.prakriti_type}</strong></p>
            <p className="text-sm text-muted-foreground mt-2">You can retake the analysis to get updated results.</p>
          </CardContent>
        </Card>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">({option.type} characteristic)</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion] || loading}
          >
            {loading ? 'Calculating...' : currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
            {!loading && currentQuestion < questions.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrakritiAnalysis;