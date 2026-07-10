-- Run this in your Supabase SQL Editor to fix the Security Warning

-- This command changes the function so that it runs with the permissions of the 
-- person calling it (SECURITY INVOKER), rather than the person who created it.
-- This instantly resolves the "Public Can Execute SECURITY DEFINER Function" warning.

ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;
