import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, userProfile, preferences } = await req.json();

    console.log('Generating AI content:', contentType);

    let systemPrompt = '';
    let userPrompt = '';

    switch (contentType) {
      case 'daily_tips':
        systemPrompt = `You are an expert Ayurvedic wellness advisor. Generate personalized daily wellness tips based on Ayurvedic principles.`;
        userPrompt = `Create 3 personalized daily wellness tips for a user with the following profile: ${JSON.stringify(userProfile)}. Include practical advice for diet, lifestyle, and mindfulness. Keep each tip concise and actionable.`;
        break;
      
      case 'diet_plan':
        systemPrompt = `You are an Ayurvedic nutrition expert. Create personalized meal recommendations based on Prakriti and current health needs.`;
        userPrompt = `Generate a personalized daily diet plan for a user with Prakriti: ${userProfile?.prakriti || 'Unknown'}. Include breakfast, lunch, dinner, and snacks. Consider seasonal foods and Ayurvedic principles. Format as a structured meal plan.`;
        break;
      
      case 'wellness_article':
        systemPrompt = `You are an Ayurvedic health writer. Create educational content that is informative, engaging, and based on traditional Ayurvedic wisdom.`;
        userPrompt = `Write a short wellness article (300-400 words) about ${preferences?.topic || 'general Ayurvedic wellness'}. Include practical tips and explain the Ayurvedic perspective. Make it engaging and educational.`;
        break;
      
      case 'meditation_guide':
        systemPrompt = `You are a mindfulness and meditation expert with deep knowledge of Ayurvedic practices.`;
        userPrompt = `Create a personalized 10-minute meditation guide for someone with ${userProfile?.prakriti || 'balanced'} constitution. Include breathing techniques and visualization. Focus on balancing their specific dosha.`;
        break;
      
      default:
        throw new Error('Invalid content type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate content');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('AI content generated successfully');

    return new Response(JSON.stringify({ 
      content: generatedContent,
      contentType,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-content-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});