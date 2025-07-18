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

// Mock data
const mockUsers: User[] = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, name: 'María García', email: 'maria@example.com', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', created_at: '2024-01-01', updated_at: '2024-01-01' },
];

const mockActivities: Activity[] = [
  { id: 1, name: 'Guadaña', description: 'Corte de césped y maleza', requires_location: true, created_at: '2024-01-01' },
  { id: 2, name: 'Riego', description: 'Riego de plantas y jardines', requires_location: true, created_at: '2024-01-01' },
  { id: 3, name: 'Barrido', description: 'Limpieza y barrido de áreas', requires_location: true, created_at: '2024-01-01' },
  { id: 4, name: 'Servicios', description: 'Servicios generales de mantenimiento', requires_location: false, created_at: '2024-01-01' },
];

const mockLocations: Location[] = [
  { id: 1, code: 'A01', description: 'Área A - Sector 01', created_at: '2024-01-01' },
  { id: 2, code: 'A02', description: 'Área A - Sector 02', created_at: '2024-01-01' },
  { id: 3, code: 'A03', description: 'Área A - Sector 03', created_at: '2024-01-01' },
  { id: 4, code: 'B01', description: 'Área B - Sector 01', created_at: '2024-01-01' },
  { id: 5, code: 'B02', description: 'Área B - Sector 02', created_at: '2024-01-01' },
  { id: 6, code: 'C01', description: 'Área C - Sector 01', created_at: '2024-01-01' },
];

// Generate more locations
const areas = ['A', 'B', 'C', 'D', 'E', 'F'];
const areaCounts = { A: 16, B: 8, C: 5, D: 4, E: 2, F: 3 };

let locationId = 7;
areas.forEach(area => {
  const count = areaCounts[area as keyof typeof areaCounts];
  for (let i = 1; i <= count; i++) {
    if (locationId > 6) { // Skip already created ones
      const code = `${area}${i.toString().padStart(2, '0')}`;
      if (!mockLocations.find(l => l.code === code)) {
        mockLocations.push({
          id: locationId++,
          code,
          description: `Área ${area} - Sector ${i.toString().padStart(2, '0')}`,
          created_at: '2024-01-01'
        });
      }
    }
  }
});

// Mock assignments
let assignmentId = 1;
const mockAssignments: DailyAssignment[] = [];

// Generate some mock assignments for today
const today = new Date().toISOString().split('T')[0];
mockUsers.forEach((user, userIndex) => {
  mockActivities.slice(0, 2).forEach((activity, actIndex) => {
    const location = mockLocations[userIndex + actIndex];
    if (location) {
      mockAssignments.push({
        id: assignmentId++,
        user_id: user.id,
        user_name: user.name,
        activity_id: activity.id,
        activity_name: activity.name,
        location_id: location.id,
        location_code: location.code,
        location_description: location.description,
        assigned_date: today,
        completed: Math.random() > 0.5,
        completed_at: Math.random() > 0.5 ? new Date().toISOString() : undefined,
        requires_location: activity.requires_location,
        notes: Math.random() > 0.7 ? 'Trabajo completado correctamente' : undefined
      });
    }
  });
});

// Mock history
const mockHistory: ActivityHistory[] = [];
let historyId = 1;

// Generate history for last 30 days
for (let i = 0; i < 30; i++) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split('T')[0];
  
  mockUsers.forEach(user => {
    if (Math.random() > 0.3) { // 70% chance of having activities
      const numActivities = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numActivities; j++) {
        const activity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
        const location = activity.requires_location ? mockLocations[Math.floor(Math.random() * mockLocations.length)] : undefined;
        
        mockHistory.push({
          id: historyId++,
          user_id: user.id,
          user_name: user.name,
          activity_id: activity.id,
          activity_name: activity.name,
          location_id: location?.id,
          location_code: location?.code,
          location_description: location?.description,
          date: dateStr,
          completed: Math.random() > 0.2,
          completed_at: Math.random() > 0.2 ? new Date(date.getTime() + Math.random() * 8 * 60 * 60 * 1000).toISOString() : undefined,
          notes: Math.random() > 0.8 ? 'Actividad completada sin problemas' : undefined
        });
      }
    }
  });
}

