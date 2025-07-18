import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, User, Mail, Eye } from 'lucide-react';
import { userService } from '../services/api';
import type { User as UserType } from '../types';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los responsables');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Omit<UserType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await userService.create(userData);
      toast.success('Responsable creado exitosamente');
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el responsable');
    }
  };

  const handleUpdateUser = async (id: number, userData: Partial<UserType>) => {
    try {
      await userService.update(id, userData);
      toast.success('Responsable actualizado exitosamente');
      fetchUsers();
      setEditingUser(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el responsable');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este responsable?')) return;
    
    try {
      await userService.delete(id);
      toast.success('Responsable eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el responsable');
    }
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Responsables</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los responsables de las actividades
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Responsable
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  {user.email && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Link
                  to={`/users/${user.id}`}
                  className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => openEditModal(user)}
                  className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-gray-400 hover:text-error-600 rounded-lg hover:bg-error-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500">
                ID: {user.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay responsables</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando un nuevo responsable.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onSubmit={editingUser ? 
            (data) => handleUpdateUser(editingUser.id, data) : 
            handleCreateUser
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal: React.FC<{
  user?: UserType | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {user ? 'Editar Responsable' : 'Nuevo Responsable'}
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
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (opcional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="correo@ejemplo.com"
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
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Users;