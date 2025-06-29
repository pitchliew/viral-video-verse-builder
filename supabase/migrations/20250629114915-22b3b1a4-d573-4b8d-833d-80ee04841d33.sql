
-- Create a table to store brand information
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  target_audience TEXT,
  call_to_action TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own brands" 
  ON public.brands 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brands" 
  ON public.brands 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands" 
  ON public.brands 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands" 
  ON public.brands 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_brands_user_id ON public.brands(user_id);
CREATE INDEX idx_brands_created_at ON public.brands(created_at DESC);

-- Add brand_id reference to saved_scripts table
ALTER TABLE public.saved_scripts ADD COLUMN brand_id UUID REFERENCES public.brands(id);
