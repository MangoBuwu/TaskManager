import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { locationService } from '../services/api';
import type { Location } from '../types';
import toast from 'react-hot-toast';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationService.getAll();
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Error al cargar las ubicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async (locationData: Omit<Location, 'id' | 'created_at'>) => {
    try {
      await locationService.create(locationData);
      toast.success('Ubicación creada exitosamente');
      fetchLocations();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating location:', error);
      toast.error('Error al crear la ubicación');
    }
  };

  const handleUpdateLocation = async (id: number, locationData: Partial<Location>) => {
    try {
      await locationService.update(id, locationData);
      toast.success('Ubicación actualizada exitosamente');
      fetchLocations();
      setEditingLocation(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Error al actualizar la ubicación');
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) return;
    
    try {
      await locationService.delete(id);
      toast.success('Ubicación eliminada exitosamente');
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Error al eliminar la ubicación');
    }
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLocation(null);
  };

  // Group locations by area (first letter)
  const groupedLocations = locations.reduce((acc, location) => {
    const area = location.code.charAt(0);
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

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
          <h1 className="text-2xl font-bold text-gray-900">Ubicaciones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las ubicaciones disponibles
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Ubicación
        </button>
      </div>

      {/* Locations by Area */}
      <div className="space-y-6">
        {Object.entries(groupedLocations).sort().map(([area, areaLocations]) => (
          <div key={area} className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Área {area} ({areaLocations.length} ubicaciones)
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {areaLocations.sort((a, b) => a.code.localeCompare(b.code)).map((location) => (
                <div key={location.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {location.code}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(location)}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded hover:bg-primary-50"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="p-1 text-gray-400 hover:text-error-600 rounded hover:bg-error-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {location.description && (
                    <p className="text-xs text-gray-600">{location.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ubicaciones</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva ubicación.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <LocationModal
          location={editingLocation}
          onSubmit={editingLocation ? 
            (data) => handleUpdateLocation(editingLocation.id, data) : 
            handleCreateLocation
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Location Modal Component
const LocationModal: React.FC<{
  location?: Location | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ location, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    code: location?.code || '',
    description: location?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {location ? 'Editar Ubicación' : 'Nueva Ubicación'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="input"
              required
              placeholder="Ej: A01, B02, C03"
              pattern="[A-Z][0-9]{2}"
              title="Formato: Una letra seguida de dos números (Ej: A01)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: Una letra seguida de dos números (Ej: A01)
            </p>
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
              placeholder="Descripción de la ubicación"
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
              {location ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Locations;