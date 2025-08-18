import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Download, RefreshCw, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedContent {
  content: string;
  contentType: string;
  generatedAt: string;
}

export const AIContentGenerator = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get user's Prakriti analysis
        const { data: prakritiData } = await supabase
          .from('prakriti_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        setUserProfile({
          prakriti: prakritiData?.[0]?.prakriti_type || 'balanced',
          userId: user.id
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const contentTypes = [
    { value: 'daily_tips', label: 'Daily Wellness Tips', description: 'Personalized tips for your daily routine' },
    { value: 'diet_plan', label: 'Custom Diet Plan', description: 'Ayurvedic meal recommendations' },
    { value: 'wellness_article', label: 'Wellness Article', description: 'Educational health content' },
    { value: 'meditation_guide', label: 'Meditation Guide', description: 'Personalized meditation practice' }
  ];

  const generateContent = async () => {
    if (!selectedType) {
      toast({
        title: "Please select content type",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: {
          contentType: selectedType,
          userProfile,
          preferences: {
            topic: selectedType === 'wellness_article' ? 'seasonal wellness' : undefined
          }
        }
      });

      if (error) throw error;

      setGeneratedContent(data);
      toast({
        title: "Content generated successfully!",
        description: "Your personalized wellness content is ready",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied to clipboard!",
        });
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const downloadContent = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ayurwell-${generatedContent.contentType}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const regenerateContent = () => {
    generateContent();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Wellness Content Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate personalized Ayurvedic wellness content tailored to your constitution
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Choose Content Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select what you'd like to generate..." />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User Profile Info */}
          {userProfile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your Prakriti:</span>
              <Badge variant="secondary">{userProfile.prakriti}</Badge>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateContent}
            disabled={!selectedType || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generated Content
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  onClick={downloadContent}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={regenerateContent}
                  variant="outline"
                  size="sm"
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{contentTypes.find(t => t.value === generatedContent.contentType)?.label}</Badge>
              <span className="text-sm text-muted-foreground">
                Generated on {new Date(generatedContent.generatedAt).toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedContent.content}
              readOnly
              className="min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};