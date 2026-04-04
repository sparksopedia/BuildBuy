export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      rubrics: {
        Row: {
          id: string;
          org: string | null;
          title: string;
          description: string | null;
          author_name: string;
          dimensions: Json;
          scale: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          org?: string | null;
          title: string;
          description?: string | null;
          author_name: string;
          dimensions: Json;
          scale: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          org?: string | null;
          title?: string;
          description?: string | null;
          author_name?: string;
          dimensions?: Json;
          scale?: Json;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          rubric_id: string;
          evaluator_name: string;
          role: string | null;
          scores: Json;
          comment: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          rubric_id: string;
          evaluator_name: string;
          role?: string | null;
          scores: Json;
          comment?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          rubric_id?: string;
          evaluator_name?: string;
          role?: string | null;
          scores?: Json;
          comment?: string | null;
          submitted_at?: string;
        };
      };
      custom_dimensions: {
        Row: {
          id: string;
          author_key: string;
          name: string;
          desc: string | null;
          saved_at: string;
        };
        Insert: {
          id?: string;
          author_key: string;
          name: string;
          desc?: string | null;
          saved_at?: string;
        };
        Update: {
          id?: string;
          author_key?: string;
          name?: string;
          desc?: string | null;
          saved_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
