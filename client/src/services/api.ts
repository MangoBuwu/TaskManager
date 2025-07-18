import {
  mockUserService,
  mockActivityService,
  mockLocationService,
  mockAssignmentService,
  mockHistoryService,
  mockDashboardService
} from './mockApi';

// Use mock services for GitHub Pages deployment
export const userService = mockUserService;
export const activityService = mockActivityService;
export const locationService = mockLocationService;
export const assignmentService = mockAssignmentService;
export const historyService = mockHistoryService;
export const dashboardService = mockDashboardService;

// Keep the original API for reference (commented out)
/*
import axios from 'axios';
import type {
  User,
  Activity,
  Location,
  DailyAssignment,
  ActivityHistory,
  Absence,
  DashboardData,
  LocationProgressReport,
  ActivitySummary,
  MonthlyStats,
  UserHistory,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Users
export const userService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<User>('/users', user),
  update: (id: number, user: Partial<User>) => 
    api.put<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Activities
export const activityService = {
  getAll: () => api.get<Activity[]>('/activities'),
  getById: (id: number) => api.get<Activity>(`/activities/${id}`),
  create: (activity: Omit<Activity, 'id' | 'created_at'>) => 
    api.post<Activity>('/activities', activity),
  update: (id: number, activity: Partial<Activity>) => 
    api.put<Activity>(`/activities/${id}`, activity),
  delete: (id: number) => api.delete(`/activities/${id}`),
};

// Locations
export const locationService = {
  getAll: () => api.get<Location[]>('/locations'),
  getById: (id: number) => api.get<Location>(`/locations/${id}`),
  create: (location: Omit<Location, 'id' | 'created_at'>) => 
    api.post<Location>('/locations', location),
  update: (id: number, location: Partial<Location>) => 
    api.put<Location>(`/locations/${id}`, location),
  delete: (id: number) => api.delete(`/locations/${id}`),
};

// Assignments
export const assignmentService = {
  getByDate: (date?: string) => 
    api.get<DailyAssignment[]>('/assignments', { params: { date } }),
  create: (assignment: Omit<DailyAssignment, 'id' | 'user_name' | 'activity_name' | 'location_code' | 'location_description' | 'requires_location'>) => 
    api.post<DailyAssignment>('/assignments', assignment),
  update: (id: number, assignment: Partial<DailyAssignment>) => 
    api.put<DailyAssignment>(`/assignments/${id}`, assignment),
  delete: (id: number) => api.delete(`/assignments/${id}`),
  markAbsence: (absence: { user_id: number; date: string; reason?: string }) => 
    api.post<Absence>('/assignments/absence', absence),
  getAbsences: (params?: { start_date?: string; end_date?: string; user_id?: number }) => 
    api.get<Absence[]>('/assignments/absences', { params }),
};

// History
export const historyService = {
  getAll: (params?: { 
    start_date?: string; 
    end_date?: string; 
    user_id?: number; 
    activity_id?: number; 
    location_id?: number; 
  }) => api.get<ActivityHistory[]>('/history', { params }),
  getUserHistory: (userId: number, params?: { start_date?: string; end_date?: string }) => 
    api.get<UserHistory>(`/history/user/${userId}`, { params }),
  archive: (date?: string) => 
    api.post('/history/archive', { date }),
};

// Dashboard
export const dashboardService = {
  getOverview: (date?: string) => 
    api.get<DashboardData>('/dashboard', { params: { date } }),
  getLocationProgress: (month?: number, year?: number) => 
    api.get<LocationProgressReport>('/dashboard/location-progress', { 
      params: { month, year } 
    }),
  getActivitySummary: (activityId: number, month?: number, year?: number) => 
    api.get<ActivitySummary>('/dashboard/activity-summary', { 
      params: { activity_id: activityId, month, year } 
    }),
  getMonthlyStats: (month?: number, year?: number) => 
    api.get<MonthlyStats>('/dashboard/monthly-stats', { 
      params: { month, year } 
    }),
};
*/

export default null;