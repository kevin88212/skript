export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          address: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          address?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          address?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          total: number;
          delivery_address: string;
          rider_name: string | null;
          rider_lat: number | null;
          rider_lng: number | null;
          estimated_minutes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          total: number;
          delivery_address: string;
          rider_name?: string | null;
          rider_lat?: number | null;
          rider_lng?: number | null;
          estimated_minutes?: number | null;
          created_at?: string;
        };
        Update: {
          status?: string;
          rider_lat?: number | null;
          rider_lng?: number | null;
          estimated_minutes?: number | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          item_id: string;
          item_name: string;
          item_emoji: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          item_id: string;
          item_name: string;
          item_emoji: string;
          quantity: number;
          price: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
