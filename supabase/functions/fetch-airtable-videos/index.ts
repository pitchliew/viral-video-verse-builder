
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
    
    const airtableToken = Deno.env.get('AIRTABLE_ID_V2');
    
    if (!airtableToken) {
      console.error('Airtable token not found in environment variables');
      throw new Error('Airtable token not found in environment variables');
    }

    console.log('Airtable token found, making request...');

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
    // Based on the logs, I'll map the actual field names from your Airtable
    const videos = data.records.map((record: any, index: number) => {
      console.log(`Processing record ${index}:`, record.fields);
      
      const fields = record.fields;
      
      return {
        id: record.id,
        videoUrl: fields['Video Url'] || fields['Video URL'] || fields['_Video Url'] || '',
        thumbnailUrl: fields['thumbnail'] && fields['thumbnail'][0] ? fields['thumbnail'][0].url : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
        author: fields['username'] || fields['Author'] || 'Unknown Author',
        caption: fields['Caption*'] || fields['captions'] || fields['Caption'] || '',
        views: Number(fields['Views*']?.replace(/[K|M]/g, '').replace(/K/g, '000').replace(/M/g, '000000')) || Number(fields['_Views']) || Number(fields['Views']) || 0,
        likes: Number(fields['Likes*']?.replace(/[K|M]/g, '').replace(/K/g, '000').replace(/M/g, '000000')) || Number(fields['_Likes']) || Number(fields['Likes']) || 0,
        comments: Number(fields['Comments*']) || Number(fields['comments']) || Number(fields['Comments']) || 0,
        shares: Number(fields['Shares']) || 0,
        followers: fields['Followers*'] || fields['followers'] || 0,
        hookType: fields['Hook type*'] || fields['hook type'] || fields['Hook Type'] || 'Unknown',
        industry: fields['Industry/Niche*'] && Array.isArray(fields['Industry/Niche*']) ? fields['Industry/Niche*'][0] : fields['industry/niche'] || fields['Industry'] || 'Unknown',
        videoObjective: fields['Video Objective'] || 'Unknown',
        title: fields['Reel Title'] || fields['Title'] || 'Untitled Video',
        whyThisWorks: fields['Why this works*'] || fields['why this works'] || 'Analysis not available',
        viralScore: Number(fields['Viral Score']) || 0
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
