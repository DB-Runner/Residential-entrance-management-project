import { Search, UserPlus, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { residentService, type ResidentWithUnit } from '../services/residentService';

export function ApartmentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<ResidentWithUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const data = await residentService.getAll();
      setResidents(data);
    } catch (err) {
      console.error('Error loading residents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residents.filter(resident =>
    (resident.unitNumber && resident.unitNumber.includes(searchTerm)) ||
    resident.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600 text-center">Зареждане на апартаменти...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Управление на апартаменти</h1>
          <p className="text-gray-600">Общо {residents.length} апартамента</p>
        </div>
        {/*<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />
          Добави жител
        </button>*/}
      </div>

      {/* Търсене */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Търси по име или апартамент..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Таблица с апартаменти */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Апартамент</th>
                <th className="px-6 py-3 text-left text-gray-700">Име</th>
                <th className="px-6 py-3 text-left text-gray-700">Контакти</th>
                <th className="px-6 py-3 text-left text-gray-700">Баланс</th>
                <th className="px-6 py-3 text-left text-gray-700">Статус</th>
                <th className="px-6 py-3 text-right text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    {searchTerm ? 'Няма намерени апартаменти' : 'Няма апартаменти'}
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => {
                  const balance = resident.unit?.balance?.balance || 0;
                  return (
                    <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <span>№ {resident.unitNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600">
                              {resident.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-gray-900">{resident.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>{resident.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${
                          balance > 0
                            ? 'text-green-600'
                            : balance < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {balance > 0 ? '+' : ''}{balance.toFixed(2)} лв
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Активен
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