// Storage helpers
const getFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

// Initialize storage
const initializeStorage = () => {
  if (!getFromStorage('users')) saveToStorage('users', mockUsers);
  if (!getFromStorage('activities')) saveToStorage('activities', mockActivities);
  if (!getFromStorage('locations')) saveToStorage('locations', mockLocations);
  if (!getFromStorage('assignments')) saveToStorage('assignments', mockAssignments);
  if (!getFromStorage('history')) saveToStorage('history', mockHistory);
  if (!getFromStorage('absences')) saveToStorage('absences', []);
};

// Initialize on load
initializeStorage();

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export const mockUserService = {
  getAll: async () => {
    await delay();
    return { data: getFromStorage('users') || mockUsers };
  },
  
  getById: async (id: number) => {
    await delay();
    const users = getFromStorage('users') || mockUsers;
    const user = users.find((u: User) => u.id === id);
    if (!user) throw new Error('User not found');
    return { data: user };
  },
  
  create: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    await delay();
    const users = getFromStorage('users') || mockUsers;
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map((u: User) => u.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    saveToStorage('users', users);
    return { data: newUser };
  },
  
  update: async (id: number, userData: Partial<User>) => {
    await delay();
    const users = getFromStorage('users') || mockUsers;
    const index = users.findIndex((u: User) => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...userData, updated_at: new Date().toISOString() };
    saveToStorage('users', users);
    return { data: users[index] };
  },
  
  delete: async (id: number) => {
    await delay();
    const users = getFromStorage('users') || mockUsers;
    const filteredUsers = users.filter((u: User) => u.id !== id);
    saveToStorage('users', filteredUsers);
    return { data: { message: 'User deleted' } };
  }
};

