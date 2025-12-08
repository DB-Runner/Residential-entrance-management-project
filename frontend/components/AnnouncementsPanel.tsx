import { Megaphone, AlertCircle, Info, CheckCircle } from 'lucide-react';

const announcements = [
  {
    id: 1,
    title: 'Прекъсване на водата',
    message: 'На 10 декември от 10:00 до 14:00 часа ще има прекъсване на водоснабдяването.',
    type: 'warning' as const,
    date: '2025-12-02'
  },
  {
    id: 2,
    title: 'Нови правила за паркиране',
    message: 'Моля спазвайте новите правила за паркиране в двора. Повече детайли на общото събрание.',
    type: 'info' as const,
    date: '2025-11-28'
  },
  {
    id: 3,
    title: 'Ремонт завършен успешно',
    message: 'Ремонтът на покрива приключи успешно. Благодарим за разбирането!',
    type: 'success' as const,
    date: '2025-11-20'
  }
];

export function AnnouncementsPanel() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Megaphone className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Обяви и известия</h2>
            <p className="text-gray-600 text-sm">Важна информация</p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {announcements.map((announcement) => {
          const icons = {
            warning: AlertCircle,
            info: Info,
            success: CheckCircle
          };
          const colors = {
            warning: 'text-orange-600 bg-orange-50',
            info: 'text-blue-600 bg-blue-50',
            success: 'text-green-600 bg-green-50'
          };
          
          const Icon = icons[announcement.type];
          const colorClass = colors[announcement.type];

          return (
            <div key={announcement.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-gray-900">{announcement.title}</h3>
                    <span className="text-gray-500 text-sm">
                      {new Date(announcement.date).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{announcement.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <button className="w-full text-center text-blue-600 hover:text-blue-700">
          Виж всички обяви
        </button>
      </div>
    </div>
  );
}
