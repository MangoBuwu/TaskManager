import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  History as HistoryIcon, 
  Filter, 
  // Calendar, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  User,
  Activity as ActivityIcon
} from 'lucide-react';
import { historyService, userService, activityService, locationService } from '../services/api';
import type { ActivityHistory, User as UserType, Activity, Location } from '../types';
import toast from 'react-hot-toast';

const History: React.FC = () => {
  const [history, setHistory] = useState<ActivityHistory[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    user_id: '',
    activity_id: '',
    location_id: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [usersRes, activitiesRes, locationsRes] = await Promise.all([
        userService.getAll(),
        activityService.getAll(),
        locationService.getAll()
      ]);
      
      setUsers(usersRes.data);
      setActivities(activitiesRes.data);
      setLocations(locationsRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Error al cargar los datos iniciales');
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        user_id: filters.user_id ? Number(filters.user_id) : undefined,
        activity_id: filters.activity_id ? Number(filters.activity_id) : undefined,
        location_id: filters.location_id ? Number(filters.location_id) : undefined
      };
      
      const response = await historyService.getAll(params);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Error al cargar el historial');
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

  const clearFilters = () => {
    setFilters({
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      user_id: '',
      activity_id: '',
      location_id: ''
    });
  };

  // Group history by date
  const groupedHistory = history.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ActivityHistory[]>);

  const sortedDates = Object.keys(groupedHistory).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historial completo de actividades realizadas
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <select
                value={filters.user_id}
                onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
                className="select"
              >
                <option value="">Todos</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actividad
              </label>
              <select
                value={filters.activity_id}
                onChange={(e) => setFilters({ ...filters, activity_id: e.target.value })}
                className="select"
              >
                <option value="">Todas</option>
                {activities.map(activity => (
                  <option key={activity.id} value={activity.id}>{activity.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <select
                value={filters.location_id}
                onChange={(e) => setFilters({ ...filters, location_id: e.target.value })}
                className="select"
              >
                <option value="">Todas</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.code}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="btn btn-secondary mr-3"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay historial</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron actividades en el rango de fechas seleccionado.
              </p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {format(new Date(date), 'EEEE, d MMMM yyyy', { locale: es })}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {groupedHistory[date].length} actividades
                  </span>
                </div>
                
                <div className="space-y-3">
                  {groupedHistory[date].map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border ${
                        item.completed
                          ? 'bg-success-50 border-success-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-success-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-1" />
                              {item.user_name}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <ActivityIcon className="w-4 h-4 mr-1" />
                              {item.activity_name}
                            </div>
                            
                            {item.location_code && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {item.location_code}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.completed && item.completed_at && (
                            <span className="text-xs text-gray-500">
                              Completada: {formatTime(item.completed_at)}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-2 ml-8">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default History;