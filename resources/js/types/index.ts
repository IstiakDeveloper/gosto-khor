export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    organization_id: number | null;
    phone?: string | null;
    address?: string | null;
    photo?: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
  }

  export interface Role {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
  }

  export interface Permission {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
  }

  export interface Organization {
    id: number;
    name: string;
    domain: string;
    description?: string | null;
    logo?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at: string;
    updated_at: string;
    active_subscription?: Subscription;
  }

  export interface Subscription {
    id: number;
    organization_id: number;
    subscription_plan_id: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    status: string;
    amount_paid: number;
    payment_method?: string | null;
    transaction_id?: string | null;
    created_at: string;
    updated_at: string;
    plan?: SubscriptionPlan;
    remaining_days?: number;
  }

  export interface SubscriptionPlan {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    billing_cycle: 'monthly' | 'quarterly' | 'yearly';
    max_organizations: number;
    max_somitis: number;
    max_members: number;
    features?: string[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    duration_in_months?: number;
    formatted_price?: string;
  }

  export interface Somiti {
    id: number;
    organization_id: number;
    name: string;
    type: 'monthly' | 'weekly' | 'daily';
    collection_day?: number | null;
    amount: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    collection_day_name?: string;
    members_count?: number;
    members?: Member[];
  }

  export interface Member {
    id: number;
    organization_id: number;
    name: string;
    address?: string | null;
    phone: string;
    photo?: string | null;
    email?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    somitis_count?: number;
    somitis?: Somiti[];
    pivot?: {
      due_amount: number;
      is_active: boolean;
    };
  }

  export interface Payment {
    id: number;
    somiti_id: number;
    member_id: number;
    amount: number;
    payment_date: string;
    collection_date: string;
    status: 'pending' | 'paid' | 'failed';
    payment_method?: string | null;
    transaction_id?: string | null;
    notes?: string | null;
    created_by?: number | null;
    created_at: string;
    updated_at: string;
    somiti?: Somiti;
    member?: Member;
    created_by_user?: User;
  }

  export interface PaginatedData<T> {
    data: T[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  }
