import React, { useState, useEffect } from 'react';
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';
import { 
  BarChart3, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity as ActivityIcon
} from 'lucide-react';
import { dashboardService, activityService } from '../services/api';
import type { LocationProgressReport, Activity, MonthlyStats } from '../types';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const [locationProgress, setLocationProgress] = useState<LocationProgressReport | null>(null);
  // const [activities, setActivities] = useState<Activity[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'progress' | 'stats'>('progress');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const fetchInitialData = async () => {
    try {
      const activitiesRes = await activityService.getAll();
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error al cargar las actividades');
    }
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [progressRes, statsRes] = await Promise.all([
        dashboardService.getLocationProgress(selectedMonth, selectedYear),
        dashboardService.getMonthlyStats(selectedMonth, selectedYear)
      ]);
      
      setLocationProgress(progressRes.data);
      setMonthlyStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Error al cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-success-600';
    if (percentage >= 75) return 'bg-warning-600';
    return 'bg-error-600';
  };

  const getProgressTextColor = (percentage: number) => {
    if (percentage >= 100) return 'text-success-600';
    if (percentage >= 75) return 'text-warning-600';
    return 'text-error-600';
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {monthNames[selectedMonth - 1]} {selectedYear}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="select"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="select"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'progress'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Progreso por Ubicación
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Estadísticas Mensuales
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'progress' && locationProgress && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Ubicaciones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {locationProgress.locations.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {locationProgress.locations.filter(loc => 
                      loc.activities.every(act => act.status === 'completed')
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {locationProgress.locations.filter(loc => 
                      loc.activities.some(act => act.status === 'pending')
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {locationProgress.locations.map((location) => (
              <div key={location.location_code} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {location.location_code}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {location.location_description}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {location.activities.map((activity) => (
                    <div key={activity.activity_name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {activity.activity_name}
                        </span>
                        <span className={`text-sm font-medium ${getProgressTextColor(activity.progress_percentage)}`}>
                          {activity.progress_percentage}%
                        </span>
                      </div>
                      
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${getProgressColor(activity.progress_percentage)}`}
                          style={{ width: `${activity.progress_percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{activity.completed_count} completadas</span>
                        <span>{activity.expected_count} esperadas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && monthlyStats && (
        <div className="space-y-6">
          {/* Monthly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.total_completed}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                    <ActivityIcon className="w-5 h-5 text-success-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tipos de Actividad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.activity_breakdown.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-warning-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Responsables Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.user_performance.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-error-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Ausencias</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.total_absences}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Breakdown */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Distribución por Actividad
              </h3>
              <div className="space-y-4">
                {monthlyStats.activity_breakdown.map((activity) => {
                  const percentage = monthlyStats.total_completed > 0 
                    ? Math.round((activity.count / monthlyStats.total_completed) * 100)
                    : 0;

                  return (
                    <div key={activity.activity_name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ActivityIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.activity_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.count} actividades
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-3">
                          <div 
                            className="h-2 bg-primary-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Performance */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rendimiento por Responsable
              </h3>
              <div className="space-y-4">
                {monthlyStats.user_performance.map((user) => (
                  <div key={user.user_name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-primary-600">
                          {user.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.user_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.active_days} días activos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.tasks_completed}
                      </p>
                      <p className="text-xs text-gray-500">
                        tareas completadas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;