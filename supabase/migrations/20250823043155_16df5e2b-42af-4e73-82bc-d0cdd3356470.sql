-- ================================================
-- COMPREHENSIVE SPOTIFY ADMIN PANEL DATABASE SETUP
-- ================================================

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.kyc_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');
CREATE TYPE public.document_type AS ENUM ('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.bot_status AS ENUM ('active', 'inactive', 'paused', 'error');

-- ================================================
-- AUTHENTICATION & USER MANAGEMENT TABLES
-- ================================================

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  spotify_id TEXT,
  spotify_access_token TEXT,
  spotify_refresh_token TEXT,
  spotify_connected_at TIMESTAMP WITH TIME ZONE
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Admin users table (for admin-specific data)
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  employee_id TEXT UNIQUE,
  department TEXT,
  permissions JSONB DEFAULT '{}',
  two_factor_enabled BOOLEAN DEFAULT false,
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- KYC & VERIFICATION TABLES
-- ================================================

-- KYC documents table
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  status kyc_status DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- SPOTIFY & MUSIC TABLES
-- ================================================

-- Playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  spotify_playlist_id TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  track_count INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- in seconds
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  spotify_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Tracks table
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_track_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  artists JSONB DEFAULT '[]', -- array of artist objects
  album_name TEXT,
  album_image_url TEXT,
  duration_ms INTEGER,
  preview_url TEXT,
  external_urls JSONB DEFAULT '{}',
  popularity INTEGER,
  explicit BOOLEAN DEFAULT false,
  spotify_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlist tracks (many-to-many relationship)
CREATE TABLE public.playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id),
  position INTEGER,
  UNIQUE(playlist_id, track_id)
);

-- User listening sessions
CREATE TABLE public.listening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.tracks(id),
  playlist_id UUID REFERENCES public.playlists(id),
  duration_listened INTEGER DEFAULT 0, -- in seconds
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  device_info JSONB DEFAULT '{}',
  ip_address INET
);

-- User rewards and points
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points_earned INTEGER DEFAULT 0,
  points_spent INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_listening_time INTEGER DEFAULT 0, -- in seconds
  total_sessions INTEGER DEFAULT 0,
  last_reward_earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward transactions
CREATE TABLE public.reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earned', 'spent', 'bonus'
  points INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- can reference listening session, etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- FINANCIAL TRANSACTIONS
-- ================================================

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status transaction_status DEFAULT 'pending',
  transaction_type TEXT NOT NULL, -- 'reward_purchase', 'subscription', 'refund'
  payment_method TEXT,
  gateway_reference TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- BOT MANAGEMENT
-- ================================================

-- Bot configurations
CREATE TABLE public.bot_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status bot_status DEFAULT 'inactive',
  config JSONB DEFAULT '{}',
  spotify_settings JSONB DEFAULT '{}',
  reward_settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  last_modified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bot execution logs
CREATE TABLE public.bot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_config_id UUID REFERENCES public.bot_configs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  execution_time INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- SYSTEM SETTINGS & AUDIT
-- ================================================

-- System settings
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- STORAGE BUCKETS
-- ================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('kyc-documents', 'kyc-documents', false),
  ('user-avatars', 'user-avatars', true),
  ('playlist-covers', 'playlist-covers', true),
  ('admin-uploads', 'admin-uploads', false);

-- ================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role)
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- User roles policies
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Admin users policies
CREATE POLICY "Admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (public.is_admin(auth.uid()));

-- KYC documents policies
CREATE POLICY "Users can manage their own KYC documents"
  ON public.kyc_documents FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all KYC documents"
  ON public.kyc_documents FOR ALL
  USING (public.is_admin(auth.uid()));

-- Playlists policies
CREATE POLICY "Users can manage their own playlists"
  ON public.playlists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all playlists"
  ON public.playlists FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Tracks policies
CREATE POLICY "Tracks are viewable by authenticated users"
  ON public.tracks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage tracks"
  ON public.tracks FOR ALL
  USING (public.is_admin(auth.uid()));

-- Playlist tracks policies
CREATE POLICY "Users can manage their playlist tracks"
  ON public.playlist_tracks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all playlist tracks"
  ON public.playlist_tracks FOR ALL
  USING (public.is_admin(auth.uid()));

-- Listening sessions policies
CREATE POLICY "Users can manage their own listening sessions"
  ON public.listening_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listening sessions"
  ON public.listening_sessions FOR SELECT
  USING (public.is_admin(auth.uid()));

