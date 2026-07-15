-- Migration: Remove Phone Contact Method Reference
-- Database column contact_method on orders table is VARCHAR(50).
-- No destructive schema changes or constraint updates are needed.
-- Existing 'call' contact method entries are preserved as Legacy data.

-- This file document is created to satisfy migration guidelines.
-- You can run the comment update below to document this change in Supabase metadata:

COMMENT ON COLUMN orders.contact_method IS 'Preferred contact method: whatsapp, email (call is deprecated/legacy)';
