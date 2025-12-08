import { Search, UserPlus, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const residents = [
  {
    id: 1,
    name: 'Иван Иванов',
    apartment: '12',
    email: 'ivan@example.com',
    phone: '+359 888 123 456',
    balance: 0,
    status: 'active'
  },
  {
    id: 2,
    name: 'Мария Петрова',
    apartment: '5',
    email: 'maria@example.com',
    phone: '+359 887 654 321',
    balance: 0,
    status: 'active'
  },
  {
    id: 3,
    name: 'Георги Стоянов',
    apartment: '8',
    email: 'georgi@example.com',
    phone: '+359 889 111 222',
    balance: 85,
    status: 'active'
  },
  {
    id: 4,
    name: 'Петър Димитров',
    apartment: '3',
    email: 'petar@example.com',
    phone: '+359 888 333 444',
    balance: -85,
    status: 'active'
  },
  {
    id: 5,
    name: 'Елена Георгиева',
    apartment: '15',
    email: 'elena@example.com',
    phone: '+359 887 555 666',
    balance: 0,
    status: 'active'
  }
];

export function ResidentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Управление на жители</h1>
          <p className="text-gray-600">Общо {residents.length} жители</p>
        </div>
        {/*
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />
          Добави жител
        </button>
        */}
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

      {/* Таблица с жители */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Име</th>
                <th className="px-6 py-3 text-left text-gray-700">Апартамент</th>
                <th className="px-6 py-3 text-left text-gray-700">Контакти</th>
                <th className="px-6 py-3 text-left text-gray-700">Баланс</th>
                <th className="px-6 py-3 text-left text-gray-700">Статус</th>
                <th className="px-6 py-3 text-right text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResidents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">
                          {resident.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-gray-900">{resident.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>№ {resident.apartment}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{resident.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{resident.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${
                      resident.balance > 0
                        ? 'text-green-600'
                        : resident.balance < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {resident.balance > 0 ? '+' : ''}{resident.balance.toFixed(2)} лв
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
