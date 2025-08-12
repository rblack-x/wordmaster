import React, { useState, useEffect } from 'react';
import { Trash2, ChevronRight, Plus, LayoutGrid, List, FolderPlus, Wand2 } from 'lucide-react';
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
  generateWord,
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const itemsPerPage = viewMode === 'grid' ? 18 : 25;
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentWords = filteredWords.slice(start, start + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [viewMode, filteredWords]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [currentPage, totalPages]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const pageIds = currentWords.map(w => w.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const deleteSelected = () => {
    selectedIds.forEach(id => deleteWord(id));
    setSelectedIds([]);
  };

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
              setSelectedIds(prev => prev.filter(id => id !== word.id));
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

  const ProgressCircle = ({ level }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const progress = level / maxLevel;
    return (
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r={radius}
            strokeWidth="4"
            className="text-gray-200"
            stroke="currentColor"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            strokeWidth="4"
            strokeLinecap="round"
            className="text-blue-500"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress * circumference}
            stroke="currentColor"
            fill="none"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs">{level}</span>
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
          <ProgressCircle level={word.level} />
          <div className="word-media">
            {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
              <img src={word.image} alt={word.english} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl grid place-items-center h-full w-full">{word.image}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="word-title truncate">{word.english}</h3>
            <p className="word-subtitle truncate">{word.russian}</p>
          </div>
        </div>
        <div className="word-right">
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
              setSelectedIds(prev => prev.filter(id => id !== word.id));
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
          <input
            type="checkbox"
            checked={selectedIds.includes(word.id)}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelect(word.id);
            }}
            className="w-4 h-4 ml-2"
          />
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
              onClick={generateWord}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Сгенерировать
            </button>
            <button
              onClick={() => setShowAddWordForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить слово
            </button>
            {viewMode === 'list' && (
              <>
                <button
                  onClick={selectAll}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  {currentWords.length > 0 && currentWords.every(w => selectedIds.includes(w.id)) ? 'Снять' : 'Выделить все'}
                </button>
                {selectedIds.length > 0 && (
                  <button
                    onClick={deleteSelected}
                    className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Удалить выбранные
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="words-grid">
            {currentWords.map(renderGridItem)}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentWords.map(renderListItem)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span className="text-sm">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordsList;
