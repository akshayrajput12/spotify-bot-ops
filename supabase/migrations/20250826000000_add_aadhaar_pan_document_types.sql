-- Add Aadhaar and PAN document types to the document_type ENUM
-- This migration adds new values to the existing ENUM type

-- First, we need to add the new values to the ENUM type
ALTER TYPE public.document_type ADD VALUE 'aadhaar';
ALTER TYPE public.document_type ADD VALUE 'pan';

-- Note: In PostgreSQL, you cannot remove values from an ENUM type
-- If you need to remove the old values, you would need to:
-- 1. Create a new ENUM type with only the desired values
-- 2. Update all columns using the old type to use the new type
-- 3. Drop the old type
-- 4. Rename the new type to the old name

-- For now, we're just adding the new values to maintain backward compatibility