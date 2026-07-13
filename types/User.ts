export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  
    plan: "Free" | "Pro" | "Business";
  
    created_at: string;
  }