export const mockActivityService = {
  getAll: async () => {
    await delay();
    return { data: getFromStorage('activities') || mockActivities };
  },
  
  getById: async (id: number) => {
    await delay();
    const activities = getFromStorage('activities') || mockActivities;
    const activity = activities.find((a: Activity) => a.id === id);
    if (!activity) throw new Error('Activity not found');
    return { data: activity };
  },
  
  create: async (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    await delay();
    const activities = getFromStorage('activities') || mockActivities;
    const newActivity: Activity = {
      ...activityData,
      id: Math.max(...activities.map((a: Activity) => a.id)) + 1,
      created_at: new Date().toISOString()
    };
    activities.push(newActivity);
    saveToStorage('activities', activities);
    return { data: newActivity };
  },
  
  update: async (id: number, activityData: Partial<Activity>) => {
    await delay();
    const activities = getFromStorage('activities') || mockActivities;
    const index = activities.findIndex((a: Activity) => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    activities[index] = { ...activities[index], ...activityData };
    saveToStorage('activities', activities);
    return { data: activities[index] };
  },
  
  delete: async (id: number) => {
    await delay();
    const activities = getFromStorage('activities') || mockActivities;
    const filteredActivities = activities.filter((a: Activity) => a.id !== id);
    saveToStorage('activities', filteredActivities);
    return { data: { message: 'Activity deleted' } };
  }
};

export const mockLocationService = {
  getAll: async () => {
    await delay();
    return { data: getFromStorage('locations') || mockLocations };
  },
  
  getById: async (id: number) => {
    await delay();
    const locations = getFromStorage('locations') || mockLocations;
    const location = locations.find((l: Location) => l.id === id);
    if (!location) throw new Error('Location not found');
    return { data: location };
  },
  
  create: async (locationData: Omit<Location, 'id' | 'created_at'>) => {
    await delay();
    const locations = getFromStorage('locations') || mockLocations;
    const newLocation: Location = {
      ...locationData,
      id: Math.max(...locations.map((l: Location) => l.id)) + 1,
      created_at: new Date().toISOString()
    };
    locations.push(newLocation);
    saveToStorage('locations', locations);
    return { data: newLocation };
  },
  
  update: async (id: number, locationData: Partial<Location>) => {
    await delay();
    const locations = getFromStorage('locations') || mockLocations;
    const index = locations.findIndex((l: Location) => l.id === id);
    if (index === -1) throw new Error('Location not found');
    
    locations[index] = { ...locations[index], ...locationData };
    saveToStorage('locations', locations);
    return { data: locations[index] };
  },
  
  delete: async (id: number) => {
    await delay();
    const locations = getFromStorage('locations') || mockLocations;
    const filteredLocations = locations.filter((l: Location) => l.id !== id);
    saveToStorage('locations', filteredLocations);
    return { data: { message: 'Location deleted' } };
  }
};

export const mockAssignmentService = {
  getByDate: async (date?: string) => {
    await delay();
    const assignments = getFromStorage('assignments') || mockAssignments;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const filtered = assignments.filter((a: DailyAssignment) => a.assigned_date === targetDate);
    return { data: filtered };
  },
  
  create: async (assignmentData: any) => {
    await delay();
    const assignments = getFromStorage('assignments') || mockAssignments;
    const users = getFromStorage('users') || mockUsers;
    const activities = getFromStorage('activities') || mockActivities;
    const locations = getFromStorage('locations') || mockLocations;
    
    const user = users.find((u: User) => u.id === assignmentData.user_id);
    const activity = activities.find((a: Activity) => a.id === assignmentData.activity_id);
    const location = locations.find((l: Location) => l.id === assignmentData.location_id);
    
    const newAssignment: DailyAssignment = {
      id: Math.max(...assignments.map((a: DailyAssignment) => a.id), 0) + 1,
      user_id: assignmentData.user_id,
      user_name: user?.name || '',
      activity_id: assignmentData.activity_id,
      activity_name: activity?.name || '',
      location_id: assignmentData.location_id,
      location_code: location?.code,
      location_description: location?.description,
      assigned_date: assignmentData.assigned_date,
      completed: false,
      requires_location: activity?.requires_location || false,
      notes: assignmentData.notes
    };
    
    assignments.push(newAssignment);
    saveToStorage('assignments', assignments);
    return { data: newAssignment };
  },
  
  update: async (id: number, updates: Partial<DailyAssignment>) => {
    await delay();
    const assignments = getFromStorage('assignments') || mockAssignments;
    const index = assignments.findIndex((a: DailyAssignment) => a.id === id);
    if (index === -1) throw new Error('Assignment not found');
    
    assignments[index] = { 
      ...assignments[index], 
      ...updates,
      completed_at: updates.completed ? new Date().toISOString() : undefined
    };
    saveToStorage('assignments', assignments);
    return { data: assignments[index] };
  },
  
  delete: async (id: number) => {
    await delay();
    const assignments = getFromStorage('assignments') || mockAssignments;
    const filteredAssignments = assignments.filter((a: DailyAssignment) => a.id !== id);
    saveToStorage('assignments', filteredAssignments);
    return { data: { message: 'Assignment deleted' } };
  },
  
  markAbsence: async (absenceData: any) => {
    await delay();
    const absences = getFromStorage('absences') || [];
    const users = getFromStorage('users') || mockUsers;
    const user = users.find((u: User) => u.id === absenceData.user_id);
    
    const newAbsence: Absence = {
      id: Math.max(...absences.map((a: Absence) => a.id), 0) + 1,
      user_id: absenceData.user_id,
      user_name: user?.name,
      date: absenceData.date,
      reason: absenceData.reason,
      created_at: new Date().toISOString()
    };
    
    absences.push(newAbsence);
    saveToStorage('absences', absences);
    return { data: newAbsence };
  },
  
  getAbsences: async (params?: any) => {
    await delay();
    const absences = getFromStorage('absences') || [];
    return { data: absences };
  }
};

export const mockHistoryService = {
  getAll: async (params?: any) => {
    await delay();
    const history = getFromStorage('history') || mockHistory;
    return { data: history };
  },
  
  getUserHistory: async (userId: number, params?: any) => {
    await delay();
    const history = getFromStorage('history') || mockHistory;
    const absences = getFromStorage('absences') || [];
    
    const userHistory = history.filter((h: ActivityHistory) => h.user_id === userId);
    const userAbsences = absences.filter((a: Absence) => a.user_id === userId);
    
    return { 
      data: {
        activities: userHistory,
        absences: userAbsences
      }
    };
  },
  
  archive: async (date?: string) => {
    await delay();
    return { data: { message: 'Archived successfully' } };
  }
};

export const mockDashboardService = {
  getOverview: async (date?: string) => {
    await delay();
    const assignments = getFromStorage('assignments') || mockAssignments;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const todayAssignments = assignments.filter((a: DailyAssignment) => a.assigned_date === targetDate);
    
    const summary = {
      total_assignments: todayAssignments.length,
      completed_assignments: todayAssignments.filter((a: DailyAssignment) => a.completed).length,
      pending_assignments: todayAssignments.filter((a: DailyAssignment) => !a.completed).length
    };
    
    const activities = mockActivities.map(activity => ({
      activity_name: activity.name,
      count: todayAssignments.filter((a: DailyAssignment) => a.activity_id === activity.id).length,
      completed: todayAssignments.filter((a: DailyAssignment) => a.activity_id === activity.id && a.completed).length
    }));
    
    const users = mockUsers.map(user => ({
      user_name: user.name,
      total_tasks: todayAssignments.filter((a: DailyAssignment) => a.user_id === user.id).length,
      completed_tasks: todayAssignments.filter((a: DailyAssignment) => a.user_id === user.id && a.completed).length
    }));
    
    const dashboardData: DashboardData = {
      date: targetDate,
      summary,
      activities,
      users,
      absences: { absent_count: 0 }
    };
    
    return { data: dashboardData };
  },
  
  getLocationProgress: async (month?: number, year?: number) => {
    await delay();
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();
    
    const locationProgress: LocationProgressReport = {
      month: currentMonth,
      year: currentYear,
      locations: mockLocations.map(location => ({
        location_code: location.code,
        location_description: location.description,
        activities: mockActivities.filter(a => a.name !== 'Servicios').map(activity => ({
          activity_name: activity.name,
          activity_id: activity.id,
          completed_count: Math.floor(Math.random() * 3),
          expected_count: 1,
          progress_percentage: Math.floor(Math.random() * 100),
          status: Math.random() > 0.5 ? 'completed' : 'pending'
        }))
      }))
    };
    
    return { data: locationProgress };
  },
  
  getActivitySummary: async (activityId: number, month?: number, year?: number) => {
    await delay();
    const activity = mockActivities.find(a => a.id === activityId);
    if (!activity) throw new Error('Activity not found');
    
    const summary: ActivitySummary = {
      activity,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      locations: mockLocations.map(location => ({
        location_code: location.code,
        location_description: location.description,
        completed_count: Math.floor(Math.random() * 5),
        unique_days: Math.floor(Math.random() * 15),
        last_completed: undefined
      }))
    };
    
    return { data: summary };
  },
  
  getMonthlyStats: async (month?: number, year?: number) => {
    await delay();
    const stats: MonthlyStats = {
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      total_completed: Math.floor(Math.random() * 200) + 100,
      activity_breakdown: mockActivities.map(activity => ({
        activity_name: activity.name,
        count: Math.floor(Math.random() * 50) + 10
      })),
      user_performance: mockUsers.map(user => ({
        user_name: user.name,
        tasks_completed: Math.floor(Math.random() * 30) + 5,
        active_days: Math.floor(Math.random() * 20) + 10
      })),
      total_absences: Math.floor(Math.random() * 10)
    };
    
    return { data: stats };
  }
};