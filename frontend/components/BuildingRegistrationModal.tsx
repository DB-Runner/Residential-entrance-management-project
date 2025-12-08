import { Building2, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { buildingService, type BuildingRegistrationRequest } from '../services/buildingService';

interface BuildingRegistrationModalProps {
  onComplete: (code: string) => void;
}

export function BuildingRegistrationModal({ onComplete }: BuildingRegistrationModalProps) {
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [formData, setFormData] = useState<BuildingRegistrationRequest>({
    name: '',
    address: '',
    totalUnits: 0,
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalUnits' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const building = await buildingService.register(formData);
      if (building.accessCode) {
        setGeneratedCode(building.accessCode);
        setStep('code');
      } else {
        setError('Грешка при генериране на код');
      }
    } catch (err: any) {
      console.error('Building registration error:', err);
      setError(err.message || 'Грешка при регистрация на входа');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    // Fallback метод за копиране, който работи във всички браузъри
    const textArea = document.createElement('textarea');
    textArea.value = generatedCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      textArea.remove();
    }
  };

  const handleComplete = () => {
    onComplete(generatedCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {step === 'form' ? (
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-gray-900 mb-2">Регистрация на жилищен вход</h2>
              <p className="text-gray-600">
                За да започнете да използвате системата, моля регистрирайте вашия жилищен вход.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700">
                  Име на входа/сградата
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Например: Вход А, Сграда 1"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-2 text-gray-700">
                  Адрес
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="бул. Витоша 10"
                  required
                />
              </div>

              <div>
                <label htmlFor="totalUnits" className="block mb-2 text-gray-700">
                  Брой апартаменти
                </label>
                <input
                  type="number"
                  id="totalUnits"
                  name="totalUnits"
                  value={formData.totalUnits || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="24"
                  min="1"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Регистриране...' : 'Регистрирай и генерирай код'}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-gray-900 mb-2">Вход регистриран успешно!</h2>
              <p className="text-gray-600">
                Вашият уникален код за достъп е генериран.
              </p>
            </div>

            {/* Generated Code */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 text-center mb-3">Код за достъп:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-white px-6 py-4 rounded-lg border-2 border-blue-300">
                  <span className="text-blue-600 tracking-widest text-3xl">
                    {generatedCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Копирай код"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-600 text-sm text-center">Кодът е копиран!</p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-gray-900 mb-2">⚠️ Важно!</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Запазете този код на сигурно място</li>
                <li>• Споделете го само с жители от вашия вход</li>
                <li>• Жителите ще използват този код за регистрация в системата</li>
                <li>• Кодът ще бъде показан само веднъж</li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Разбрах, продължи
            </button>
          </div>
        )}
      </div>
    </div>
  );
}