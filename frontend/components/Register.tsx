import { Building2, Mail, Lock, User, Home, Shield, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole as DBUserRole } from '../types/database';

type UserRole = 'resident' | 'admin';

export function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('resident');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    /*buildingName: '',
    apartment: ''*/
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация на паролите
    if (formData.password !== formData.confirmPassword) {
      setError('Паролите не съвпадат');
      return;
    }

    setLoading(true);

    try {
      const dbRole = role === 'admin' ? DBUserRole.ADMIN : DBUserRole.RESIDENT;
      
      await authService.register({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: dbRole,
        /*unitNumber: role === 'resident' ? formData.apartment : undefined, */
      });

      // Успешна регистрация - пренасочваме към съответния dashboard
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Registration error:', err);

      // Обработка на различни типове грешки
      if (err.message) {
        // Ако грешката има съобщение, използваме го
        if (err.message.toLowerCase().includes('already exists') || 
            err.message.toLowerCase().includes('вече съществува') ||
            err.message.toLowerCase().includes('email already in use')) {
          setError('Потребител с този имейл вече съществува. Моля, използвайте друг имейл или влезте в профила си.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Грешка при регистрация. Моля опитайте отново.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Лого и заглавие */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="mb-2 text-gray-900">Създайте акаунт</h2>
            <p className="text-gray-600">Присъединете се към платформата SmartEntrance</p>
          </div>

          {/* Съобщение за грешка */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Форма за регистрация */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Избор на роля */}
            <div>
              <label className="block mb-6 text-gray-700 text-center mx-auto">
                <b>
                  Регистрирам се като
                </b>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('resident')}
                  className={`py-4 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    role === 'resident'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Жител</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-4 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    role === 'admin'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Домоуправител</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Име */}
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700">
                  Име и фамилия
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
              </div>

              {/* Имейл */}
              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700">
                  Имейл адрес
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="vashemail@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Парола */}
              <div>
                <label htmlFor="password" className="block mb-2 text-gray-700">
                  Парола
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Потвърждаване на парола */}
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-gray-700">
                  Потвърдете паролата
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/*<div className="border-t pt-5 mt-5">
              <h3 className="mb-4 text-gray-900">
                {role === 'admin' ? 'Информация за управление' : 'Информация за жилището'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            */}  
                {/* Име на вход */}
                {/*
                <div>
                  <label htmlFor="buildingName" className="block mb-2 text-gray-700">
                    Име/адрес на вход
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="buildingName"
                      name="buildingName"
                      value={formData.buildingName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="бул. Витоша 10"
                      required
                    />
                  </div>
                </div>
                */}

                {/* Апартамент */}
                {/*
                <div>
                  <label htmlFor="apartment" className="block mb-2 text-gray-700">
                    {role === 'admin' ? 'Брой апартаменти' : 'Номер на апартамент'}
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={role === 'admin' ? '24' : '№ 12'}
                    required
                  />
                </div>
                */}
            {/*
              </div>
            </div>
            */}

            {/* Съгласие с условия */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-gray-700">
                Съгласен съм с <button type="button" className="text-blue-600 hover:text-blue-700">условията за ползване</button> и <button type="button" className="text-blue-600 hover:text-blue-700">политиката за поверителност</button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистриране...' : 'Регистрация'}
            </button>
          </form>

          {/* Линк към вход */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Вече имате акаунт?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Влезте тук
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}