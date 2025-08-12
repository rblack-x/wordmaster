import React, { useState } from 'react';
import { Star, Trash2, ChevronRight, Plus, LayoutGrid, List } from 'lucide-react';
import { formatDate } from './utils/formatDate';

const WordsList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredWords,
  maxLevel,
  toggleStar,
  deleteWord,
  setCurrentCardIndex,
  setReviewWords,
  setCurrentView,
  setShowAnswer,
  setShowAddWordForm,
}) => {
  const [viewMode, setViewMode] = useState('list');

  const renderGridItem = (word) => (
    <div key={word.id} className="word-card-grid">
      <div className="word-media mx-auto">
        {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
          <img src={word.image} alt={word.english} className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl grid place-items-center h-full w-full">{word.image}</span>
        )}
      </div>
      <h3 className="word-title text-center">{word.english}</h3>
      <p className="word-subtitle text-center">{word.russian}</p>
      <div className="flex items-center gap-2">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(word.level / maxLevel) * 100}%` }} />
        </div>
        <span className="text-xs text-slate-500">{word.level}/{maxLevel}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <span className={`badge-base badge-status-${word.status}`}>
          {word.status === 'mastered' ? 'Изучено' : word.status === 'learning' ? 'Изучается' : 'Новое'}
        </span>
        <span className="badge-base badge-cat">{word.category}</span>
        <span className="badge-base badge-repeat">Повтор {formatDate(word.nextReview)}</span>
      </div>
      <div className="word-actions justify-center">
        <button
          onClick={() => toggleStar(word.id)}
          className={`icon-btn ${word.starred ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : ''}`}
        >
          <Star className={`w-5 h-5 ${word.starred ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={() => deleteWord(word.id)}
          className="icon-btn icon-danger"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setCurrentCardIndex(filteredWords.findIndex(w => w.id === word.id));
            setReviewWords(filteredWords);
            setCurrentView('cards');
            setShowAnswer(false);
          }}
          className="icon-btn icon-primary"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderListItem = (word) => (
    <div key={word.id} className="word-card-list">
      <div className="word-left">
        <div className="word-media">
          {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
            <img src={word.image} alt={word.english} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl grid place-items-center h-full w-full">{word.image}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="word-title truncate">{word.english}</h3>
          <p className="word-subtitle truncate">{word.russian}</p>
        </div>
      </div>
      <div className="word-right">
        <div className="flex flex-wrap justify-end gap-2">
          <span className={`badge-base badge-status-${word.status}`}>
            {word.status === 'mastered' ? 'Изучено' : word.status === 'learning' ? 'Изучается' : 'Новое'}
          </span>
          <span className="badge-base badge-cat">{word.category}</span>
          <span className="badge-base badge-repeat">Повтор {formatDate(word.nextReview)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${(word.level / maxLevel) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-500">{word.level}/{maxLevel}</span>
        </div>
        <div className="word-actions">
          <button
            onClick={() => toggleStar(word.id)}
            className={`icon-btn ${word.starred ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : ''}`}
          >
            <Star className={`w-5 h-5 ${word.starred ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => deleteWord(word.id)}
            className="icon-btn icon-danger"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCurrentCardIndex(filteredWords.findIndex(w => w.id === word.id));
              setReviewWords(filteredWords);
              setCurrentView('cards');
              setShowAnswer(false);
            }}
            className="icon-btn icon-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-surface">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Все' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              {viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowAddWordForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить слово
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="words-grid">
            {filteredWords.map(renderGridItem)}
          </div>
        ) : (
          <div className="words-list">
            {filteredWords.map(renderListItem)}
          </div>
        )}

      </div>
    </div>
  );
};

export default WordsList;
