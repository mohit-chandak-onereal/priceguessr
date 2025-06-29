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
          images: string[]
          metadata: Json
          ai_hints: string[]
          basic_info: Json
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
          images: string[]
          metadata: Json
          ai_hints: string[]
          basic_info?: Json
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
          images?: string[]
          metadata?: Json
          ai_hints?: string[]
          basic_info?: Json
          hint_1?: string | null
          hint_2?: string | null
          hint_3?: string | null
          hint_4?: string | null
          hint_5?: string | null
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
      daily_challenges: {
        Row: {
          date: string
          item_id: string | null
          created_at: string
        }
        Insert: {
          date: string
          item_id?: string | null
          created_at?: string
        }
        Update: {
          date?: string
          item_id?: string | null
          created_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string | null
          date: string
          accuracy: number
          attempts: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          accuracy: number
          attempts: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string
          accuracy?: number
          attempts?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}