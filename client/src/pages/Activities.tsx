import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Activity as ActivityIcon, MapPin, X } from 'lucide-react';
import { activityService } from '../services/api';
import type { Activity } from '../types';
import toast from 'react-hot-toast';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAll();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error al cargar las actividades');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    try {
      await activityService.create(activityData);
      toast.success('Actividad creada exitosamente');
      fetchActivities();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Error al crear la actividad');
    }
  };

  const handleUpdateActivity = async (id: number, activityData: Partial<Activity>) => {
    try {
      await activityService.update(id, activityData);
      toast.success('Actividad actualizada exitosamente');
      fetchActivities();
      setEditingActivity(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Error al actualizar la actividad');
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta actividad?')) return;
    
    try {
      await activityService.delete(id);
      toast.success('Actividad eliminada exitosamente');
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Error al eliminar la actividad');
    }
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingActivity(null);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Actividades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las actividades disponibles
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Actividad
        </button>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <ActivityIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{activity.name}</h3>
                  <div className="flex items-center mt-1">
                    {activity.requires_location ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        <MapPin className="w-3 h-3 mr-1" />
                        Requiere ubicación
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <X className="w-3 h-3 mr-1" />
                        Sin ubicación
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {activity.description && (
              <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(activity)}
                  className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="p-2 text-gray-400 hover:text-error-600 rounded-lg hover:bg-error-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500">
                ID: {activity.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <ActivityIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividades</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva actividad.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ActivityModal
          activity={editingActivity}
          onSubmit={editingActivity ? 
            (data) => handleUpdateActivity(editingActivity.id, data) : 
            handleCreateActivity
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Activity Modal Component
const ActivityModal: React.FC<{
  activity?: Activity | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ activity, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    requires_location: activity?.requires_location ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {activity ? 'Editar Actividad' : 'Nueva Actividad'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
              placeholder="Nombre de la actividad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Descripción de la actividad"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requires_location}
                onChange={(e) => setFormData({ ...formData, requires_location: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Requiere ubicación específica
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Si está marcado, será necesario asignar una ubicación al crear una tarea de esta actividad.
            </p>
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
              {activity ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Activities;