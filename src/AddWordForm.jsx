import React from 'react';
import { X, ImagePlus } from 'lucide-react';

const AddWordForm = React.memo(({
  newWord,
  handleNewWordChange,
  handleExampleChange,
  addNewWord,
  setShowAddWordForm,
  emojiList,
  handleImageUpload,
  categories
}) => {
  const fileInputRef = React.useRef(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Добавить новое слово</h2>
          <button
            onClick={() => setShowAddWordForm(false)}
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
              value={newWord.english}
              onChange={(e) => handleNewWordChange('english', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hello"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Русский перевод *</label>
            <input
              type="text"
              value={newWord.russian}
              onChange={(e) => handleNewWordChange('russian', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Привет"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Произношение</label>
            <input
              type="text"
              value={newWord.pronunciation}
              onChange={(e) => handleNewWordChange('pronunciation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="he-ˈloʊ"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Категория</label>
            <select
              value={newWord.category}
              onChange={(e) => handleNewWordChange('category', e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Иконка или изображение</label>
            <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
              {emojiList.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleNewWordChange('image', emoji)}
                  className={`text-2xl w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 ${newWord.image === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ImagePlus className="w-5 h-5" />
                Выбрать изображение
              </button>
              {typeof newWord.image === 'string' && (newWord.image.startsWith('http') || newWord.image.startsWith('data:')) && (
                <img
                  src={newWord.image}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded mt-2"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Примеры использования</label>
            <input
              type="text"
              value={newWord.examples[0]}
              onChange={(e) => handleExampleChange(0, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Hello, how are you?"
            />
            <input
              type="text"
              value={newWord.examples[1]}
              onChange={(e) => handleExampleChange(1, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Say hello to your friend"
            />
          </div>

          <button
            onClick={addNewWord}
            disabled={!newWord.english || !newWord.russian}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Добавить (+2 монеты)
          </button>
        </div>
      </div>
    </div>
  );
});

export default AddWordForm;

