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
      edits: {
        Row: {
          created_at: string
          edit_number: number
          generation_metadata: Json | null
          id: string
          input_image_url: string
          is_successful: boolean
          output_image_url: string
          project_id: string
          prompt: string
        }
        Insert: {
          created_at?: string
          edit_number: number
          generation_metadata?: Json | null
          id?: string
          input_image_url: string
          is_successful?: boolean
          output_image_url: string
          project_id: string
          prompt: string
        }
        Update: {
          created_at?: string
          edit_number?: number
          generation_metadata?: Json | null
          id?: string
          input_image_url?: string
          is_successful?: boolean
          output_image_url?: string
          project_id?: string
          prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "edits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean
          name: string
          original_image_metadata: Json | null
          original_image_url: string
          project_settings: Json | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name: string
          original_image_metadata?: Json | null
          original_image_url: string
          project_settings?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          original_image_metadata?: Json | null
          original_image_url?: string
          project_settings?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type exports
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type Edit = Database['public']['Tables']['edits']['Row'];
export type EditInsert = Database['public']['Tables']['edits']['Insert'];
export type EditUpdate = Database['public']['Tables']['edits']['Update'];