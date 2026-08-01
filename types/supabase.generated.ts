export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      plans: {
        Row: {
          id: string;
          code: string;
          name: string;
          price_cents: number;
          currency: string;
          interval: string;
          monthly_report_limit: number | null;
          monthly_search_limit: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          price_cents?: number;
          currency?: string;
          interval?: string;
          monthly_report_limit?: number | null;
          monthly_search_limit?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          price_cents?: number;
          currency?: string;
          interval?: string;
          monthly_report_limit?: number | null;
          monthly_search_limit?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          plan: string | null;
          subscription_status: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          subscription_id: string | null;
          renewal_date: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          plan?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          subscription_id?: string | null;
          renewal_date?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          plan?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          subscription_id?: string | null;
          renewal_date?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          feature_key: string;
          usage_count: number;
          period_start: string;
          period_end: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feature_key: string;
          usage_count?: number;
          period_start: string;
          period_end: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          feature_key?: string;
          usage_count?: number;
          period_start?: string;
          period_end?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_limits: {
        Row: {
          id: string;
          plan_id: string;
          feature_key: string;
          period: string;
          limit_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          feature_key: string;
          period?: string;
          limit_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          feature_key?: string;
          period?: string;
          limit_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      billing_events: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          event_type: string;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          event_type: string;
          payload?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          event_type?: string;
          payload?: Json | null;
          created_at?: string;
        };
      };
    } & {
      [tableName: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};
