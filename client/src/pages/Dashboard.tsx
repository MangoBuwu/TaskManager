import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  // TrendingUp,
  Activity as ActivityIcon
} from 'lucide-react';
import { dashboardService } from '../services/api';
import type { DashboardData } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview(selectedDate);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, d MMMM yyyy', { locale: es });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se pudieron cargar los datos del dashboard.
        </p>
      </div>
    );
  }

  const completionPercentage = dashboardData.summary.total_assignments > 0 
    ? Math.round((dashboardData.summary.completed_assignments / dashboardData.summary.total_assignments) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(selectedDate)}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input max-w-xs"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Asignaciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.summary.total_assignments}
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
                {dashboardData.summary.completed_assignments}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.summary.pending_assignments}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-error-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ausencias</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.absences.absent_count}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Progreso del Día</h3>
          <span className="text-sm font-medium text-gray-500">
            {completionPercentage}% completado
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill bg-primary-600"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <span>{dashboardData.summary.completed_assignments} completadas</span>
          <span>{dashboardData.summary.total_assignments} total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activities Summary */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actividades</h3>
          <div className="space-y-4">
            {dashboardData.activities.map((activity) => {
              const activityProgress = activity.count > 0 
                ? Math.round((activity.completed / activity.count) * 100)
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
                        {activity.completed} de {activity.count} completadas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-3">
                      <div 
                        className="h-2 bg-primary-600 rounded-full"
                        style={{ width: `${activityProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {activityProgress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento por Responsable</h3>
          <div className="space-y-4">
            {dashboardData.users.map((user) => {
              const userProgress = user.total_tasks > 0 
                ? Math.round((user.completed_tasks / user.total_tasks) * 100)
                : 0;

              return (
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
                        {user.completed_tasks} de {user.total_tasks} tareas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-3">
                      <div 
                        className="h-2 bg-success-600 rounded-full"
                        style={{ width: `${userProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {userProgress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;