import React, { useState } from 'react';
import { Trash2, ChevronRight, Plus, LayoutGrid, List, FolderPlus } from 'lucide-react';
import { formatDate } from './utils/formatDate';

const WordsList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredWords,
  maxLevel,
  deleteWord,
  setCurrentCardIndex,
  setReviewWords,
  setCurrentView,
  setShowAnswer,
  setShowAddWordForm,
  onWordClick,
  addCategory,
}) => {
  const [viewMode, setViewMode] = useState('grid');

  const renderGridItem = (word) => {
    const isAvailable = word.nextReview <= Date.now();
    const repeatText = isAvailable
      ? 'Доступно'
      : `Будет доступно ${formatDate(word.nextReview)}`;
    const repeatClass = isAvailable ? 'badge-available' : 'badge-repeat';
    return (
      <div
        key={word.id}
        className="word-card-grid cursor-pointer"
        onClick={() => onWordClick(word)}
      >
        <div className="word-media mx-auto">
          {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
            <img src={word.image} alt={word.english} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl grid place-items-center h-full w-full">{word.image}</span>
          )}
        </div>
        <h3 className="word-title text-center">{word.english}</h3>
        <p className="word-subtitle text-center">{word.russian}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${(word.level / maxLevel) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-500">{word.level}/{maxLevel}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {word.status !== 'learning' && (
            <span className={`badge-base badge-status-${word.status}`}>
              {word.status === 'mastered' ? 'Изучено' : 'Новое'}
            </span>
          )}
          <span className={`badge-base ${repeatClass}`}>{repeatText}</span>
        </div>
        <div className="word-actions justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteWord(word.id);
            }}
            className="icon-btn icon-danger"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
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
  };

  const renderListItem = (word) => {
    const isAvailable = word.nextReview <= Date.now();
    const repeatText = isAvailable
      ? 'Доступно'
      : `Будет доступно ${formatDate(word.nextReview)}`;
    const repeatClass = isAvailable ? 'badge-available' : 'badge-repeat';
    return (
      <div
        key={word.id}
        className="word-card-list cursor-pointer"
        onClick={() => onWordClick(word)}
      >
        <div className="word-left">
          <div className="word-media">
            {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
              <img src={word.image} alt={word.english} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl grid place-items-center h-full w-full">{word.image}</span>
            )}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="word-title truncate">{word.english}</h3>
            <p className="word-subtitle truncate">{word.russian}</p>
          </div>
        </div>
        <div className="word-right">
          <div className="flex items-center gap-2">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${(word.level / maxLevel) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500">{word.level}/{maxLevel}</span>
          </div>
          {word.status !== 'learning' && (
            <span className={`badge-base badge-status-${word.status}`}>
              {word.status === 'mastered' ? 'Изучено' : 'Новое'}
            </span>
          )}
          <span className={`badge-base ${repeatClass}`}>{repeatText}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteWord(word.id);
            }}
            className="icon-btn icon-danger"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
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
  };

  return (
    <div className="word-page">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Все' : cat}
                </option>
              ))}
            </select>
            <button
              onClick={addCategory}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <FolderPlus className="w-5 h-5" />
            </button>
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
          <div className="flex flex-col gap-4">
            {filteredWords.map(renderListItem)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordsList;
