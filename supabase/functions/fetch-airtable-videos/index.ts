
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
    const airtableToken = Deno.env.get('AIRTABLE_ID_V2');
    
    if (!airtableToken) {
      throw new Error('Airtable token not found in environment variables');
    }

    const baseId = 'appgdsZTvVy6L3nhj';
    const tableName = 'tblQHcjJdKp5pY2wO'; // Your table ID
    
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Airtable records to match your app's video interface
    const videos = data.records.map((record: any) => ({
      id: record.id,
      videoUrl: record.fields['Video URL'] || '',
      thumbnailUrl: record.fields['Thumbnail URL'] || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
      author: record.fields['Author'] || 'Unknown Author',
      caption: record.fields['Caption'] || '',
      views: record.fields['Views'] || 0,
      likes: record.fields['Likes'] || 0,
      comments: record.fields['Comments'] || 0,
      shares: record.fields['Shares'] || 0,
      followers: record.fields['Followers'] || 0,
      hookType: record.fields['Hook Type'] || 'Unknown',
      industry: record.fields['Industry'] || 'Unknown',
      videoObjective: record.fields['Video Objective'] || 'Unknown',
      title: record.fields['Title'] || 'Untitled Video',
      whyThisWorks: record.fields['Why This Works'] || 'Analysis not available',
      viralScore: record.fields['Viral Score'] || 0
    }));

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Airtable data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
