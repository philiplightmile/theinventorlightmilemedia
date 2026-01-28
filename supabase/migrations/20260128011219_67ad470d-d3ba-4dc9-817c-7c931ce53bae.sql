-- Add restrictive RLS policies for user_roles table to prevent privilege escalation
-- Only admins can insert, update, or delete user roles

CREATE POLICY "Only admins can insert roles" ON public.user_roles
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles" ON public.user_roles
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'::app_role));