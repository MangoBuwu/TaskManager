import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  User,
  Activity as ActivityIcon,
  Clock
} from 'lucide-react';
import { userService, historyService } from '../services/api';
import type { User as UserType, UserHistory } from '../types';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserType | null>(null);
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id, dateRange]);

  const fetchUserData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [userRes, historyRes] = await Promise.all([
        userService.getById(Number(id)),
        historyService.getUserHistory(Number(id), {
          start_date: dateRange.start,
          end_date: dateRange.end
        })
      ]);
      
      setUser(userRes.data);
      setUserHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Usuario no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          El usuario solicitado no existe.
        </p>
        <Link to="/users" className="btn btn-primary mt-4">
          Volver a Responsables
        </Link>
      </div>
    );
  }

  const totalActivities = userHistory?.activities.length || 0;
  const completedActivities = userHistory?.activities.filter(a => a.completed).length || 0;
  const totalAbsences = userHistory?.absences.length || 0;
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  // Group activities by date
  const groupedActivities = userHistory?.activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof userHistory.activities>) || {};

  // Group absences by date
  const absencesByDate = userHistory?.absences.reduce((acc, absence) => {
    acc[absence.date] = absence;
    return acc;
  }, {} as Record<string, typeof userHistory.absences[0]>) || {};

  // Get all unique dates (activities + absences)
  const allDates = Array.from(new Set([
    ...Object.keys(groupedActivities),
    ...Object.keys(absencesByDate)
  ])).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/users"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Perfil del responsable
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="input"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="input"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="card">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-medium text-gray-900">{user.name}</h2>
            {user.email && (
              <p className="text-sm text-gray-500">{user.email}</p>
            )}
            <p className="text-xs text-gray-400">
              Registrado: {formatDate(user.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <ActivityIcon className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Actividades</p>
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
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
              <p className="text-2xl font-bold text-gray-900">{completedActivities}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ausencias</p>
              <p className="text-2xl font-bold text-gray-900">{totalAbsences}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasa de Finalización</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Actividades</h3>
        
        {allDates.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividades</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron actividades en el rango de fechas seleccionado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allDates.map((date) => {
              const activities = groupedActivities[date] || [];
              const absence = absencesByDate[date];
              
              return (
                <div key={date} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {format(new Date(date), 'EEEE, d MMMM yyyy', { locale: es })}
                    </h4>
                    <span className="text-xs text-gray-500">{formatDate(date)}</span>
                  </div>
                  
                  {absence && (
                    <div className="mb-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-warning-600 mr-2" />
                        <span className="text-sm font-medium text-warning-800">
                          Ausencia registrada
                        </span>
                      </div>
                      {absence.reason && (
                        <p className="text-sm text-warning-700 mt-1 ml-7">
                          {absence.reason}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {activities.length > 0 && (
                    <div className="space-y-2">
                      {activities.map((activity, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            activity.completed
                              ? 'bg-success-50 border-success-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {activity.completed ? (
                                <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                              ) : (
                                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {activity.activity_name}
                              </span>
                              {activity.location_code && (
                                <span className="ml-2 text-sm text-gray-500 flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {activity.location_code}
                                </span>
                              )}
                            </div>
                            {activity.completed && activity.completed_at && (
                              <span className="text-xs text-gray-500">
                                Completada: {formatTime(activity.completed_at)}
                              </span>
                            )}
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-gray-600 mt-2 ml-7">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activities.length === 0 && !absence && (
                    <p className="text-sm text-gray-500 italic">
                      Sin actividades registradas
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;