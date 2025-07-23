export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          category_id: string | null
          name: string
          brand: string | null
          price: number
          currency: string
          description: string | null
          images: string[]
          item_image_id: string | null
          metadata: Json
          hint_1: string | null
          hint_2: string | null
          hint_3: string | null
          hint_4: string | null
          hint_5: string | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          brand?: string | null
          price: number
          currency?: string
          description?: string | null
          images: string[]
          item_image_id?: string | null
          metadata?: Json
          hint_1?: string | null
          hint_2?: string | null
          hint_3?: string | null
          hint_4?: string | null
          hint_5?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          brand?: string | null
          price?: number
          currency?: string
          description?: string | null
          images?: string[]
          item_image_id?: string | null
          metadata?: Json
          hint_1?: string | null
          hint_2?: string | null
          hint_3?: string | null
          hint_4?: string | null
          hint_5?: string | null
          created_at?: string
        }
      }
      item_images: {
        Row: {
          id: string
          image_data: string
          created_at: string
        }
        Insert: {
          id?: string
          image_data: string
          created_at?: string
        }
        Update: {
          id?: string
          image_data?: string
          created_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string | null
          item_id: string | null
          guesses: Json[]
          attempts: number
          won: boolean
          accuracy: number | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          item_id?: string | null
          guesses?: Json[]
          attempts?: number
          won?: boolean
          accuracy?: number | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          item_id?: string | null
          guesses?: Json[]
          attempts?: number
          won?: boolean
          accuracy?: number | null
          completed_at?: string | null
          created_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string | null
          game_session_id: string | null
          category_id: string | null
          accuracy: number
          attempts: number
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          game_session_id?: string | null
          category_id?: string | null
          accuracy: number
          attempts: number
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          game_session_id?: string | null
          category_id?: string | null
          accuracy?: number
          attempts?: number
          points?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          code: string
          name: string
          description: string
          icon: string | null
          condition_type: string
          condition_value: Json
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description: string
          icon?: string | null
          condition_type: string
          condition_value: Json
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string
          icon?: string | null
          condition_type?: string
          condition_value?: Json
          points?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string | null
          achievement_id: string | null
          unlocked_at: string
          game_session_id: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          achievement_id?: string | null
          unlocked_at?: string
          game_session_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          achievement_id?: string | null
          unlocked_at?: string
          game_session_id?: string | null
        }
      }
      user_stats: {
        Row: {
          user_id: string
          total_games: number
          games_won: number
          total_points: number
          total_accuracy: number
          best_accuracy: number
          current_streak: number
          best_streak: number
          last_played_at: string | null
          category_stats: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          total_games?: number
          games_won?: number
          total_points?: number
          total_accuracy?: number
          best_accuracy?: number
          current_streak?: number
          best_streak?: number
          last_played_at?: string | null
          category_stats?: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_games?: number
          games_won?: number
          total_points?: number
          total_accuracy?: number
          best_accuracy?: number
          current_streak?: number
          best_streak?: number
          last_played_at?: string | null
          category_stats?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_stats_on_game_complete: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}