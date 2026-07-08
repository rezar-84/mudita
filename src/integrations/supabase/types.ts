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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      design_events: {
        Row: {
          created_at: string
          event: string
          id: string
          payload: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          payload?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          payload?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          color_id: string | null
          config: Json | null
          created_at: string
          font_id: string | null
          id: string
          image_url: string | null
          published: boolean
          slug: string
          sort: number
          tags: string[] | null
          text: string | null
          title: string
          updated_at: string
        }
        Insert: {
          color_id?: string | null
          config?: Json | null
          created_at?: string
          font_id?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          sort?: number
          tags?: string[] | null
          text?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          color_id?: string | null
          config?: Json | null
          created_at?: string
          font_id?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          sort?: number
          tags?: string[] | null
          text?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          breakdown: Json
          config: Json
          created_at: string
          id: string
          order_id: string
          price_try: number
        }
        Insert: {
          breakdown: Json
          config: Json
          created_at?: string
          id?: string
          order_id: string
          price_try: number
        }
        Update: {
          breakdown?: Json
          config?: Json
          created_at?: string
          id?: string
          order_id?: string
          price_try?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contact: Json | null
          created_at: string
          id: string
          notes: string | null
          shipping_try: number
          status: string
          subtotal_try: number
          total_try: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          shipping_try?: number
          status?: string
          subtotal_try?: number
          total_try?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          shipping_try?: number
          status?: string
          subtotal_try?: number
          total_try?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pricing_config: {
        Row: {
          accessories: Json | null
          adapter_prices: Json
          backboards: Json | null
          base_rate_per_cm2: number
          colors: Json | null
          decoration_preset_base: number
          decoration_upload_base: number
          extra_line_fee: number
          fonts: Json | null
          id: number
          mountings: Json | null
          outdoor_mult: number
          rgb_mult: number
          shipping_tr: number
          sizes: Json | null
          updated_at: string
          updated_by: string | null
          urgent_mult: number
        }
        Insert: {
          accessories?: Json | null
          adapter_prices?: Json
          backboards?: Json | null
          base_rate_per_cm2?: number
          colors?: Json | null
          decoration_preset_base?: number
          decoration_upload_base?: number
          extra_line_fee?: number
          fonts?: Json | null
          id?: number
          mountings?: Json | null
          outdoor_mult?: number
          rgb_mult?: number
          shipping_tr?: number
          sizes?: Json | null
          updated_at?: string
          updated_by?: string | null
          urgent_mult?: number
        }
        Update: {
          accessories?: Json | null
          adapter_prices?: Json
          backboards?: Json | null
          base_rate_per_cm2?: number
          colors?: Json | null
          decoration_preset_base?: number
          decoration_upload_base?: number
          extra_line_fee?: number
          fonts?: Json | null
          id?: number
          mountings?: Json | null
          outdoor_mult?: number
          rgb_mult?: number
          shipping_tr?: number
          sizes?: Json | null
          updated_at?: string
          updated_by?: string | null
          urgent_mult?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: Json | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_designs: {
        Row: {
          config: Json
          created_at: string
          id: string
          name: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          name?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          name?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
    }
    Enums: {
      app_role: "admin" | "customer"
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
      app_role: ["admin", "customer"],
    },
  },
} as const
