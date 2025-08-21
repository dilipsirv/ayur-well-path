import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for text:', text.substring(0, 100))

    // Map voice names to Google TTS voices
    const voiceMap = {
      'alloy': 'en-US-Journey-F',
      'echo': 'en-US-Casual-K',
      'fable': 'en-US-Journey-D',
      'onyx': 'en-US-Journey-O',
      'nova': 'en-US-Journey-F',
      'shimmer': 'en-US-Journey-F'
    }

    const googleVoice = voiceMap[voice] || 'en-US-Journey-F'

    // Generate speech using Google Text-to-Speech API
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${Deno.env.get('GOOGLE_API_KEY')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: googleVoice,
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Google TTS error:', error)
      throw new Error('Failed to generate speech')
    }

    const result = await response.json()
    console.log('Speech generation successful')

    return new Response(
      JSON.stringify({ audioContent: result.audioContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-voice function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})