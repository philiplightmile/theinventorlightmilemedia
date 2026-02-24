
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a view (no auth required)
CREATE POLICY "Anyone can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

-- Only admins can read views
CREATE POLICY "Admins can view page views"
  ON public.page_views FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
