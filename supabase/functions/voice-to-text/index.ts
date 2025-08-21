import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    console.log('Processing audio transcription request')

    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0))
    
    // Convert to base64 for Google API
    const base64Audio = btoa(String.fromCharCode(...binaryAudio))

    // Send to Google Speech-to-Text API
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${Deno.env.get('GOOGLE_API_KEY')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          model: 'latest_long',
          useEnhanced: true,
        },
        audio: {
          content: base64Audio
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Speech API error:', errorText)
      throw new Error(`Google Speech API error: ${errorText}`)
    }

    const result = await response.json()
    
    if (!result.results || result.results.length === 0) {
      throw new Error('No transcription results returned')
    }

    const transcript = result.results[0]?.alternatives[0]?.transcript || ''
    console.log('Transcription successful:', transcript)

    return new Response(
      JSON.stringify({ text: transcript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in voice-to-text function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})