-- User rewards policies
CREATE POLICY "Users can view their own rewards"
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update user rewards"
  ON public.user_rewards FOR UPDATE
  USING (true);

CREATE POLICY "Admins can manage all user rewards"
  ON public.user_rewards FOR ALL
  USING (public.is_admin(auth.uid()));

-- Reward transactions policies
CREATE POLICY "Users can view their own reward transactions"
  ON public.reward_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert reward transactions"
  ON public.reward_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all reward transactions"
  ON public.reward_transactions FOR ALL
  USING (public.is_admin(auth.uid()));

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions"
  ON public.transactions FOR ALL
  USING (public.is_admin(auth.uid()));

-- Bot configs policies
CREATE POLICY "Admins can manage bot configs"
  ON public.bot_configs FOR ALL
  USING (public.is_admin(auth.uid()));

-- Bot logs policies
CREATE POLICY "Admins can view bot logs"
  ON public.bot_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert bot logs"
  ON public.bot_logs FOR INSERT
  WITH CHECK (true);

-- System settings policies
CREATE POLICY "Public settings are viewable by all authenticated users"
  ON public.system_settings FOR SELECT
  USING (auth.role() = 'authenticated' AND is_public = true);

CREATE POLICY "Admins can manage all system settings"
  ON public.system_settings FOR ALL
  USING (public.is_admin(auth.uid()));

-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- ================================================
-- STORAGE POLICIES
-- ================================================

-- KYC documents storage policies
CREATE POLICY "Users can upload their own KYC documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own KYC documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all KYC documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' AND
    public.is_admin(auth.uid())
  );

-- User avatars storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Playlist covers storage policies
CREATE POLICY "Playlist covers are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'playlist-covers');

CREATE POLICY "Users can upload playlist covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'playlist-covers' AND auth.role() = 'authenticated');

-- Admin uploads storage policies
CREATE POLICY "Admins can manage admin uploads"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'admin-uploads' AND
    public.is_admin(auth.uid())
  );

-- ================================================
-- TRIGGERS & FUNCTIONS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_rewards_updated_at
  BEFORE UPDATE ON public.user_rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_configs_updated_at
  BEFORE UPDATE ON public.bot_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create user rewards record
  INSERT INTO public.user_rewards (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET last_login = NOW() 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_spotify_id ON public.profiles(spotify_id);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- User roles indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- KYC documents indexes
CREATE INDEX idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX idx_kyc_documents_status ON public.kyc_documents(status);
CREATE INDEX idx_kyc_documents_created_at ON public.kyc_documents(created_at);

-- Playlists indexes
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlists_spotify_playlist_id ON public.playlists(spotify_playlist_id);
CREATE INDEX idx_playlists_created_at ON public.playlists(created_at);

-- Tracks indexes
CREATE INDEX idx_tracks_spotify_track_id ON public.tracks(spotify_track_id);
CREATE INDEX idx_tracks_name ON public.tracks(name);

-- Listening sessions indexes
CREATE INDEX idx_listening_sessions_user_id ON public.listening_sessions(user_id);
CREATE INDEX idx_listening_sessions_track_id ON public.listening_sessions(track_id);
CREATE INDEX idx_listening_sessions_started_at ON public.listening_sessions(started_at);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ================================================
-- SAMPLE DATA
-- ================================================

-- Insert default admin user (will be created when someone signs up with this email)
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
  ('default_admin_email', '"admin@spotify.com"', 'Default admin email for first admin user', 'auth', false),
  ('app_name', '"Spotify Admin Panel"', 'Application name', 'general', true),
  ('app_version', '"1.0.0"', 'Application version', 'general', true),
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode', 'general', false),
  ('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'general', false),
  ('default_reward_per_minute', '5', 'Default reward points per minute of listening', 'rewards', false),
  ('spotify_api_rate_limit', '100', 'Spotify API requests per minute limit', 'spotify', false);

-- Insert default bot configuration
INSERT INTO public.bot_configs (name, description, status, config, spotify_settings, reward_settings) VALUES
  ('Default Playtime Bot', 'Default bot configuration for music playtime tracking', 'active', 
   '{"enabled": true, "auto_start": true}',
   '{"track_listening_time": true, "sync_playlists": true, "update_frequency": 300}',
   '{"points_per_minute": 5, "bonus_multiplier": 1.5, "daily_bonus": 50}');