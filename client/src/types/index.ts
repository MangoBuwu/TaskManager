export interface User {
  id: number;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  requires_location: boolean;
  created_at: string;
}

export interface Location {
  id: number;
  code: string;
  description?: string;
  created_at: string;
}

export interface DailyAssignment {
  id: number;
  user_id: number;
  user_name: string;
  activity_id: number;
  activity_name: string;
  location_id?: number;
  location_code?: string;
  location_description?: string;
  assigned_date: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
  requires_location: boolean;
}

export interface ActivityHistory {
  id: number;
  user_id: number;
  user_name: string;
  activity_id: number;
  activity_name: string;
  location_id?: number;
  location_code?: string;
  location_description?: string;
  date: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
}

export interface Absence {
  id: number;
  user_id: number;
  user_name?: string;
  date: string;
  reason?: string;
  created_at: string;
}

export interface DashboardSummary {
  total_assignments: number;
  completed_assignments: number;
  pending_assignments: number;
}

export interface DashboardData {
  date: string;
  summary: DashboardSummary;
  activities: Array<{
    activity_name: string;
    count: number;
    completed: number;
  }>;
  users: Array<{
    user_name: string;
    total_tasks: number;
    completed_tasks: number;
  }>;
  absences: {
    absent_count: number;
  };
}

export interface LocationProgress {
  location_code: string;
  location_description?: string;
  activities: Array<{
    activity_name: string;
    activity_id: number;
    completed_count: number;
    expected_count: number;
    progress_percentage: number;
    status: 'completed' | 'pending';
  }>;
}

export interface LocationProgressReport {
  month: number;
  year: number;
  locations: LocationProgress[];
}

export interface ActivitySummary {
  activity: Activity;
  month: number;
  year: number;
  locations: Array<{
    location_code: string;
    location_description?: string;
    completed_count: number;
    unique_days: number;
    last_completed?: string;
  }>;
}

export interface MonthlyStats {
  month: number;
  year: number;
  total_completed: number;
  activity_breakdown: Array<{
    activity_name: string;
    count: number;
  }>;
  user_performance: Array<{
    user_name: string;
    tasks_completed: number;
    active_days: number;
  }>;
  total_absences: number;
}

export interface UserHistory {
  activities: Array<{
    date: string;
    completed: boolean;
    completed_at?: string;
    notes?: string;
    activity_name: string;
    location_code?: string;
    location_description?: string;
  }>;
  absences: Array<{
    date: string;
    reason?: string;
  }>;
}