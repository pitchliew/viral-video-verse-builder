
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
- Why This Works: ${video.whyThisWorks}

CREATE A CUSTOM SCRIPT with these requirements:
- Target Audience: ${customRequirements.targetAudience}
- Brand/Product: ${customRequirements.brand}
- Duration: ${customRequirements.duration}
- Voice Tone: ${customRequirements.voiceTone}

IMPORTANT: Use the successful elements from the original viral video (hook style, engagement tactics, viral triggers) but adapt them for the new brand/audience.

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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${claudeApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedScript = data.content[0].text;

    console.log('Script generated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      generatedScript,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating script:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
