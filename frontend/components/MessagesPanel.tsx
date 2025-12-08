import { MessageSquare, User } from 'lucide-react';

interface MessagesPanelProps {
  expanded?: boolean;
}

const messages = [
  {
    id: 1,
    sender: 'Мария Петрова',
    apartment: 'Ап. 5',
    message: 'Здравейте, колеги! Напомням ви за събранието в петък.',
    time: '2 часа',
    unread: true
  },
  {
    id: 2,
    sender: 'Георги Иванов',
    apartment: 'Ап. 8',
    message: 'Има ли някой информация за новия график на асансьора?',
    time: '5 часа',
    unread: true
  },
  {
    id: 3,
    sender: 'Елена Димитрова',
    apartment: 'Управител',
    message: 'Благодаря на всички за навременните плащания този месец!',
    time: '1 ден',
    unread: false
  }
];

export function MessagesPanel({ expanded = false }: MessagesPanelProps) {
  const displayMessages = expanded ? messages : messages.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Съобщения</h2>
            <p className="text-gray-600 text-sm">Обща комуникация</p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {displayMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-4 hover:bg-gray-50 transition-colors ${
              msg.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900">{msg.sender}</h3>
                    {msg.unread && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">{msg.time}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{msg.apartment}</p>
                <p className="text-gray-700 text-sm">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!expanded && (
        <div className="p-4 border-t">
          <button className="w-full text-center text-blue-600 hover:text-blue-700">
            Виж всички съобщения
          </button>
        </div>
      )}
    </div>
  );
}
