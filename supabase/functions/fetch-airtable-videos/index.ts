
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
    const videos = data.records.map((record: any, index: number) => {
      console.log(`Processing record ${index}:`, record.fields);
      
      return {
        id: record.id,
        videoUrl: record.fields['Video URL'] || '',
        thumbnailUrl: record.fields['Thumbnail URL'] || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
        author: record.fields['Author'] || 'Unknown Author',
        caption: record.fields['Caption'] || '',
        views: Number(record.fields['Views']) || 0,
        likes: Number(record.fields['Likes']) || 0,
        comments: Number(record.fields['Comments']) || 0,
        shares: Number(record.fields['Shares']) || 0,
        followers: Number(record.fields['Followers']) || 0,
        hookType: record.fields['Hook Type'] || 'Unknown',
        industry: record.fields['Industry'] || 'Unknown',
        videoObjective: record.fields['Video Objective'] || 'Unknown',
        title: record.fields['Title'] || 'Untitled Video',
        whyThisWorks: record.fields['Why This Works'] || 'Analysis not available',
        viralScore: Number(record.fields['Viral Score']) || 0
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
