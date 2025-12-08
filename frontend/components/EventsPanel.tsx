import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventsPanelProps {
  expanded?: boolean;
}

const events = [
  {
    id: 1,
    title: 'Общо събрание на собствениците',
    date: '2025-12-15',
    time: '18:00',
    location: 'Партер, вход А',
    description: 'Годишно отчетно събрание'
  },
  {
    id: 2,
    title: 'Почистване на входа',
    date: '2025-12-08',
    time: '10:00',
    location: 'Цялата сграда',
    description: 'Генерално почистване преди празниците'
  },
  {
    id: 3,
    title: 'Ремонт на асансьора',
    date: '2025-12-12',
    time: '09:00',
    location: 'Асансьор',
    description: 'Планово обслужване'
  }
];

export function EventsPanel({ expanded = false }: EventsPanelProps) {
  const displayEvents = expanded ? events : events.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Предстоящи събития</h2>
            <p className="text-gray-600 text-sm">Срещи и дейности</p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {displayEvents.map((event) => (
          <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
            <h3 className="text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('bg-BG', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!expanded && (
        <div className="p-4 border-t">
          <button className="w-full text-center text-blue-600 hover:text-blue-700">
            Виж всички събития
          </button>
        </div>
      )}
    </div>
  );
}
