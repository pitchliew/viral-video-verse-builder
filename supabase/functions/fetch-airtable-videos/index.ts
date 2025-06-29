
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Starting Airtable fetch...');
    
    // Use the new personal access token
    const airtableToken = 'patz2aNgR1k7yCu2a.002f5bcc28fb876dea2a6072ded3d987e47281c15847211420c36df69244ee32';
    
    console.log('Using personal access token for Airtable request...');

    const baseId = 'appgdsZTvVy6L3nhj';
    const tableName = 'tbll1vtFU4cf40F20';
    
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error response:', errorText);
      throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Airtable response data:', JSON.stringify(data, null, 2));
    
    // Check if records exist
    if (!data.records || !Array.isArray(data.records)) {
      console.error('No records found or invalid data structure:', data);
      throw new Error('No records found in Airtable response');
    }

    console.log(`Found ${data.records.length} records`);
    
    // Transform Airtable records to match your app's video interface
    const videos = data.records.map((record: any, index: number) => {
      console.log(`Processing record ${index}:`, record.fields);
      
      const fields = record.fields;
      
      // Helper function to safely extract string values from objects
      const safeString = (value: any): string => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && value.value) return String(value.value);
        return '';
      };

      // Helper function to safely extract numbers from formatted strings
      const safeNumber = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          // Handle formatted numbers like "93K", "1.2M"
          const cleanValue = value.replace(/[^\d.]/g, '');
          const num = parseFloat(cleanValue);
          if (value.includes('K')) return num * 1000;
          if (value.includes('M')) return num * 1000000;
          return num || 0;
        }
        return 0;
      };
      
      return {
        id: record.id,
        videoUrl: safeString(fields['Video Url'] || fields['Video URL'] || fields['_Video Url']) || '',
        thumbnailUrl: fields['thumbnail'] && fields['thumbnail'][0] ? fields['thumbnail'][0].url : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
        author: safeString(fields['username'] || fields['Author']) || 'Unknown Author',
        caption: safeString(fields['Caption*'] || fields['captions'] || fields['Caption']) || '',
        script: safeString(fields['Script*'] || fields['Script'] || fields['Output']) || '', // Added script mapping
        views: safeNumber(fields['Views*'] || fields['_Views'] || fields['Views']),
        likes: safeNumber(fields['Likes*'] || fields['_Likes'] || fields['Likes']),
        comments: safeNumber(fields['Comments*'] || fields['comments'] || fields['Comments']),
        shares: safeNumber(fields['Shares']) || 0,
        followers: safeString(fields['Followers*'] || fields['followers']) || '0',
        hookType: safeString(fields['Hook type*'] || fields['hook type'] || fields['Hook Type']) || 'Unknown',
        industry: fields['Industry/Niche*'] && Array.isArray(fields['Industry/Niche*']) ? fields['Industry/Niche*'][0] : safeString(fields['industry/niche'] || fields['Industry']) || 'Unknown',
        videoObjective: safeString(fields['Video Objective']) || 'Unknown',
        title: safeString(fields['Reel Title'] || fields['Title']) || 'Untitled Video',
        whyThisWorks: safeString(fields['Why this works*'] || fields['why this works']) || 'Analysis not available',
        viralScore: safeNumber(fields['Viral Score']) || 0
      };
    });

    console.log('Transformed videos:', videos.length);

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-airtable-videos:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
