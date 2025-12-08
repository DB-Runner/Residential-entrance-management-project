import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto text-center max-w-3xl">
        <h1 className="mb-6 text-blue-900">
          Управлявайте жилищния си вход лесно и ефективно
        </h1>
        <p className="mb-8 text-gray-600 text-lg">
          Модерна платформа за комуникация, управление на разходи и организация на жилищни входове
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вход
          </Link>
          <Link 
            to="/register"
            className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Регистрация
          </Link>
        </div>
      </div>
    </section>
  );
}