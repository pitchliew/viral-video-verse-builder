
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!claudeApiKey) {
      console.error('CLAUDE_API_KEY is not set');
      throw new Error('Claude API key is not configured');
    }

    // Enhanced debugging
    console.log('Claude API key status:', claudeApiKey ? 'Present' : 'Missing');
    console.log('API key length:', claudeApiKey?.length || 0);
    console.log('API key format check:', claudeApiKey?.startsWith('sk-ant-') ? 'Correct format' : 'Incorrect format');
    console.log('API key preview:', claudeApiKey?.substring(0, 15) + '...' + claudeApiKey?.substring(claudeApiKey.length - 4));

    const { video, customRequirements } = await req.json();
    
    console.log('Generating script for video:', video.title);
    console.log('Custom requirements:', customRequirements);

    const systemPrompt = `You are an expert viral content creator and script writer. Your task is to create engaging, platform-optimized scripts that have the potential to go viral based on successful viral video patterns.

Key principles:
- Hook viewers within the first 3 seconds
- Create pattern interrupts and curiosity gaps
- Use proven viral formats and psychological triggers
- Match the energy and tone of successful content
- Include clear calls-to-action
- Optimize for platform algorithms (retention, engagement)`;

    const userPrompt = `Based on this VIRAL VIDEO DATA:
- Title: ${video.title}
- Hook Type: ${video.hookType}
- Industry: ${video.industry}
- Viral Score: ${video.viralScore}/10
- Views: ${video.views}
- Engagement Rate: ${((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%
- Original Caption: ${video.caption}
- Original Script: ${video.script || video.originalScript || 'Not available'}
- Why This Works: ${video.whyThisWorks}

CREATE A CUSTOM SCRIPT with these requirements:
- Target Audience: ${customRequirements.targetAudience}
- Brand/Product: ${customRequirements.brand}
- Duration: ${customRequirements.duration}
- Voice Tone: ${customRequirements.voiceTone}

IMPORTANT: Use the successful elements from the original viral video (hook style, engagement tactics, viral triggers) and the original script structure but adapt them for the new brand/audience.

Format your response EXACTLY like this:

**HOOK (First 3-5 seconds):**
[Write an attention-grabbing opening that uses the same hook type as the original viral video]

**MAIN CONTENT:**
[Write the main body of the script, incorporating the brand/product naturally]

**CALL TO ACTION:**
[Write a clear, compelling CTA that drives the desired action]

**SUGGESTED HASHTAGS:**
[Provide 8-12 relevant hashtags for maximum reach]

**FULL CAPTION:**
[Write the complete caption ready to post]

Make it ${customRequirements.duration} appropriate and use a ${customRequirements.voiceTone} tone throughout.`;

    console.log('Making request to Claude API...');
    console.log('Request headers will include Authorization with key length:', claudeApiKey.length);

    const requestBody = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        { 
          role: 'user', 
          content: `${systemPrompt}\n\n${userPrompt}` 
        }
      ]
    };

    console.log('Request body prepared, making API call...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey, // Changed from Authorization to x-api-key
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Claude API response status:', response.status);
    console.log('Claude API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error response:', errorText);
      console.error('Response status:', response.status, response.statusText);
      throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Claude API response received successfully');
    console.log('Response structure:', Object.keys(data));
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from Claude API');
    }

    const generatedScript = data.content[0].text;
    console.log('Script generated successfully, length:', generatedScript.length);

    return new Response(JSON.stringify({ 
      success: true,
      generatedScript,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating script:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
