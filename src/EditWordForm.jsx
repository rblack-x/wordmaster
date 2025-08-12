import React from 'react';
import { X } from 'lucide-react';

const EditWordForm = React.memo(({
  word,
  handleWordChange,
  handleExampleChange,
  saveWord,
  onClose,
  emojiList,
  handleImageUpload,
  categories,
  resetProgress,
  markLearned,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Редактировать слово</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Английское слово *</label>
          <input
            type="text"
            value={word.english}
            onChange={(e) => handleWordChange('english', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hello"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Русский перевод *</label>
          <input
            type="text"
            value={word.russian}
            onChange={(e) => handleWordChange('russian', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Привет"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Произношение</label>
          <input
            type="text"
            value={word.pronunciation || ''}
            onChange={(e) => handleWordChange('pronunciation', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="he-ˈloʊ"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Категория</label>
          <select
            value={word.category}
            onChange={(e) => handleWordChange('category', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Иконка или изображение</label>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
            {emojiList.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleWordChange('image', emoji)}
                className={`text-2xl p-1 rounded hover:bg-gray-100 ${word.image === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) && (
              <img
                src={word.image}
                alt="preview"
                className="w-16 h-16 object-cover rounded mt-2"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Примеры использования</label>
          <input
            type="text"
            value={word.examples?.[0] || ''}
            onChange={(e) => handleExampleChange(0, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Hello, how are you?"
          />
          <input
            type="text"
            value={word.examples?.[1] || ''}
            onChange={(e) => handleExampleChange(1, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Say hello to your friend"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetProgress}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Сбросить прогресс
          </button>
          <button
            type="button"
            onClick={markLearned}
            className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Изучено
          </button>
        </div>

        <button
          onClick={saveWord}
          disabled={!word.english || !word.russian}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
));

export default EditWordForm;
