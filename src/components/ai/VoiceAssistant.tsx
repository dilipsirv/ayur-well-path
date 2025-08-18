import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceAssistantProps {
  onResponse?: (response: string) => void;
}

export const VoiceAssistant = ({ onResponse }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Speak your wellness question",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  }, [isListening]);

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      // Convert to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Send to speech-to-text
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) throw transcriptionError;

      const userMessage = transcriptionData.text;
      console.log('Transcribed text:', userMessage);

      if (!userMessage.trim()) {
        toast({
          title: "No speech detected",
          description: "Please try speaking again",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Add user message to conversation
      const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
      setConversation(newConversation);

      // Get AI response
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-wellness-chat', {
        body: { 
          message: userMessage,
          userContext: { conversationHistory: newConversation.slice(-5) } // Last 5 messages for context
        }
      });

      if (aiError) throw aiError;

      const aiResponse = aiData.response;
      
      // Add AI response to conversation
      const updatedConversation = [...newConversation, { role: 'assistant' as const, content: aiResponse }];
      setConversation(updatedConversation);

      // Convert AI response to speech
      await playAIResponse(aiResponse);

      onResponse?.(aiResponse);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process your voice input",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAIResponse = async (text: string) => {
    try {
      setIsPlaying(true);
      
      const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-voice', {
        body: { text, voice: 'alloy' }
      });

      if (speechError) throw speechError;

      // Create audio element and play
      const audioBlob = new Blob([
        Uint8Array.from(atob(speechData.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };
      
      setCurrentAudio(audio);
      await audio.play();
      
    } catch (error) {
      console.error('Error playing AI response:', error);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Could not play voice response",
        variant: "destructive",
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Wellness Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isListening && !isProcessing ? (
            <Button
              onClick={startListening}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full"
              size="lg"
            >
              <Mic className="h-6 w-6 mr-2" />
              Start Talking
            </Button>
          ) : isListening ? (
            <Button
              onClick={stopListening}
              variant="destructive"
              className="px-8 py-6 rounded-full animate-pulse"
              size="lg"
            >
              <MicOff className="h-6 w-6 mr-2" />
              Stop Recording
            </Button>
          ) : (
            <Button disabled className="px-8 py-6 rounded-full" size="lg">
              <Loader2 className="h-6 w-6 mr-2 animate-spin" />
              Processing...
            </Button>
          )}

          {isPlaying && (
            <Button
              onClick={stopAudio}
              variant="outline"
              className="px-6 py-6 rounded-full"
              size="lg"
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Stop Audio
            </Button>
          )}
        </div>

        {/* Conversation Display */}
        {conversation.length > 0 && (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {conversation.slice(-4).map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary/10 ml-8' 
                    : 'bg-secondary mr-8'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'AyurWell AI'}
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Status Display */}
        <div className="text-center text-sm text-muted-foreground">
          {isListening && "🎤 Listening... Speak your wellness question"}
          {isProcessing && "🤔 Processing your question..."}
          {isPlaying && "🔊 Playing AI response..."}
          {!isListening && !isProcessing && !isPlaying && "Click 'Start Talking' to begin your wellness conversation"}
        </div>
      </CardContent>
    </Card>
  );
};