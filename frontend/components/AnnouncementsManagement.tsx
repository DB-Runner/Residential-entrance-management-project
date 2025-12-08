import { Plus, AlertCircle, Info, CheckCircle, Megaphone } from 'lucide-react';
import { useState } from 'react';

const announcements = [
  {
    id: 1,
    title: 'Прекъсване на водата',
    message: 'На 10 декември от 10:00 до 14:00 часа ще има прекъсване на водоснабдяването.',
    type: 'warning' as const,
    date: '2025-12-02',
    views: 18
  },
  {
    id: 2,
    title: 'Нови правила за паркиране',
    message: 'Моля спазвайте новите правила за паркиране в двора. Повече детайли на общото събрание.',
    type: 'info' as const,
    date: '2025-11-28',
    views: 22
  },
  {
    id: 3,
    title: 'Ремонт завърши успешно',
    message: 'Ремонтът на покрива приключи успешно. Благодарим за разбирането!',
    type: 'success' as const,
    date: '2025-11-20',
    views: 24
  }
];

export function AnnouncementsManagement() {
  const [showAddModal, setShowAddModal] = useState(false);

  const typeConfig = {
    warning: { label: 'Внимание', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
    info: { label: 'Информация', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Info },
    success: { label: 'Успех', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Управление на обяви</h1>
          <p className="text-gray-600">Създаване и публикуване на обяви</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Добави обява
        </button>
      </div>

      {/* Списък с обяви */}
      <div className="space-y-4">
        {announcements.map((announcement) => {
          const config = typeConfig[announcement.type];
          const Icon = config.icon;
          
          return (
            <div key={announcement.id} className="bg-white rounded-lg shadow">
              <div className={`p-6 border-l-4 ${config.color}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${config.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 mb-1">{announcement.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-sm">
                          {new Date(announcement.date).toLocaleDateString('bg-BG')}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {announcement.views} прегледа
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{announcement.message}</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Редактирай
                      </button>
                      <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Изтрий
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Модал за добавяне на обява */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-gray-900">Добави нова обява</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Вид обява</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="info">Информация</option>
                  <option value="warning">Внимание</option>
                  <option value="success">Успех</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Заглавие</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Важна информация..."
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Съобщение</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Подробности за обявата..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Изпрати имейл известие до всички жители</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Публикувай
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
