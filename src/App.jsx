import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Trophy, Star, Clock, Target, Award, Zap, ChevronRight, X, Check, RotateCcw, Volume2, Heart, Flame, Plus, Edit2, Trash2, Save, Shuffle, PenTool, Headphones, Eye, Keyboard, ShoppingCart, BarChart3, TrendingUp, Calendar, Info, Coins, Sparkles, Palette, Music, Rocket } from 'lucide-react';

const EnglishLearningApp = () => {
  // Начальная база слов с категориями
  const initialWords = [
    {
      id: 1,
      english: 'Adventure',
      russian: 'Приключение',
      category: 'Путешествия',
      image: '🗺️',
      examples: ['Life is an adventure', 'We went on an adventure'],
      pronunciation: 'əd-ˈven-chər',
      difficulty: 1,
      nextReview: new Date().getTime(),
      reviewCount: 0,
      correctCount: 0,
      starred: false,
      status: 'new',
      createdAt: new Date().getTime(),
      lastReviewed: null
    },
    {
      id: 2,
      english: 'Mountain',
      russian: 'Гора',
      category: 'Природа',
      image: '⛰️',
      examples: ['The mountain is very high', 'We climbed the mountain'],
      pronunciation: 'ˈmaʊn-tən',
      difficulty: 1,
      nextReview: new Date().getTime(),
      reviewCount: 0,
      correctCount: 0,
      starred: false,
      status: 'new',
      createdAt: new Date().getTime(),
      lastReviewed: null
    },
    {
      id: 3,
      english: 'Happiness',
      russian: 'Счастье',
      category: 'Эмоции',
      image: '😊',
      examples: ['Happiness is a choice', 'She found happiness in small things'],
      pronunciation: 'ˈhæp-i-nəs',
      difficulty: 2,
      nextReview: new Date().getTime(),
      reviewCount: 0,
      correctCount: 0,
      starred: false,
      status: 'new',
      createdAt: new Date().getTime(),
      lastReviewed: null
    },
    {
      id: 4,
      english: 'Knowledge',
      russian: 'Знание',
      category: 'Образование',
      image: '📚',
      examples: ['Knowledge is power', 'He has vast knowledge'],
      pronunciation: 'ˈnɒl-ɪdʒ',
      difficulty: 2,
      nextReview: new Date().getTime(),
      reviewCount: 0,
      correctCount: 0,
      starred: false,
      status: 'new',
      createdAt: new Date().getTime(),
      lastReviewed: null
    },
    {
      id: 5,
      english: 'Ocean',
      russian: 'Океан',
      category: 'Природа',
      image: '🌊',
      examples: ['The ocean is deep', 'We sailed across the ocean'],
      pronunciation: 'ˈoʊ-ʃən',
      difficulty: 1,
      nextReview: new Date().getTime(),
      reviewCount: 0,
      correctCount: 0,
      starred: false,
      status: 'new',
      createdAt: new Date().getTime(),
      lastReviewed: null
    }
  ];

  // Магазин улучшений
  const shopItems = [
    { id: 'theme-dark', name: 'Тёмная тема', icon: '🌙', price: 50, type: 'theme', description: 'Приятная для глаз тёмная тема' },
    { id: 'theme-ocean', name: 'Океанская тема', icon: '🌊', price: 75, type: 'theme', description: 'Освежающие океанские цвета' },
    { id: 'theme-forest', name: 'Лесная тема', icon: '🌲', price: 75, type: 'theme', description: 'Спокойные зелёные тона' },
    { id: 'boost-xp', name: 'XP Бустер', icon: '⚡', price: 100, type: 'boost', description: 'x2 XP на 24 часа' },
    { id: 'boost-coins', name: 'Монетный магнит', icon: '🧲', price: 150, type: 'boost', description: 'x2 монет на 24 часа' },
    { id: 'hint-pack', name: 'Пакет подсказок', icon: '💡', price: 30, type: 'consumable', description: '+5 подсказок для тренировок' },
    { id: 'streak-freeze', name: 'Заморозка серии', icon: '🧊', price: 200, type: 'consumable', description: 'Сохранить серию при пропуске дня' },
    { id: 'unlock-category', name: 'Новая категория', icon: '📦', price: 300, type: 'unlock', description: 'Разблокировать премиум категорию' }
  ];

  // Загрузка сохраненных данных из localStorage
  const loadSavedData = () => {
    try {
      const savedWords = localStorage.getItem('wordmaster_words');
      const savedStats = localStorage.getItem('wordmaster_stats');
      
      return {
        words: savedWords ? JSON.parse(savedWords) : initialWords,
        stats: savedStats ? JSON.parse(savedStats) : {
          level: 1,
          xp: 0,
          streak: 1,
          totalWords: 0,
          masteredWords: 0,
          coins: 100,
          hintsRemaining: 3,
          purchasedItems: [],
          activeBoosts: [],
          currentTheme: 'default',
          totalReviews: 0,
          perfectDays: 0,
          bestStreak: 1,
          startDate: new Date().getTime()
        }
      };
    } catch (error) {
      console.error('Error loading saved data:', error);
      return {
        words: initialWords,
        stats: {
          level: 1,
          xp: 0,
          streak: 1,
          totalWords: 0,
          masteredWords: 0,
          coins: 100,
          hintsRemaining: 3,
          purchasedItems: [],
          activeBoosts: [],
          currentTheme: 'default',
          totalReviews: 0,
          perfectDays: 0,
          bestStreak: 1,
          startDate: new Date().getTime()
        }
      };
    }
  };

  const savedData = loadSavedData();
  const [words, setWords] = useState(savedData.words);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userStats, setUserStats] = useState(savedData.stats);
  const [trainingMode, setTrainingMode] = useState(null);
  const [trainingWords, setTrainingWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [showAddWordForm, setShowAddWordForm] = useState(false);
  const [newWord, setNewWord] = useState({
    english: '',
    russian: '',
    category: '',
    image: '📝',
    examples: ['', ''],
    pronunciation: ''
  });

  // Список эмодзи для выбора
  const emojiList = ['📝', '🌟', '🌈', '🔥', '💡', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🏆', '🚀', '✨', '💎', '🌺', '🌸', '🌼', '🌻', '🌷', '🌹', '🍀', '🌲', '🌳', '🌴', '🌵', '🌊', '⛰️', '🏔️', '🌋', '🏝️', '🏖️', '🌅', '🌄', '🌠', '🌌', '☀️', '🌙', '⭐', '☁️', '⛅', '🌤️', '🌥️', '🌦️', '🌧️', '⛈️', '❄️', '☃️', '🌨️'];

  // Сохранение данных в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wordmaster_words', JSON.stringify(words));
    } catch (error) {
      console.error('Error saving words:', error);
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem('wordmaster_stats', JSON.stringify(userStats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }, [userStats]);

  // Получить уникальные категории
  const categories = useMemo(() => ['all', ...new Set(words.map(w => w.category))], [words]);

  // Фильтрация слов по категории
  const filteredWords = useMemo(() => 
    selectedCategory === 'all' 
      ? words 
      : words.filter(w => w.category === selectedCategory),
    [words, selectedCategory]
  );

  // Форматирование даты для отображения
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Никогда';
    const now = new Date();
    const date = new Date(timestamp);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      if (date > now) {
        return `через ${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'}`;
      }
      return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'} назад`;
    } else if (diffHours > 0) {
      if (date > now) {
        return `через ${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'}`;
      }
      return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`;
    } else if (diffMinutes > 0) {
      if (date > now) {
        return `через ${diffMinutes} ${diffMinutes === 1 ? 'минуту' : diffMinutes < 5 ? 'минуты' : 'минут'}`;
      }
      return `${diffMinutes} ${diffMinutes === 1 ? 'минуту' : diffMinutes < 5 ? 'минуты' : 'минут'} назад`;
    }
    return 'только что';
  };

  // Слова для повторения (по алгоритму интервального повторения)
  const wordsToReview = useMemo(() => 
    words.filter(w => w.nextReview <= new Date().getTime() && w.status !== 'mastered'),
    [words]
  );

  // Интервальное повторение (алгоритм SM-2 упрощенный)
  const calculateNextReview = useCallback((word, correct) => {
    const intervals = [
      1000 * 60 * 10,        // 10 минут
      1000 * 60 * 60,        // 1 час
      1000 * 60 * 60 * 6,    // 6 часов
      1000 * 60 * 60 * 24,   // 1 день
      1000 * 60 * 60 * 24 * 3,  // 3 дня
      1000 * 60 * 60 * 24 * 7,  // 7 дней
      1000 * 60 * 60 * 24 * 14, // 14 дней
      1000 * 60 * 60 * 24 * 30, // 30 дней
      1000 * 60 * 60 * 24 * 90  // 90 дней
    ];
    
    let nextInterval;
    
    if (correct) {
      const nextIndex = Math.min(word.correctCount, intervals.length - 1);
      nextInterval = intervals[nextIndex];
    } else {
      nextInterval = intervals[0]; // Если ошибка, повторить через 10 минут
    }
    
    return new Date().getTime() + nextInterval;
  }, []);

  // Покупка в магазине
  const purchaseItem = useCallback((item) => {
    if (userStats.coins >= item.price && !userStats.purchasedItems.includes(item.id)) {
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins - item.price,
        purchasedItems: [...prev.purchasedItems, item.id],
        currentTheme: item.type === 'theme' ? item.id : prev.currentTheme,
        hintsRemaining: item.id === 'hint-pack' ? prev.hintsRemaining + 5 : prev.hintsRemaining,
        activeBoosts: item.type === 'boost' ? [...prev.activeBoosts, { id: item.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }] : prev.activeBoosts
      }));
      
      alert(`✨ Успешно куплено: ${item.name}!`);
    } else if (userStats.coins < item.price) {
      alert(`❌ Недостаточно монет! Нужно ещё ${item.price - userStats.coins} монет.`);
    } else {
      alert('❌ Вы уже купили этот предмет!');
    }
  }, [userStats.coins, userStats.purchasedItems]);

  // Получить тему
  const getThemeColors = useCallback(() => {
    switch(userStats.currentTheme) {
      case 'theme-dark':
        return 'bg-gradient-to-br from-gray-900 to-gray-700';
      case 'theme-ocean':
        return 'bg-gradient-to-br from-blue-400 to-cyan-300';
      case 'theme-forest':
        return 'bg-gradient-to-br from-green-400 to-emerald-300';
      default:
        return 'bg-gradient-to-br from-blue-50 to-purple-50';
    }
  }, [userStats.currentTheme]);

  // Обработка ответа на карточке
  const handleCardAnswer = useCallback((correct) => {
    const currentWord = filteredWords[currentCardIndex];
    const updatedWords = words.map(w => {
      if (w.id === currentWord.id) {
        const newCorrectCount = correct ? w.correctCount + 1 : 0;
        const newStatus = newCorrectCount >= 5 ? 'mastered' : newCorrectCount > 0 ? 'learning' : 'new';
        
        return {
          ...w,
          reviewCount: w.reviewCount + 1,
          correctCount: newCorrectCount,
          nextReview: calculateNextReview(w, correct),
          status: newStatus,
          lastReviewed: new Date().getTime()
        };
      }
      return w;
    });
    
    setWords(updatedWords);
    
    // Проверка активных бустов
    const hasXPBoost = userStats.activeBoosts.some(b => b.id === 'boost-xp' && b.expiresAt > Date.now());
    const hasCoinBoost = userStats.activeBoosts.some(b => b.id === 'boost-coins' && b.expiresAt > Date.now());
    
    // Обновление статистики и геймификация
    if (correct) {
      setUserStats(prev => ({
        ...prev,
        xp: prev.xp + (hasXPBoost ? 20 : 10),
        coins: prev.coins + (hasCoinBoost ? 10 : 5),
        totalWords: prev.totalWords + (currentWord.reviewCount === 0 ? 1 : 0),
        masteredWords: updatedWords.filter(w => w.status === 'mastered').length,
        level: Math.floor((prev.xp + (hasXPBoost ? 20 : 10)) / 100) + 1,
        totalReviews: prev.totalReviews + 1
      }));
    } else {
      setUserStats(prev => ({
        ...prev,
        totalReviews: prev.totalReviews + 1
      }));
    }
    
    // Переход к следующей карточке
    setTimeout(() => {
      setShowAnswer(false);
      if (currentCardIndex < filteredWords.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentView('dashboard');
        setCurrentCardIndex(0);
      }
    }, 1000);
  }, [words, filteredWords, currentCardIndex, userStats.activeBoosts, calculateNextReview]);

  // Переключение закрепленных слов
  const toggleStar = useCallback((wordId) => {
    setWords(prev => prev.map(w => 
      w.id === wordId ? { ...w, starred: !w.starred } : w
    ));
  }, []);

  // Удаление слова
  const deleteWord = useCallback((wordId) => {
    if (window.confirm('Вы уверены, что хотите удалить это слово?')) {
      setWords(prev => prev.filter(w => w.id !== wordId));
    }
  }, []);

  // Добавление нового слова
  const addNewWord = useCallback(() => {
    if (newWord.english && newWord.russian) {
      const word = {
        ...newWord,
        id: Date.now(),
        category: newWord.category || 'Мои слова',
        examples: newWord.examples.filter(ex => ex.length > 0),
        difficulty: 1,
        nextReview: new Date().getTime(),
        reviewCount: 0,
        correctCount: 0,
        starred: false,
        status: 'new',
        createdAt: new Date().getTime(),
        lastReviewed: null
      };
      
      setWords(prev => [...prev, word]);
      setNewWord({
        english: '',
        russian: '',
        category: '',
        image: '📝',
        examples: ['', ''],
        pronunciation: ''
      });
      setShowAddWordForm(false);
      
      // Награда за добавление слова
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins + 2
      }));
    }
  }, [newWord]);

  // Начать тренировку
  const startTraining = useCallback((mode) => {
    setTrainingMode(mode);
    const wordsForTraining = words.filter(w => w.status !== 'mastered').slice(0, 10);
    
    if (wordsForTraining.length === 0) {
      alert('Нет слов для тренировки! Добавьте новые слова или сбросьте прогресс существующих.');
      return;
    }
    
    setTrainingWords(wordsForTraining);
    generateQuestion(wordsForTraining, mode);
    setCurrentView('training');
    setUserInput('');
    setShowHint(false);
    setSelectedLetters([]);
  }, [words]);

  // Генерация вопроса для тренажера
  const generateQuestion = useCallback((wordsPool, mode) => {
    if (wordsPool.length === 0) return;
    
    const correctWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    
    if (mode === 'multiple-choice-en-ru' || mode === 'multiple-choice-ru-en') {
      const otherWords = words.filter(w => w.id !== correctWord.id);
      const wrongAnswers = [];
      
      for (let i = 0; i < 3 && i < otherWords.length; i++) {
        wrongAnswers.push(otherWords[Math.floor(Math.random() * otherWords.length)]);
      }
      
      const allAnswers = [correctWord, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      setCurrentQuestion({
        word: correctWord,
        answers: allAnswers,
        correctId: correctWord.id
      });
    } else if (mode === 'typing-en-ru' || mode === 'typing-ru-en') {
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: mode === 'typing-en-ru' ? correctWord.russian : correctWord.english
      });
    } else if (mode === 'scramble') {
      const letters = correctWord.english.toLowerCase().split('');
      const scrambled = [...letters].sort(() => Math.random() - 0.5);
      setScrambledLetters(scrambled.map((letter, index) => ({ letter, id: index, used: false })));
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: correctWord.english.toLowerCase()
      });
    } else if (mode === 'listening') {
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: correctWord.english
      });
    } else if (mode === 'first-letter') {
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: correctWord.english,
        hint: correctWord.english[0].toUpperCase() + '_'.repeat(correctWord.english.length - 1)
      });
    }
    
    setSelectedAnswer(null);
    setShowResult(false);
  }, [words]);

  // Проверка ответа в тренажере
  const checkAnswer = useCallback((answer) => {
    let correct = false;
    
    if (trainingMode === 'multiple-choice-en-ru' || trainingMode === 'multiple-choice-ru-en') {
      setSelectedAnswer(answer);
      correct = answer === currentQuestion.correctId;
    } else if (trainingMode === 'typing-en-ru' || trainingMode === 'typing-ru-en' || trainingMode === 'listening' || trainingMode === 'first-letter') {
      correct = userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase();
    } else if (trainingMode === 'scramble') {
      const assembled = selectedLetters.map(l => l.letter).join('');
      correct = assembled === currentQuestion.correctAnswer;
    }
    
    setShowResult(true);
    
    // Проверка активных бустов
    const hasXPBoost = userStats.activeBoosts.some(b => b.id === 'boost-xp' && b.expiresAt > Date.now());
    const hasCoinBoost = userStats.activeBoosts.some(b => b.id === 'boost-coins' && b.expiresAt > Date.now());
    
    if (correct) {
      setUserStats(prev => ({
        ...prev,
        xp: prev.xp + (hasXPBoost ? 30 : 15),
        coins: prev.coins + (hasCoinBoost ? 20 : 10),
        streak: prev.streak + 1,
        level: Math.floor((prev.xp + (hasXPBoost ? 30 : 15)) / 100) + 1,
        totalReviews: prev.totalReviews + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1)
      }));
    } else {
      setUserStats(prev => ({
        ...prev,
        streak: 0,
        totalReviews: prev.totalReviews + 1
      }));
    }
    
    // Обновляем статистику слова
    setWords(prev => prev.map(w => {
      if (w.id === currentQuestion.word.id) {
        const newCorrectCount = correct ? w.correctCount + 1 : Math.max(0, w.correctCount - 1);
        return {
          ...w,
          reviewCount: w.reviewCount + 1,
          correctCount: newCorrectCount,
          nextReview: calculateNextReview(w, correct),
          status: newCorrectCount >= 5 ? 'mastered' : newCorrectCount > 0 ? 'learning' : 'new',
          lastReviewed: new Date().getTime()
        };
      }
      return w;
    }));
    
    setTimeout(() => {
      const remainingWords = trainingWords.filter(w => w.id !== currentQuestion.word.id);
      if (remainingWords.length > 0) {
        setTrainingWords(remainingWords);
        generateQuestion(remainingWords, trainingMode);
        setUserInput('');
        setSelectedLetters([]);
        setShowHint(false);
      } else {
        setCurrentView('dashboard');
      }
    }, 2000);
  }, [trainingMode, currentQuestion, userInput, selectedLetters, userStats.activeBoosts, trainingWords, calculateNextReview, generateQuestion]);

  // Использовать подсказку
  const useHint = useCallback(() => {
    if (userStats.hintsRemaining > 0) {
      setShowHint(true);
      setUserStats(prev => ({
        ...prev,
        hintsRemaining: prev.hintsRemaining - 1
      }));
    } else {
      alert('У вас закончились подсказки! Купите больше в магазине.');
    }
  }, [userStats.hintsRemaining]);

  // Обработка выбора букв для scramble режима
  const handleLetterClick = useCallback((letter, fromScrambled) => {
    if (showResult) return;
    
    if (fromScrambled && !letter.used) {
      setSelectedLetters(prev => [...prev, letter]);
      setScrambledLetters(prev => prev.map(l => 
        l.id === letter.id ? { ...l, used: true } : l
      ));
    } else if (!fromScrambled) {
      setSelectedLetters(prev => prev.filter(l => l.id !== letter.id));
      setScrambledLetters(prev => prev.map(l => 
        l.id === letter.id ? { ...l, used: false } : l
      ));
    }
  }, [showResult]);

  // Обработчики для формы добавления слова
  const handleNewWordChange = useCallback((field, value) => {
    setNewWord(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleExampleChange = useCallback((index, value) => {
    setNewWord(prev => {
      const newExamples = [...prev.examples];
      newExamples[index] = value;
      return { ...prev, examples: newExamples };
    });
  }, []);

  // Компонент формы добавления слова (мемоизирован)
  const AddWordForm = React.memo(() => (
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hello"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Русский перевод *</label>
            <input
              type="text"
              value={newWord.russian}
              onChange={(e) => handleNewWordChange('russian', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Привет"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Произношение</label>
            <input
              type="text"
              value={newWord.pronunciation}
              onChange={(e) => handleNewWordChange('pronunciation', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="he-ˈloʊ"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Категория</label>
            <input
              type="text"
              value={newWord.category}
              onChange={(e) => handleNewWordChange('category', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Мои слова"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Иконка</label>
            <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
              {emojiList.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleNewWordChange('image', emoji)}
                  className={`text-2xl p-1 rounded hover:bg-gray-100 ${
                    newWord.image === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Примеры использования</label>
            <input
              type="text"
              value={newWord.examples[0]}
              onChange={(e) => handleExampleChange(0, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Hello, how are you?"
            />
            <input
              type="text"
              value={newWord.examples[1]}
              onChange={(e) => handleExampleChange(1, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Say hello to your friend"
            />
          </div>
          
          <button
            onClick={addNewWord}
            disabled={!newWord.english || !newWord.russian}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Добавить слово (+2 монеты)
          </button>
        </div>
      </div>
    </div>
  ));

  // Компонент магазина
  const Shop = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Магазин улучшений</h2>
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-700">{userStats.coins}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map(item => (
            <div
              key={item.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                userStats.purchasedItems.includes(item.id) 
                  ? 'border-gray-300 bg-gray-50 opacity-50' 
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="font-bold">{item.price}</span>
                </div>
                
                <button
                  onClick={() => purchaseItem(item)}
                  disabled={userStats.purchasedItems.includes(item.id) || userStats.coins < item.price}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    userStats.purchasedItems.includes(item.id)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : userStats.coins < item.price
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {userStats.purchasedItems.includes(item.id) ? 'Куплено' : 'Купить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Как заработать монеты?
        </h3>
        <ul className="space-y-1 text-sm">
          <li>• Правильный ответ в карточках: +5 монет (x2 с бустером)</li>
          <li>• Правильный ответ в тренировке: +10 монет (x2 с бустером)</li>
          <li>• Добавление нового слова: +2 монеты</li>
          <li>• Достижение нового уровня: +50 монет</li>
        </ul>
      </div>
    </div>
  );

  // Компонент статистики
  const Statistics = () => {
    const daysActive = Math.floor((Date.now() - userStats.startDate) / (1000 * 60 * 60 * 24)) || 1;
    const averageReviewsPerDay = Math.round(userStats.totalReviews / daysActive);
    const successRate = userStats.totalReviews > 0 
      ? Math.round((words.filter(w => w.status === 'mastered').length / words.length) * 100)
      : 0;
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Общая статистика */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Общая статистика</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{userStats.level}</p>
              <p className="text-sm text-gray-600">Уровень</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{successRate}%</p>
              <p className="text-sm text-gray-600">Успешность</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Flame className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{userStats.bestStreak}</p>
              <p className="text-sm text-gray-600">Лучшая серия</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-900">{daysActive}</p>
              <p className="text-sm text-gray-600">Дней активности</p>
            </div>
          </div>
        </div>
        
        {/* Как работает интервальное повторение */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Как работает интервальное повторение?
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Интервальное повторение</strong> — это научно обоснованный метод запоминания, 
              основанный на кривой забывания Эббингауза. Информация повторяется через увеличивающиеся промежутки времени.
            </p>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold mb-2">📊 Интервалы повторения:</h3>
              <ul className="space-y-1 text-sm">
                <li>• 1-й правильный ответ → повтор через <strong>10 минут</strong></li>
                <li>• 2-й правильный ответ → повтор через <strong>1 час</strong></li>
                <li>• 3-й правильный ответ → повтор через <strong>6 часов</strong></li>
                <li>• 4-й правильный ответ → повтор через <strong>1 день</strong></li>
                <li>• 5-й правильный ответ → повтор через <strong>3 дня</strong></li>
                <li>• 6-й правильный ответ → повтор через <strong>7 дней</strong></li>
                <li>• 7-й правильный ответ → повтор через <strong>14 дней</strong></li>
                <li>• 8-й правильный ответ → повтор через <strong>30 дней</strong></li>
                <li>• 9-й правильный ответ → повтор через <strong>90 дней</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Компонент карточки
  const WordCard = ({ word }) => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto transform transition-all hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <span className="text-6xl">{word.image}</span>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => toggleStar(word.id)}
            className={`p-2 rounded-full transition-colors ${
              word.starred ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Star className={`w-5 h-5 ${word.starred ? 'fill-current' : ''}`} />
          </button>
          <span className="text-xs text-gray-500">
            Повтор {formatDate(word.nextReview)}
          </span>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{word.english}</h2>
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4" />
          {word.pronunciation}
        </p>
      </div>
      
      {showAnswer && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xl font-semibold text-blue-900">{word.russian}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Примеры:</p>
            {word.examples.map((ex, idx) => (
              <p key={idx} className="text-gray-700 mb-1">• {ex}</p>
            ))}
          </div>
          
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => handleCardAnswer(false)}
              className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Не помню
            </button>
            <button
              onClick={() => handleCardAnswer(true)}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Помню
            </button>
          </div>
        </div>
      )}
      
      {!showAnswer && (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Показать ответ
        </button>
      )}
    </div>
  );

  // Компонент тренажера
  const TrainingComponent = () => {
    if (!currentQuestion) return null;
    
    // Режим выбора из вариантов
    if (trainingMode === 'multiple-choice-en-ru' || trainingMode === 'multiple-choice-ru-en') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  {trainingMode === 'multiple-choice-en-ru' ? 'Выберите перевод:' : 'Choose translation:'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Осталось: {trainingWords.length}
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    💡 {userStats.hintsRemaining}
                  </span>
                </div>
              </div>
              
              <div className="text-center py-8">
                <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                <h2 className="text-3xl font-bold text-gray-800">
                  {trainingMode === 'multiple-choice-en-ru' ? currentQuestion.word.english : currentQuestion.word.russian}
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => !showResult && checkAnswer(answer.id)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? answer.id === currentQuestion.correctId
                        ? 'bg-green-100 border-green-500'
                        : answer.id === selectedAnswer
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <p className="font-semibold">
                    {trainingMode === 'multiple-choice-en-ru' ? answer.russian : answer.english}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Режим ввода текста
    if (trainingMode === 'typing-en-ru' || trainingMode === 'typing-ru-en') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  {trainingMode === 'typing-en-ru' ? 'Введите перевод на русский:' : 'Type in English:'}
                </h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Осталось: {trainingWords.length}
                </span>
              </div>
              
              <div className="text-center py-8">
                <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                <h2 className="text-3xl font-bold text-gray-800">
                  {trainingMode === 'typing-en-ru' ? currentQuestion.word.english : currentQuestion.word.russian}
                </h2>
                {showHint && (
                  <p className="text-gray-500 mt-2">
                    Подсказка: {currentQuestion.correctAnswer.slice(0, Math.ceil(currentQuestion.correctAnswer.length / 2))}...
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
                disabled={showResult}
                className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите ответ..."
                autoFocus
              />
              
              {showResult && (
                <div className={`p-4 rounded-lg ${
                  userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() ? (
                    <p className="font-semibold">✅ Правильно!</p>
                  ) : (
                    <div>
                      <p className="font-semibold">❌ Неправильно</p>
                      <p>Правильный ответ: {currentQuestion.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}
              
              {!showResult && (
                <div className="flex gap-3">
                  <button
                    onClick={useHint}
                    disabled={showHint}
                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    💡 Подсказка ({userStats.hintsRemaining})
                  </button>
                  <button
                    onClick={() => checkAnswer()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Проверить
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Режим составления слова из букв
    if (trainingMode === 'scramble') {
      const assembled = selectedLetters.map(l => l.letter).join('');
      
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Составьте слово из букв:
                </h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Осталось: {trainingWords.length}
                </span>
              </div>
              
              <div className="text-center py-6">
                <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.word.russian}
                </h2>
              </div>
            </div>
            
            {/* Поле для сборки слова */}
            <div className="mb-6 min-h-[60px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedLetters.length > 0 ? (
                  selectedLetters.map((letter, index) => (
                    <button
                      key={`selected-${index}`}
                      onClick={() => handleLetterClick(letter, false)}
                      className="w-12 h-12 bg-blue-500 text-white text-xl font-bold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-110"
                    >
                      {letter.letter.toUpperCase()}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400">Нажимайте на буквы снизу</p>
                )}
              </div>
            </div>
            
            {/* Перемешанные буквы */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {scrambledLetters.map((letter) => (
                <button
                  key={`scrambled-${letter.id}`}
                  onClick={() => handleLetterClick(letter, true)}
                  disabled={letter.used}
                  className={`w-12 h-12 text-xl font-bold rounded-lg transition-all transform hover:scale-110 ${
                    letter.used
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {letter.letter.toUpperCase()}
                </button>
              ))}
            </div>
            
            {showResult && (
              <div className={`p-4 rounded-lg mb-4 ${
                assembled === currentQuestion.correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {assembled === currentQuestion.correctAnswer ? (
                  <p className="font-semibold text-center">✅ Правильно!</p>
                ) : (
                  <div className="text-center">
                    <p className="font-semibold">❌ Неправильно</p>
                    <p>Правильный ответ: {currentQuestion.correctAnswer.toUpperCase()}</p>
                  </div>
                )}
              </div>
            )}
            
            {!showResult && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedLetters([]);
                    setScrambledLetters(scrambledLetters.map(l => ({ ...l, used: false })));
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Сбросить
                </button>
                <button
                  onClick={() => checkAnswer()}
                  disabled={selectedLetters.length !== currentQuestion.correctAnswer.length}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  Проверить
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Режим аудирования
    if (trainingMode === 'listening') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Прослушайте и напишите слово:
                </h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Осталось: {trainingWords.length}
                </span>
              </div>
              
              <div className="text-center py-8">
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(currentQuestion.word.english);
                    utterance.lang = 'en-US';
                    speechSynthesis.speak(utterance);
                  }}
                  className="p-6 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Headphones className="w-12 h-12 text-blue-600" />
                </button>
                <p className="mt-4 text-gray-600">Нажмите для воспроизведения</p>
                {showHint && (
                  <p className="text-gray-500 mt-4">
                    Подсказка: {currentQuestion.word.russian}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
                disabled={showResult}
                className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type the word you hear..."
                autoFocus
              />
              
              {showResult && (
                <div className={`p-4 rounded-lg ${
                  userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() ? (
                    <p className="font-semibold">✅ Правильно!</p>
                  ) : (
                    <div>
                      <p className="font-semibold">❌ Неправильно</p>
                      <p>Правильный ответ: {currentQuestion.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}
              
              {!showResult && (
                <div className="flex gap-3">
                  <button
                    onClick={useHint}
                    disabled={showHint}
                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    💡 Подсказка ({userStats.hintsRemaining})
                  </button>
                  <button
                    onClick={() => checkAnswer()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Проверить
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Режим первой буквы
    if (trainingMode === 'first-letter') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Допишите слово:
                </h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Осталось: {trainingWords.length}
                </span>
              </div>
              
              <div className="text-center py-8">
                <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.word.russian}
                </h2>
                <p className="text-3xl font-mono text-gray-600 letter-spacing-2">
                  {currentQuestion.hint}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
                disabled={showResult}
                className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type the full word..."
                autoFocus
              />
              
              {showResult && (
                <div className={`p-4 rounded-lg ${
                  userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() ? (
                    <p className="font-semibold">✅ Правильно!</p>
                  ) : (
                    <div>
                      <p className="font-semibold">❌ Неправильно</p>
                      <p>Правильный ответ: {currentQuestion.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}
              
              {!showResult && (
                <button
                  onClick={() => checkAnswer()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  Проверить
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Компонент списка слов
  const WordsList = () => (
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
        
        <button
          onClick={() => setShowAddWordForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить слово
        </button>
      </div>
      
      <div className="grid gap-4">
        {filteredWords.map(word => (
          <div
            key={word.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{word.image}</span>
              <div>
                <h3 className="font-bold text-lg">{word.english}</h3>
                <p className="text-gray-600">{word.russian}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    word.status === 'mastered' ? 'bg-green-100 text-green-700' :
                    word.status === 'learning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {word.status === 'mastered' ? 'Изучено' :
                     word.status === 'learning' ? 'Изучается' : 'Новое'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {word.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    Повтор {formatDate(word.nextReview)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => toggleStar(word.id)}
                className={`p-2 rounded-full transition-colors ${
                  word.starred ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Star className={`w-5 h-5 ${word.starred ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => deleteWord(word.id)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentCardIndex(filteredWords.findIndex(w => w.id === word.id));
                  setCurrentView('cards');
                  setShowAnswer(false);
                }}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Главная панель
  const Dashboard = () => {
    // Проверка активных бустов
    const activeBoosts = userStats.activeBoosts.filter(b => b.expiresAt > Date.now());
    
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Статистика пользователя */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ваш прогресс</h2>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Уровень {userStats.level}
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {userStats.xp} XP
                </span>
                <span className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  {userStats.coins} монет
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" />
                <span className="text-xl font-bold">{userStats.streak}</span>
              </div>
              <p className="text-sm opacity-90">дней подряд</p>
            </div>
          </div>
          
          {/* Активные бусты */}
          {activeBoosts.length > 0 && (
            <div className="mt-4 p-3 bg-white/20 rounded-lg">
              <p className="text-sm font-semibold mb-2">Активные бусты:</p>
              <div className="flex gap-2">
                {activeBoosts.map(boost => (
                  <span key={boost.id} className="bg-white/30 px-2 py-1 rounded text-xs">
                    {boost.id === 'boost-xp' ? '⚡ XP x2' : '🧲 Монеты x2'}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс уровня</span>
              <span>{userStats.xp % 100}/100 XP</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all"
                style={{ width: `${userStats.xp % 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Статистика слов */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold">{words.length}</span>
            </div>
            <p className="text-gray-600">Всего слов</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold">{wordsToReview.length}</span>
            </div>
            <p className="text-gray-600">К повторению</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold">{words.filter(w => w.status === 'learning').length}</span>
            </div>
            <p className="text-gray-600">Изучается</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">{words.filter(w => w.status === 'mastered').length}</span>
            </div>
            <p className="text-gray-600">Изучено</p>
          </div>
        </div>

        {/* Раздел тренировок */}
        <h3 className="text-xl font-bold mb-4">Выберите тип тренировки:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Основные режимы */}
          <button
            onClick={() => {
              if (wordsToReview.length > 0) {
                setCurrentCardIndex(0);
                setCurrentView('cards');
                setShowAnswer(false);
              }
            }}
            disabled={wordsToReview.length === 0}
            className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg transition-all transform ${
              wordsToReview.length > 0 ? 'hover:shadow-xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Clock className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Повторение</h3>
            <p className="text-sm opacity-90">{wordsToReview.length} слов готовы</p>
          </button>
          
          <button
            onClick={() => startTraining('multiple-choice-en-ru')}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Target className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Выбор перевода</h3>
            <p className="text-sm opacity-90">EN → RU</p>
          </button>
          
          <button
            onClick={() => startTraining('multiple-choice-ru-en')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Target className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Выбор перевода</h3>
            <p className="text-sm opacity-90">RU → EN</p>
          </button>
          
          {/* Режимы набора текста */}
          <button
            onClick={() => startTraining('typing-en-ru')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Keyboard className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Ввод перевода</h3>
            <p className="text-sm opacity-90">EN → RU</p>
          </button>
          
          <button
            onClick={() => startTraining('typing-ru-en')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Keyboard className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Ввод перевода</h3>
            <p className="text-sm opacity-90">RU → EN</p>
          </button>
          
          {/* Специальные режимы */}
          <button
            onClick={() => startTraining('scramble')}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Shuffle className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Составь слово</h3>
            <p className="text-sm opacity-90">Из перемешанных букв</p>
          </button>
          
          <button
            onClick={() => startTraining('listening')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Headphones className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Аудирование</h3>
            <p className="text-sm opacity-90">Запись на слух</p>
          </button>
          
          <button
            onClick={() => startTraining('first-letter')}
            className="bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <PenTool className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Первая буква</h3>
            <p className="text-sm opacity-90">Допиши слово</p>
          </button>
          
          <button
            onClick={() => setShowAddWordForm(true)}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Добавить слова</h3>
            <p className="text-sm opacity-90">Создай свою базу</p>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${getThemeColors()}`}>
      {/* Навигация */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">WordMaster</h1>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Главная
              </button>
              <button
                onClick={() => setCurrentView('words')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'words' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Слова
              </button>
              <button
                onClick={() => setCurrentView('shop')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'shop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5 inline mr-1" />
                Магазин
              </button>
              <button
                onClick={() => setCurrentView('stats')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'stats' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5 inline mr-1" />
                Статистика
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <div className="py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'words' && <WordsList />}
        {currentView === 'shop' && <Shop />}
        {currentView === 'stats' && <Statistics />}
        {currentView === 'cards' && filteredWords.length > 0 && (
          <div className="px-6">
            <div className="max-w-md mx-auto mb-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Карточка {currentCardIndex + 1} из {filteredWords.length}</span>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentCardIndex + 1) / filteredWords.length) * 100}%` }}
                />
              </div>
            </div>
            <WordCard word={filteredWords[currentCardIndex]} />
          </div>
        )}
        {currentView === 'training' && <TrainingComponent />}
      </div>
      
      {/* Форма добавления слова */}
      {showAddWordForm && <AddWordForm />}
    </div>
  );
};

export default EnglishLearningApp;