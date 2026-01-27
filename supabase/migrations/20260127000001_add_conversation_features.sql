-- Migration: Add conversation features (soft delete, bookmarking, sharing)
-- Created: 2026-01-27

-- 1. Add new columns to conversations table
ALTER TABLE conversations
ADD COLUMN is_deleted BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN is_bookmarked BOOLEAN DEFAULT false NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN conversations.is_deleted IS 'Soft delete flag - conversations remain in database but are hidden from normal queries';
COMMENT ON COLUMN conversations.is_bookmarked IS 'User bookmark flag - allows users to mark important conversations';

-- 2. Create conversation_shares table for sharing functionality
CREATE TABLE IF NOT EXISTS conversation_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token VARCHAR(16) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add table comment
COMMENT ON TABLE conversation_shares IS 'Tracks shared conversations with unique tokens for access control';
COMMENT ON COLUMN conversation_shares.id IS 'Unique identifier for the share record';
COMMENT ON COLUMN conversation_shares.conversation_id IS 'Reference to the shared conversation';
COMMENT ON COLUMN conversation_shares.user_id IS 'User who owns/created the share';
COMMENT ON COLUMN conversation_shares.share_token IS 'Unique token for accessing the shared conversation';
COMMENT ON COLUMN conversation_shares.is_active IS 'Whether this share is currently active (can be deactivated)';
COMMENT ON COLUMN conversation_shares.created_at IS 'Timestamp when share was created';

-- 3. Create indexes for performance
CREATE INDEX idx_conversation_shares_conversation_id
  ON conversation_shares(conversation_id);

CREATE INDEX idx_conversation_shares_user_id
  ON conversation_shares(user_id);

CREATE INDEX idx_conversation_shares_token
  ON conversation_shares(share_token);

-- Index for faster filtering of active shares
CREATE INDEX idx_conversation_shares_active
  ON conversation_shares(is_active)
  WHERE is_active = true;

-- Index for deleted conversations (soft delete optimization)
CREATE INDEX idx_conversations_deleted
  ON conversations(is_deleted)
  WHERE is_deleted = false;

-- 4. Enable Row Level Security on conversation_shares
ALTER TABLE conversation_shares ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Public can SELECT shares that are active
CREATE POLICY "public_can_view_active_shares"
  ON conversation_shares
  FOR SELECT
  USING (is_active = true);

-- 6. RLS Policy: Users can INSERT their own shares
CREATE POLICY "users_can_insert_shares"
  ON conversation_shares
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. RLS Policy: Users can UPDATE their own shares
CREATE POLICY "users_can_update_own_shares"
  ON conversation_shares
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. RLS Policy: Users can DELETE their own shares
CREATE POLICY "users_can_delete_own_shares"
  ON conversation_shares
  FOR DELETE
  USING (auth.uid() = user_id);

-- 9. Update existing conversations RLS policy to filter deleted records
-- Note: This assumes you have an existing SELECT policy on conversations.
-- If your current policy is named differently, adjust accordingly.
-- Dropping and recreating the policy to include is_deleted filter
-- This statement assumes the policy is named something like "users_can_view_own_conversations"
-- You may need to adjust the policy name based on your existing setup

-- Example: If you have this policy, we need to modify it:
-- ALTER POLICY "users_can_view_own_conversations" ON conversations
-- USING (auth.uid() = user_id AND is_deleted = false);

-- For now, we'll create a new policy that filters on is_deleted
-- Make sure to drop any conflicting policies after reviewing
CREATE POLICY "conversations_not_deleted"
  ON conversations
  USING (is_deleted = false);

-- Grant necessary permissions for authenticated users
-- These may already exist but ensure they're in place
GRANT SELECT ON conversation_shares TO authenticated;
GRANT INSERT ON conversation_shares TO authenticated;
GRANT UPDATE ON conversation_shares TO authenticated;
GRANT DELETE ON conversation_shares TO authenticated;
