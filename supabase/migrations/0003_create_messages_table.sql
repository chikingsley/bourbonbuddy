-- Create messages table
CREATE TABLE public.messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments to columns
COMMENT ON COLUMN public.messages.id IS 'Unique identifier for the message';
COMMENT ON COLUMN public.messages.sender_id IS 'ID of the user who sent the message, references profiles.id';
COMMENT ON COLUMN public.messages.receiver_id IS 'ID of the user who received the message, references profiles.id';
COMMENT ON COLUMN public.messages.content IS 'Content of the message';
COMMENT ON COLUMN public.messages.created_at IS 'Timestamp of when the message was created';

-- Add indexes for faster queries
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to select their own messages
CREATE POLICY "Allow users to select their own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Allow users to insert messages as themselves
CREATE POLICY "Allow users to insert messages as themselves"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Note: Deletion or Update of messages might be handled differently
-- e.g., soft delete or disallowing updates. For now, no explicit policies for these.
