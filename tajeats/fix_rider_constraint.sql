-- Drop the old constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with RIDER included
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('ADMIN', 'CUSTOMER', 'RESTAURANT_OWNER', 'RIDER'));
