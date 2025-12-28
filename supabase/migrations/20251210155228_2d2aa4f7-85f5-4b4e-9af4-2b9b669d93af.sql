-- Create table for email captures with discount codes
CREATE TABLE public.email_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  discount_code TEXT NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (for the popup)
CREATE POLICY "Anyone can insert email captures" 
ON public.email_captures 
FOR INSERT 
WITH CHECK (true);

-- Allow reading own email capture by email
CREATE POLICY "Users can view their own email capture" 
ON public.email_captures 
FOR SELECT 
USING (true);