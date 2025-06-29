
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  videoUrl: string;
  videoLink?: string;  // Added video link field
  thumbnailUrl: string;
  author: string;
  caption: string;
  script: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  hookType: string;
  industry: string;
  videoObjective: string;
  title: string;
  whyThisWorks: string;
  viralScore: number;
}

export const useAirtableVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.functions.invoke('fetch-airtable-videos');

        if (error) {
          throw error;
        }

        if (data?.videos) {
          setVideos(data.videos);
        } else {
          throw new Error('No videos data received');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};
