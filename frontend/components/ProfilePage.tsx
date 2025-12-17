import { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar, Edit2, Save, X, MapPin, Building2, Home, LogOut } from 'lucide-react';
import { authService } from '../services/authService';
import { UserRole } from '../types/database';
import type { User as UserType } from '../types/database';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await authService.me();
      setUser(userData);
      setEditedName(userData.fullName);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Грешка при зареждане на профила');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Отказ - връщаме оригиналното име
      setEditedName(user?.fullName || '');
    }
    setIsEditing(!isEditing);
  };

  {/*const handleSave = async () => {
    try {
      setError('');
      // Актуализираме профила чрез backend API
      const updatedUser = await authService.updateProfile({ fullName: editedName });
      setUser(updatedUser);
      setIsEditing(false);
      alert('Профилът беше актуализиран успешно!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Грешка при актуализиране на профила');
      // Връщаме старото име при грешка
      setEditedName(user?.fullName || '');
    }
  };*/}

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Дори при грешка, пренасочваме към началната страница
      navigate('/');
    }
  };

  const getRoleName = (role: UserRole) => {
    return role === UserRole.BUILDING_MANAGER ? 'Домоуправител' : 'Жител';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600 text-center">Зареждане на профил...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Потребителят не е намерен'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Моят профил</h1>
        <p className="text-gray-600">Преглед и управление на личните данни</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Основна информация */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
          <h2 className="text-gray-900">Основна информация</h2>
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Редактирай
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Запази
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Отказ
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Пълно име */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Пълно име</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Въведете пълно име"
                />
              ) : (
                <p className="text-gray-900">{user.fullName}</p>
              )}
            </div>
          </div>

          {/* Имейл */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Имейл адрес</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          {/* Роля */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Роля</label>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">{getRoleName(user.role)}</p>
              </div>
            </div>
          </div>

          {/* Дата на създаване */}
          {user.createdAt && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Регистриран на</label>
                <p className="text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          )}

          {/* Последна актуализация */}
          {user.updatedAt && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Последна актуализация</label>
                <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          )}

          {/* Номер на апартамент (за жители) */}
          {user.role === UserRole.RESIDENT && user.unitNumber && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Home className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Номер на апартамент</label>
                <p className="text-gray-900">{user.unitNumber}</p>
              </div>
            </div>
          )}

          {/* Име на сграда (за домоуправители) */}
          {user.role === UserRole.BUILDING_MANAGER && user.buildingName && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Име на сграда</label>
                <p className="text-gray-900">{user.buildingName}</p>
              </div>
            </div>
          )}

          {/* Адрес на сграда */}
          {user.buildingAddress && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Адрес на сграда</label>
                <p className="text-gray-900">{user.buildingAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Информация за сигурността */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-gray-900">Сигурност</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-gray-900 mb-1">Смяна на парола</p>
            </div>
            <button
              onClick={() => alert('Функционалността за смяна на парола ще бъде добавена скоро')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Промени парола
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="text-gray-900 mb-1">Излизане от профила</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Изход
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}