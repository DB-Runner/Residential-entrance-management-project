import { useState } from 'react';
import { Upload, File, Download, Trash2, Search, Filter, Calendar, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'excel' | 'other';
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

// Mock данни
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Протокол от ОС - Януари 2024.pdf',
    type: 'pdf',
    category: 'Протоколи',
    uploadedBy: 'Иван Петров',
    uploadedAt: '2024-01-15',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Годишен финансов отчет 2023.xlsx',
    type: 'excel',
    category: 'Финанси',
    uploadedBy: 'Мария Георгиева',
    uploadedAt: '2024-01-10',
    size: '1.1 MB',
  },
  {
    id: '3',
    name: 'Снимка щети асансьор.jpg',
    type: 'image',
    category: 'Инциденти',
    uploadedBy: 'Георги Димитров',
    uploadedAt: '2024-01-05',
    size: '3.2 MB',
  },
];

const categories = ['Всички', 'Протоколи', 'Финанси', 'Инциденти', 'Договори', 'Кореспонденция', 'Други'];

export function ArchiveManagement() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всички');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState('Протоколи');

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Всички' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFiles(e.target.files);
    }
  };

  const handleUpload = () => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    // Тук ще се прави API заявка към backend-а
    // За сега добавяме mock документ
    const newDocs: Document[] = Array.from(uploadFiles).map((file, index) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let type: Document['type'] = 'other';
      
      if (extension === 'pdf') type = 'pdf';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) type = 'image';
      else if (['xlsx', 'xls', 'csv'].includes(extension)) type = 'excel';

      return {
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type,
        category: uploadCategory,
        uploadedBy: 'Текущ потребител',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };
    });

    setDocuments([...newDocs, ...documents]);
    setIsUploadModalOpen(false);
    setUploadFiles(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този документ?')) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900">Архив</h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Качи документ
        </button>
      </div>

      {/* Филтри */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Търсене */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Търсене по име на документ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Категория */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Списък с документи */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Няма намерени документи</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Документ</th>
                  <th className="px-6 py-3 text-left text-gray-700">Категория</th>
                  <th className="px-6 py-3 text-left text-gray-700">Качен от</th>
                  <th className="px-6 py-3 text-left text-gray-700">Дата</th>
                  <th className="px-6 py-3 text-left text-gray-700">Размер</th>
                  <th className="px-6 py-3 text-right text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <span className="text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doc.uploadedBy}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(doc.uploadedAt).toLocaleDateString('bg-BG')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doc.size}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert('Изтегляне на документ (API заявка)')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Изтегли"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Изтрий"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">Качване на документ</h2>

            <div className="space-y-4">
              {/* Избор на категория */}
              <div>
                <label className="block text-gray-700 mb-2">Категория</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter((cat) => cat !== 'Всички').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Избор на файл */}
              <div>
                <label className="block text-gray-700 mb-2">Файл</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">
                      Кликнете за избор на файлове
                    </p>
                    <p className="text-gray-400 text-sm">
                      PDF, снимки, Excel, Word
                    </p>
                  </label>
                </div>
                {uploadFiles && uploadFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {Array.from(uploadFiles).map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <File className="w-4 h-4" />
                        <span>{file.name}</span>
                        <span className="text-gray-400">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFiles(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Откажи
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFiles || uploadFiles.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Качи
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
