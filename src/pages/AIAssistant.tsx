import React from 'react';
import { SEO } from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceAssistant } from '@/components/ai/VoiceAssistant';
import { AIContentGenerator } from '@/components/ai/AIContentGenerator';
import { Mic, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <SEO 
        title="AI Assistant — AyurWell" 
        description="Experience personalized Ayurvedic guidance with our AI voice assistant and content generator. Get instant wellness advice and custom health content."
        canonical="/ai-assistant"
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="section-title">AI Wellness Assistant</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Experience the future of Ayurvedic wellness with our intelligent voice assistant and personalized content generator
          </p>
        </div>

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Assistant
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Content Generator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Voice Wellness Guide</h2>
              <p className="text-muted-foreground">
                Speak naturally with our AI assistant to get instant Ayurvedic wellness advice. 
                Ask about your health concerns, diet recommendations, or daily wellness practices.
              </p>
            </div>
            <VoiceAssistant />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Personalized Content Creation</h2>
              <p className="text-muted-foreground">
                Generate customized wellness content including daily tips, diet plans, meditation guides, 
                and educational articles tailored to your Ayurvedic constitution.
              </p>
            </div>
            <AIContentGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;