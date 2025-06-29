
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  target_audience: string | null;
  call_to_action: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        setBrands([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        title: "Error",
        description: "Failed to fetch brands. Please make sure you're logged in.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brandData: Omit<Brand, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create brands",
          variant: "destructive"
        });
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('brands')
        .insert({
          ...brandData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setBrands(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Brand created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating brand:', error);
      if (error instanceof Error && error.message !== 'No authenticated user') {
        toast({
          title: "Error",
          description: "Failed to create brand",
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const updateBrand = async (id: string, updates: Partial<Brand>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update brands",
          variant: "destructive"
        });
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('brands')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBrands(prev => prev.map(brand => brand.id === id ? data : brand));
      toast({
        title: "Success",
        description: "Brand updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating brand:', error);
      if (error instanceof Error && error.message !== 'No authenticated user') {
        toast({
          title: "Error",
          description: "Failed to update brand",
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to delete brands",
          variant: "destructive"
        });
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBrands(prev => prev.filter(brand => brand.id !== id));
      toast({
        title: "Success",
        description: "Brand deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting brand:', error);
      if (error instanceof Error && error.message !== 'No authenticated user') {
        toast({
          title: "Error",
          description: "Failed to delete brand",
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    loading,
    createBrand,
    updateBrand,
    deleteBrand,
    refetch: fetchBrands
  };
};
