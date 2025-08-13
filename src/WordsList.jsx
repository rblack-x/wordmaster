import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trash2, Plus, LayoutGrid, List, FolderPlus, Wand2, Upload, X, CheckSquare, SquareX, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDate } from './utils/formatDate';

const WordsList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredWords,
  maxLevel,
  deleteWord,
  setShowAddWordForm,
  onWordClick,
  addCategory,
  generateWord,
  importCSV,
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);
  const [sortOption, setSortOption] = useState('alpha');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showImportModal, setShowImportModal] = useState(false);

  const sortedWords = useMemo(() => {
    const wordsCopy = [...filteredWords];
    switch (sortOption) {
      case 'alpha':
        wordsCopy.sort((a, b) => a.english.localeCompare(b.english));
        if (sortOrder === 'desc') wordsCopy.reverse();
        break;
      case 'level':
        wordsCopy.sort((a, b) => a.level - b.level);
        if (sortOrder === 'desc') wordsCopy.reverse();
        break;
      case 'availability':
        wordsCopy.sort((a, b) => {
          const aMax = a.level === maxLevel;
          const bMax = b.level === maxLevel;
          if (aMax && !bMax) return 1;
          if (!aMax && bMax) return -1;
          const diff = (a.nextReview || 0) - (b.nextReview || 0);
          return sortOrder === 'desc' ? -diff : diff;
        });
        break;
      default:
        wordsCopy.sort((a, b) => a.english.localeCompare(b.english));
        if (sortOrder === 'desc') wordsCopy.reverse();
    }
    return wordsCopy;
  }, [filteredWords, sortOption, sortOrder, maxLevel]);

  const itemsPerPage = viewMode === 'grid' ? 18 : 25;
  const totalPages = Math.ceil(sortedWords.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentWords = sortedWords.slice(start, start + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [viewMode, filteredWords, sortOption, sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [currentPage, totalPages]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const pageIds = currentWords.map(w => w.id);
    setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
  };

  const clearSelection = () => setSelectedIds([]);

  const deleteSelected = () => {
    if (window.confirm(`Удалить выбранные слова (${selectedIds.length} шт.)?`)) {
      selectedIds.forEach(id => deleteWord(id, false));
      setSelectedIds([]);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importCSV(file);
      e.target.value = '';
      setShowImportModal(false);
    }
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
            <div
              className="progress-bar-fill"
              style={{
                width: `${(word.level / maxLevel) * 100}%`,
                background: word.level === maxLevel
                  ? 'linear-gradient(to right, #fbbf24, #f59e0b)'
                  : undefined,
              }}
            />
          </div>
          <span className="text-xs text-slate-500">
            {word.level === maxLevel ? '⭐' : `${word.level}/${maxLevel}`}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {word.status !== 'learning' && (
            <span className={`badge-base badge-status-${word.status}`}>
              {word.status === 'mastered' ? 'Изучено' : 'Новое'}
            </span>
          )}
          {word.level < maxLevel && (
            <span className={`badge-base ${repeatClass}`}>{repeatText}</span>
          )}
        </div>
      </div>
    );
  };

  const ProgressCircle = ({ level }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const progress = level / maxLevel;
    const isMax = level === maxLevel;
    return (
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90">
          {isMax && (
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          )}
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
            className={isMax ? '' : 'text-blue-500'}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress * circumference}
            stroke={isMax ? 'url(#goldGradient)' : 'currentColor'}
            fill="none"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs">{isMax ? '⭐' : level}</span>
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
          {word.level < maxLevel && (
            <span className={`badge-base ${repeatClass}`}>{repeatText}</span>
          )}
          <input
            type="checkbox"
            checked={selectedIds.includes(word.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleSelect(word.id)}
            className="w-4 h-4 ml-2"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="word-page">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex justify-end flex-wrap gap-2">
            <button
              onClick={generateWord}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Сгенерировать
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Импорт CSV
            </button>
            <button
              onClick={() => setShowAddWordForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить
            </button>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-4 pr-8 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Все' : cat}
                  </option>
                ))}
              </select>
              <div className="flex items-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="pl-4 pr-8 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="alpha">По алфавиту</option>
                  <option value="availability">По доступности</option>
                  <option value="level">По уровню</option>
                </select>
                <button
                  onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                  className="ml-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 justify-end">
              {viewMode === 'list' && (
                <>
                  <button
                    onClick={selectAll}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <CheckSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={clearSelection}
                    disabled={selectedIds.length === 0}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                  >
                    <SquareX className="w-5 h-5" />
                  </button>
                  <button
                    onClick={deleteSelected}
                    disabled={selectedIds.length === 0}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={addCategory}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <FolderPlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                {viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
              </button>
            </div>
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
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Импорт слов</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Файл должен содержать колонки в порядке: английское слово, русский перевод, произношение (необязательно), пример (необязательно). Каждая строка — отдельное слово.
            </p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Загрузить файл
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordsList;
