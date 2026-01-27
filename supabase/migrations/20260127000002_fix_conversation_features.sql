-- Recovery migration: Add missing conversation features
-- This migration safely adds only missing components

-- 1. Add is_bookmarked column if not exists (is_deleted already exists from partial migration)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'conversations' 
    AND column_name = 'is_bookmarked'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE conversations ADD COLUMN is_bookmarked BOOLEAN DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add comments (safe to run multiple times)
COMMENT ON COLUMN conversations.is_deleted IS 'Soft delete flag - conversations remain in database but are hidden from normal queries';
COMMENT ON COLUMN conversations.is_bookmarked IS 'User bookmark flag - allows users to mark important conversations';

-- 2. Create conversation_shares table if not exists
CREATE TABLE IF NOT EXISTS conversation_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token VARCHAR(16) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add table comments
COMMENT ON TABLE conversation_shares IS 'Tracks shared conversations with unique tokens for access control';
COMMENT ON COLUMN conversation_shares.id IS 'Unique identifier for the share record';
COMMENT ON COLUMN conversation_shares.conversation_id IS 'Reference to the shared conversation';
COMMENT ON COLUMN conversation_shares.user_id IS 'User who owns/created the share';
COMMENT ON COLUMN conversation_shares.share_token IS 'Unique token for accessing the shared conversation';
COMMENT ON COLUMN conversation_shares.is_active IS 'Whether this share is currently active (can be deactivated)';
COMMENT ON COLUMN conversation_shares.created_at IS 'Timestamp when share was created';

-- 3. Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_conversation_shares_conversation_id
  ON conversation_shares(conversation_id);

CREATE INDEX IF NOT EXISTS idx_conversation_shares_user_id
  ON conversation_shares(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_shares_token
  ON conversation_shares(share_token);

CREATE INDEX IF NOT EXISTS idx_conversation_shares_active
  ON conversation_shares(is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_conversations_deleted
  ON conversations(is_deleted)
  WHERE is_deleted = false;

-- 4. Enable Row Level Security on conversation_shares (safe to run multiple times)
ALTER TABLE conversation_shares ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - drop if exists then create
DROP POLICY IF EXISTS "public_can_view_active_shares" ON conversation_shares;
CREATE POLICY "public_can_view_active_shares"
  ON conversation_shares
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "users_can_insert_shares" ON conversation_shares;
CREATE POLICY "users_can_insert_shares"
  ON conversation_shares
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_update_own_shares" ON conversation_shares;
CREATE POLICY "users_can_update_own_shares"
  ON conversation_shares
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_delete_own_shares" ON conversation_shares;
CREATE POLICY "users_can_delete_own_shares"
  ON conversation_shares
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Update conversations RLS to filter deleted records
DROP POLICY IF EXISTS "conversations_not_deleted" ON conversations;
CREATE POLICY "conversations_not_deleted"
  ON conversations
  FOR SELECT
  USING (is_deleted = false);

-- 7. Grant permissions (safe to run multiple times)
GRANT SELECT ON conversation_shares TO authenticated;
GRANT INSERT ON conversation_shares TO authenticated;
GRANT UPDATE ON conversation_shares TO authenticated;
GRANT DELETE ON conversation_shares TO authenticated;
