
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SavedScript {
  id: string;
  user_id: string;
  title: string;
  content: string;
  script_sections: any;
  original_video_data: any;
  created_at: string;
  updated_at: string;
}

export const useSavedScripts = () => {
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_scripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScripts(data || []);
    } catch (error) {
      console.error('Error fetching scripts:', error);
      toast({
        title: "Error",
        description: "Failed to load saved scripts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveScript = async (scriptData: {
    title: string;
    content: string;
    script_sections: any;
    original_video_data: any;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('saved_scripts')
        .insert([
          {
            ...scriptData,
            user_id: user.user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setScripts(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Script saved successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error saving script:', error);
      toast({
        title: "Error",
        description: "Failed to save script.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateScript = async (id: string, updates: Partial<SavedScript>) => {
    try {
      const { data, error } = await supabase
        .from('saved_scripts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setScripts(prev => prev.map(script => 
        script.id === id ? data : script
      ));

      toast({
        title: "Success",
        description: "Script updated successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error updating script:', error);
      toast({
        title: "Error",
        description: "Failed to update script.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteScript = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_scripts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setScripts(prev => prev.filter(script => script.id !== id));
      toast({
        title: "Success",
        description: "Script deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting script:', error);
      toast({
        title: "Error",
        description: "Failed to delete script.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  return {
    scripts,
    loading,
    saveScript,
    updateScript,
    deleteScript,
    refetch: fetchScripts,
  };
};
