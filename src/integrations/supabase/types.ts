export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          department: string | null
          employee_id: string | null
          id: string
          last_activity: string | null
          permissions: Json | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          id?: string
          last_activity?: string | null
          permissions?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          id?: string
          last_activity?: string | null
          permissions?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bot_configs: {
        Row: {
          config: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_modified_by: string | null
          name: string
          reward_settings: Json | null
          spotify_settings: Json | null
          status: Database["public"]["Enums"]["bot_status"] | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_by?: string | null
          name: string
          reward_settings?: Json | null
          spotify_settings?: Json | null
          status?: Database["public"]["Enums"]["bot_status"] | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_by?: string | null
          name?: string
          reward_settings?: Json | null
          spotify_settings?: Json | null
          status?: Database["public"]["Enums"]["bot_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bot_logs: {
        Row: {
          action: string
          bot_config_id: string | null
          created_at: string | null
          execution_time: number | null
          id: string
          message: string | null
          metadata: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          action: string
          bot_config_id?: string | null
          created_at?: string | null
          execution_time?: number | null
          id?: string
          message?: string | null
          metadata?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          action?: string
          bot_config_id?: string | null
          created_at?: string | null
          execution_time?: number | null
          id?: string
          message?: string | null
          metadata?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_logs_bot_config_id_fkey"
            columns: ["bot_config_id"]
            isOneToOne: false
            referencedRelation: "bot_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          file_name: string | null
          file_size: number | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["kyc_status"] | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          document_url?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      listening_sessions: {
        Row: {
          completed: boolean | null
          device_info: Json | null
          duration_listened: number | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          playlist_id: string | null
          started_at: string | null
          track_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          device_info?: Json | null
          duration_listened?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          playlist_id?: string | null
          started_at?: string | null
          track_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          device_info?: Json | null
          duration_listened?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          playlist_id?: string | null
          started_at?: string | null
          track_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listening_sessions_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listening_sessions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks: {
        Row: {
          added_at: string | null
          added_by: string | null
          id: string
          playlist_id: string | null
          position: number | null
          track_id: string | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          id?: string
          playlist_id?: string | null
          position?: number | null
          track_id?: string | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          id?: string
          playlist_id?: string | null
          position?: number | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_collaborative: boolean | null
          is_public: boolean | null
          last_synced_at: string | null
          name: string
          spotify_data: Json | null
          spotify_playlist_id: string | null
          total_duration: number | null
          track_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_collaborative?: boolean | null
          is_public?: boolean | null
          last_synced_at?: string | null
          name: string
          spotify_data?: Json | null
          spotify_playlist_id?: string | null
          total_duration?: number | null
          track_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_collaborative?: boolean | null
          is_public?: boolean | null
          last_synced_at?: string | null
          name?: string
          spotify_data?: Json | null
          spotify_playlist_id?: string | null
          total_duration?: number | null
          track_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          phone: string | null
          spotify_access_token: string | null
          spotify_connected_at: string | null
          spotify_id: string | null
          spotify_refresh_token: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          spotify_access_token?: string | null
          spotify_connected_at?: string | null
          spotify_id?: string | null
          spotify_refresh_token?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          spotify_access_token?: string | null
          spotify_connected_at?: string | null
          spotify_id?: string | null
          spotify_refresh_token?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reward_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          points: number
          reference_id: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          points: number
          reference_id?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          reference_id?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tracks: {
        Row: {
          album_image_url: string | null
          album_name: string | null
          artists: Json | null
          created_at: string | null
          duration_ms: number | null
          explicit: boolean | null
          external_urls: Json | null
          id: string
          name: string
          popularity: number | null
          preview_url: string | null
          spotify_data: Json | null
          spotify_track_id: string
        }
        Insert: {
          album_image_url?: string | null
          album_name?: string | null
          artists?: Json | null
          created_at?: string | null
          duration_ms?: number | null
          explicit?: boolean | null
          external_urls?: Json | null
          id?: string
          name: string
          popularity?: number | null
          preview_url?: string | null
          spotify_data?: Json | null
          spotify_track_id: string
        }
        Update: {
          album_image_url?: string | null
          album_name?: string | null
          artists?: Json | null
          created_at?: string | null
          duration_ms?: number | null
          explicit?: boolean | null
          external_urls?: Json | null
          id?: string
          name?: string
          popularity?: number | null
          preview_url?: string | null
          spotify_data?: Json | null
          spotify_track_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          gateway_reference: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id: string
          transaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          gateway_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id: string
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          gateway_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string | null
          id: string
          last_reward_earned_at: string | null
          level: number | null
          points_earned: number | null
          points_spent: number | null
          total_listening_time: number | null
          total_points: number | null
          total_sessions: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_reward_earned_at?: string | null
          level?: number | null
          points_earned?: number | null
          points_spent?: number | null
          total_listening_time?: number | null
          total_points?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_reward_earned_at?: string | null
          level?: number | null
          points_earned?: number | null
          points_spent?: number | null
          total_listening_time?: number | null
          total_points?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      bot_status: "active" | "inactive" | "paused" | "error"
      document_type:
        | "passport"
        | "drivers_license"
        | "national_id"
        | "utility_bill"
        | "bank_statement"
        | "aadhaar"
        | "pan"
      kyc_status: "pending" | "approved" | "rejected" | "under_review"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      bot_status: ["active", "inactive", "paused", "error"],
      document_type: [
        "passport",
        "drivers_license",
        "national_id",
        "utility_bill",
        "bank_statement",
      ],
      kyc_status: ["pending", "approved", "rejected", "under_review"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
    },
  },
} as const
