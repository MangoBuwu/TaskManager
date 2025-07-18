import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User,
  Edit,
  Trash2,
  UserX
} from 'lucide-react';
import { assignmentService, userService, activityService, locationService } from '../services/api';
import type { DailyAssignment, User as UserType, Activity, Location } from '../types';
import toast from 'react-hot-toast';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<DailyAssignment[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<DailyAssignment | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [selectedDate]);

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

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentService.getByDate(selectedDate);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (formData: any) => {
    try {
      await assignmentService.create({
        ...formData,
        assigned_date: selectedDate
      });
      toast.success('Asignación creada exitosamente');
      fetchAssignments();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Error al crear la asignación');
    }
  };

  const handleUpdateAssignment = async (id: number, updates: Partial<DailyAssignment>) => {
    try {
      await assignmentService.update(id, updates);
      toast.success('Asignación actualizada exitosamente');
      fetchAssignments();
      setEditingAssignment(null);
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Error al actualizar la asignación');
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta asignación?')) return;
    
    try {
      await assignmentService.delete(id);
      toast.success('Asignación eliminada exitosamente');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Error al eliminar la asignación');
    }
  };

  const handleMarkAbsence = async (formData: any) => {
    try {
      await assignmentService.markAbsence({
        ...formData,
        date: selectedDate
      });
      toast.success('Ausencia registrada exitosamente');
      setShowAbsenceModal(false);
    } catch (error) {
      console.error('Error marking absence:', error);
      toast.error('Error al registrar la ausencia');
    }
  };

  const toggleComplete = async (assignment: DailyAssignment) => {
    await handleUpdateAssignment(assignment.id, {
      completed: !assignment.completed
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, d MMMM yyyy', { locale: es });
  };

  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const activity = assignment.activity_name;
    if (!acc[activity]) {
      acc[activity] = [];
    }
    acc[activity].push(assignment);
    return acc;
  }, {} as Record<string, DailyAssignment[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asignaciones Diarias</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(selectedDate)}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
          <button
            onClick={() => setShowAbsenceModal(true)}
            className="btn btn-secondary"
          >
            <UserX className="w-4 h-4 mr-2" />
            Marcar Ausencia
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Asignación
          </button>
        </div>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAssignments).map(([activityName, activityAssignments]) => (
            <div key={activityName} className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{activityName}</h3>
              <div className="space-y-3">
                {activityAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      assignment.completed 
                        ? 'bg-success-50 border-success-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleComplete(assignment)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          assignment.completed
                            ? 'bg-success-600 border-success-600'
                            : 'border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {assignment.completed && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {assignment.user_name}
                        </div>
                        
                        {assignment.location_code && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {assignment.location_code}
                          </div>
                        )}
                        
                        {assignment.completed && assignment.completed_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {format(new Date(assignment.completed_at), 'HH:mm')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingAssignment(assignment)}
                        className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 text-gray-400 hover:text-error-600 rounded-lg hover:bg-error-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {assignments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay asignaciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando una nueva asignación para este día.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <AssignmentModal
          users={users}
          activities={activities}
          locations={locations}
          onSubmit={handleCreateAssignment}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <AssignmentModal
          users={users}
          activities={activities}
          locations={locations}
          assignment={editingAssignment}
          onSubmit={(data) => handleUpdateAssignment(editingAssignment.id, data)}
          onClose={() => setEditingAssignment(null)}
        />
      )}

      {/* Absence Modal */}
      {showAbsenceModal && (
        <AbsenceModal
          users={users}
          onSubmit={handleMarkAbsence}
          onClose={() => setShowAbsenceModal(false)}
        />
      )}
    </div>
  );
};

// Assignment Modal Component
const AssignmentModal: React.FC<{
  users: UserType[];
  activities: Activity[];
  locations: Location[];
  assignment?: DailyAssignment;
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ users, activities, locations, assignment, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    user_id: assignment?.user_id || '',
    activity_id: assignment?.activity_id || '',
    location_id: assignment?.location_id || '',
    notes: assignment?.notes || ''
  });

  const selectedActivity = activities.find(a => a.id === Number(formData.activity_id));
  const requiresLocation = selectedActivity?.requires_location ?? true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: Number(formData.user_id),
      activity_id: Number(formData.activity_id),
      location_id: formData.location_id ? Number(formData.location_id) : null
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {assignment ? 'Editar Asignación' : 'Nueva Asignación'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="select"
              required
            >
              <option value="">Seleccionar responsable</option>
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
              value={formData.activity_id}
              onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
              className="select"
              required
            >
              <option value="">Seleccionar actividad</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>{activity.name}</option>
              ))}
            </select>
          </div>

          {requiresLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <select
                value={formData.location_id}
                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                className="select"
                required={requiresLocation}
              >
                <option value="">Seleccionar ubicación</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.code}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows={3}
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {assignment ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Absence Modal Component
const AbsenceModal: React.FC<{
  users: UserType[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ users, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: Number(formData.user_id)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Marcar Ausencia
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="select"
              required
            >
              <option value="">Seleccionar responsable</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo (opcional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="input"
              rows={3}
              placeholder="Motivo de la ausencia..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Registrar Ausencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assignments;