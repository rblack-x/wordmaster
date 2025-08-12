import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BookOpen, Trophy, Clock, Target, Award, Zap, X, Check, RotateCcw, Volume2, Heart, Flame, Plus, Edit2, Save, Headphones, Eye, ShoppingCart, BarChart3, TrendingUp, Calendar, Info, Coins, Sparkles, Palette, Music, Rocket } from 'lucide-react';
import './styles/word-page.css';
import AddWordForm from './AddWordForm';
import EditWordForm from './EditWordForm';
import WordsList from './WordsList';
import { initialWords } from './data/initialWords';
import { shopItems } from './data/shopItems';
import { autoWords } from './data/autoWords';
import { loadSavedData, saveWords, saveStats, loadCategories, saveCategories } from './utils/storage';
import { formatDate } from './utils/formatDate';
import { calculateNextReview, reviewIntervals } from './utils/calculateNextReview';

const defaultCategories = ['Разное', 'Путешествия', 'Природа', 'Эмоции', 'Образование', 'Технологии', 'Еда', 'Дом', 'Животные'];

  const App = () => {
  const savedData = loadSavedData(initialWords);
  const maxLevel = reviewIntervals.length;
  const [categoryOptions, setCategoryOptions] = useState(() => loadCategories(defaultCategories));
  const categories = ['all', ...categoryOptions];
  const [words, setWords] = useState(savedData.words);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewWords, setReviewWords] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userStats, setUserStats] = useState(savedData.stats);
  const [trainingWords, setTrainingWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [trainingQueue, setTrainingQueue] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const wordTaskCounts = useRef({});
  const [wordCorrectMap, setWordCorrectMap] = useState({});
  const [trainingType, setTrainingType] = useState('zapominanie');
  const [trainingStats, setTrainingStats] = useState({ correct: 0, incorrect: 0, results: [] });
  const trainingStartLevels = useRef({});
  const playSound = useCallback((success) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = success ? 800 : 200;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error(e);
    }
  }, []);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showAddWordForm, setShowAddWordForm] = useState(false);
  const [wordListModal, setWordListModal] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [editingWord, setEditingWord] = useState(null);
  const [newWord, setNewWord] = useState({
    english: '',
    russian: '',
    category: categoryOptions[0],
    image: '📝',
    examples: ['', ''],
    pronunciation: ''
  });

  const updateWordProgress = useCallback((word, correct) => {
    const now = Date.now();
    const intervalPassed = now >= word.nextReview;
    let level = word.level ?? 0;
    if (correct && intervalPassed) {
      level = Math.min(level + 1, maxLevel);
    }
    const nextReview = (!correct || intervalPassed) ? calculateNextReview(level) : word.nextReview;
    const status = level >= maxLevel ? 'mastered' : level > 0 ? 'learning' : 'new';
    return {
      ...word,
      reviewCount: word.reviewCount + 1,
      errorCount: !correct ? (word.errorCount || 0) + 1 : (word.errorCount || 0),
      level,
      nextReview,
      status,
      lastReviewed: now
    };
  }, [maxLevel]);

  // Проверка ежедневной серии при загрузке
  useEffect(() => {
    setUserStats(prev => {
      const today = new Date().toDateString();
      if (prev.lastActiveDate === today) return prev;
      let newStreak = 1;
      if (prev.lastActiveDate) {
        const diff = Math.floor((new Date(today) - new Date(prev.lastActiveDate)) / (1000 * 60 * 60 * 24));
        newStreak = diff === 1 ? prev.streak + 1 : 1;
      }
      return {
        ...prev,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        lastActiveDate: today
      };
    });
  }, []);

  // Список эмодзи для выбора
  const emojiList = [
    '📝', '🌟', '🌈', '🔥', '💡', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🏆', '🚀', '✨', '💎',
    '🌺', '🌸', '🌼', '🌻', '🌷', '🌹', '🍀', '🌲', '🌳', '🌴', '🌵', '🌊', '⛰️', '🏔️', '🌋',
    '🏝️', '🏖️', '🌅', '🌄', '🌠', '🌌', '☀️', '🌙', '⭐', '☁️', '⛅', '🌤️', '🌥️', '🌦️',
    '🌧️', '⛈️', '❄️', '☃️', '🌨️', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨',
    '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐦', '🐤', '🐧', '🦅', '🦆', '🦉', '🐺', '🐗',
    '🐴', '🦄', '🐝', '🦋', '🐌', '🐞', '🐢', '🐍', '🐙', '🦑', '🦀', '🐠', '🐟', '🐡',
    '🐬', '🐳', '🦈', '🌍', '🌎', '🌏', '⚡', '🎁', '📚', '📱', '💻', '⌚',
    '🍎', '🍔', '🍕', '🍣', '🚗', '🎮', '❤️', '😂', '👍', '🥳', '🤔', '📖', '🧠', '📷', '🎧', '🎵', '⚽', '🏀', '🏈', '🛒',
    '🍇', '🍉', '🍌', '🍒', '🍓', '🍑', '🍍', '🥝', '🥑', '🥦', '🥕', '🌽', '🍞', '🧀', '🥨', '🍩', '🍪', '🎂', '🍰', '🧁',
    '🍬', '🍭', '🍫', '🍿', '☕', '🍵', '🍷', '🍸', '🍺', '🥂', '🍹', '🥤', '🍽️', '🍴', '🔑', '🔨', '🛠️', '⏰', '📅', '📎',
    '✏️', '📌', '📍', '✂️', '📢', '🔔', '🎀', '📮', '📊', '🎥'
  ];

  // Сохранение данных в localStorage
  useEffect(() => {
    saveWords(words);
  }, [words]);

  useEffect(() => {
    saveStats(userStats);
  }, [userStats]);

  useEffect(() => {
    saveCategories(categoryOptions);
  }, [categoryOptions]);
  // Фильтрация слов по категории
  const filteredWords = useMemo(() =>
    selectedCategory === 'all'
      ? words
      : words.filter(w => w.category === selectedCategory),
    [words, selectedCategory]
  );

  // Слова для повторения (по алгоритму интервального повторения)
  const wordsToReview = useMemo(() =>
    words.filter(w => w.nextReview <= new Date().getTime() && w.status !== 'mastered'),
    [words]
  );

  const newWords = useMemo(() =>
    words.filter(w => w.reviewCount === 0),
    [words]
  );

  const addCategory = () => {
    const name = prompt('Введите название категории');
    if (name && !categoryOptions.includes(name)) {
      setCategoryOptions(prev => [...prev, name]);
    }
  };

  // Покупка/активация предметов в магазине
  const purchaseItem = useCallback((item) => {
    const isPurchased = userStats.purchasedItems.includes(item.id);

    if (item.type === 'theme') {
      if (!isPurchased) {
        if (userStats.coins >= item.price) {
          setUserStats(prev => ({
            ...prev,
            coins: prev.coins - item.price,
            purchasedItems: [...prev.purchasedItems, item.id],
            currentTheme: item.id
          }));
          alert(`✨ Успешно куплено: ${item.name}!`);
        } else {
          alert(`❌ Недостаточно монет! Нужно ещё ${item.price - userStats.coins} монет.`);
        }
      } else {
        setUserStats(prev => ({
          ...prev,
          currentTheme: prev.currentTheme === item.id ? 'default' : item.id
        }));
      }
      return;
    }

    if (userStats.coins >= item.price && !isPurchased) {
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins - item.price,
        purchasedItems: [...prev.purchasedItems, item.id],
        hintsRemaining: item.id === 'hint-pack' ? prev.hintsRemaining + 5 : prev.hintsRemaining,
        activeBoosts: item.type === 'boost' ? [...prev.activeBoosts, { id: item.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }] : prev.activeBoosts
      }));
      alert(`✨ Успешно куплено: ${item.name}!`);
    } else if (userStats.coins < item.price && !isPurchased) {
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
    const currentWord = reviewWords[currentCardIndex];

    // Проверка активных бустов
    const hasXPBoost = userStats.activeBoosts.some(b => b.id === 'boost-xp' && b.expiresAt > Date.now());
    const hasCoinBoost = userStats.activeBoosts.some(b => b.id === 'boost-coins' && b.expiresAt > Date.now());

    setWords(prevWords => {
      const updatedWords = prevWords.map(w =>
        w.id === currentWord.id ? updateWordProgress(w, correct) : w
      );

      // Обновление статистики и геймификация
      setUserStats(prev => ({
        ...prev,
        xp: correct ? prev.xp + (hasXPBoost ? 20 : 10) : prev.xp,
        coins: correct ? prev.coins + (hasCoinBoost ? 10 : 5) : prev.coins,
        totalWords: correct ? prev.totalWords + (currentWord.reviewCount === 0 ? 1 : 0) : prev.totalWords,
        masteredWords: updatedWords.filter(w => w.status === 'mastered').length,
        level: correct ? Math.floor((prev.xp + (hasXPBoost ? 20 : 10)) / 100) + 1 : prev.level,
        totalReviews: prev.totalReviews + 1
      }));

      return updatedWords;
    });

    // Переход к следующей карточке
    setTimeout(() => {
      setShowAnswer(false);
      if (currentCardIndex < reviewWords.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentView('dashboard');
        setCurrentCardIndex(0);
      }
    }, 1000);
  }, [reviewWords, currentCardIndex, userStats.activeBoosts, updateWordProgress]);

  // Удаление слова
  const deleteWord = useCallback((wordId, confirm = true) => {
    if (!confirm || window.confirm('Вы уверены, что хотите удалить это слово?')) {
      setWords(prev => {
        const updated = prev.filter(w => w.id !== wordId);
        saveWords(updated);
        return updated;
      });
    }
  }, []);

  // Добавление нового слова
  const addNewWord = useCallback(() => {
    if (newWord.english && newWord.russian) {
      const word = {
        ...newWord,
        id: Date.now(),
        category: newWord.category || 'Разное',
        image: newWord.image || '📝',
        examples: newWord.examples.filter(ex => ex.length > 0),
        difficulty: 1,
        nextReview: new Date().getTime(),
        reviewCount: 0,
        errorCount: 0,
        level: 0,
        starred: false,
        status: 'new',
        createdAt: new Date().getTime(),
        lastReviewed: null
      };

      setWords(prev => {
        const updated = [...prev, word];
        saveWords(updated);
        return updated;
      });
      setNewWord({
        english: '',
        russian: '',
        category: categoryOptions[0],
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
    }, [newWord, categoryOptions]);

  const importCSV = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const imported = lines.map(line => {
        const [english, russian, category, pronunciation, example] = line.split(',').map(s => s.trim());
        if (!english || !russian) return null;
        return {
          id: Date.now() + Math.random(),
          english,
          russian,
          category: category || categoryOptions[0],
          image: '📝',
          examples: example ? [example] : [],
          pronunciation: pronunciation || '',
          difficulty: 1,
          nextReview: Date.now(),
          reviewCount: 0,
          errorCount: 0,
          level: 0,
          starred: false,
          status: 'new',
          createdAt: Date.now(),
          lastReviewed: null,
        };
      }).filter(Boolean);
      if (imported.length) {
        setWords(prev => {
          const updated = [...prev, ...imported];
          saveWords(updated);
          return updated;
        });
      }
    };
    reader.readAsText(file);
  }, [categoryOptions]);

  // Автогенерация слова
  const generateAutoWord = useCallback(() => {
    try {
      const available = autoWords.filter(
        w => !words.some(word => word.english.toLowerCase() === w.english.toLowerCase())
      );
      if (available.length === 0) return;
      const base = available[Math.floor(Math.random() * available.length)];
      const word = {
        id: Date.now(),
        english: base.english,
        russian: base.russian,
        category: 'Сгенерированные',
        image: base.image,
        examples: base.examples || [],
        pronunciation: base.pronunciation || '',
        difficulty: 1,
        nextReview: Date.now(),
        reviewCount: 0,
        errorCount: 0,
        level: 0,
        starred: false,
        status: 'new',
        createdAt: Date.now(),
        lastReviewed: null,
      };
      setWords(prev => {
        const updated = [...prev, word];
        saveWords(updated);
        return updated;
      });
      if (!categoryOptions.includes('Сгенерированные')) {
        setCategoryOptions(prev => [...prev, 'Сгенерированные']);
      }
      setUserStats(prev => ({ ...prev, coins: prev.coins + 2 }));
    } catch (err) {
      console.error('Auto generation failed', err);
    }
  }, [words, categoryOptions]);

  // Генерация вопроса для тренажера
  const generateQuestion = useCallback((task) => {
    if (!task) return;

    const { word: correctWord, type: actualMode } = task;

    if (actualMode === 'multiple-choice-en-ru' || actualMode === 'word-choice') {
      const otherWords = words.filter(w => w.id !== correctWord.id);
      const wrongAnswers = [];

      for (let i = 0; i < 3 && i < otherWords.length; i++) {
        wrongAnswers.push(otherWords[Math.floor(Math.random() * otherWords.length)]);
      }

      const allAnswers = [correctWord, ...wrongAnswers].sort(() => Math.random() - 0.5);

      setCurrentQuestion({
        word: correctWord,
        answers: allAnswers,
        correctId: correctWord.id,
        type: actualMode
      });
    } else if (actualMode === 'typing-en-ru' || actualMode === 'typing-ru-en') {
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: actualMode === 'typing-en-ru' ? correctWord.russian : correctWord.english,
        type: actualMode
      });
    } else if (actualMode === 'scramble') {
      const letters = correctWord.english.toLowerCase().split('');
      const scrambled = [...letters].sort(() => Math.random() - 0.5);
      setScrambledLetters(scrambled.map((letter, index) => ({ letter, id: index, used: false })));
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: correctWord.english.toLowerCase(),
        type: actualMode
      });
    } else if (actualMode === 'listening') {
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: correctWord.english,
        type: actualMode
      });
    } else if (actualMode === 'first-letter') {
      setCurrentQuestion({
        word: correctWord,
        correctAnswer: correctWord.english,
        hint: correctWord.english[0].toUpperCase() + '_'.repeat(correctWord.english.length - 1),
        type: actualMode
      });
    }

    setSelectedAnswer(null);
    setShowResult(false);
  }, [words]);

  // Начать тренировку
  const startTraining = useCallback(() => {
    const wordsForTraining = wordsToReview.slice(0, 10);

    if (wordsForTraining.length === 0) {
      alert('Нет слов для повторения! Попробуйте позже.');
      return;
    }

    const modes = ['multiple-choice-en-ru', 'word-choice', 'typing-en-ru', 'typing-ru-en', 'scramble', 'listening', 'first-letter'];
    const tasks = [];
    const counts = {};
    const correctMapInit = {};

    wordsForTraining.forEach(w => {
      counts[w.id] = modes.length;
      correctMapInit[w.id] = true;
      modes.forEach(m => tasks.push({ word: w, type: m }));
      trainingStartLevels.current[w.id] = w.level || 0;
    });

    tasks.sort(() => Math.random() - 0.5);

    setTrainingQueue(tasks);
    setTaskIndex(0);
    wordTaskCounts.current = counts;
    setWordCorrectMap(correctMapInit);
    setTrainingWords(wordsForTraining);
    setTrainingType('zapominanie');
    setTrainingStats({ correct: 0, incorrect: 0, results: [] });
    generateQuestion(tasks[0]);
    setCurrentView('training');
    setUserInput('');
    setShowHint(false);
    setSelectedLetters([]);
  }, [wordsToReview, generateQuestion]);

  const startJam = useCallback(() => {
    if (words.length === 0) {
      alert('Нет слов для тренировки!');
      return;
    }
    const modes = ['multiple-choice-en-ru', 'word-choice', 'typing-en-ru', 'typing-ru-en', 'scramble', 'listening', 'first-letter'];
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 30);
    const tasks = shuffled.map(w => ({ word: w, type: modes[Math.floor(Math.random() * modes.length)] }));

    setTrainingQueue(tasks);
    setTaskIndex(0);
    wordTaskCounts.current = Object.fromEntries(shuffled.map(w => [w.id, 1]));
    setWordCorrectMap({});
    setTrainingWords(shuffled);
    setTrainingType('jam');
    setTrainingStats({ correct: 0, incorrect: 0, results: [] });
    generateQuestion(tasks[0]);
    setCurrentView('training');
    setUserInput('');
    setShowHint(false);
    setSelectedLetters([]);
  }, [words, generateQuestion]);

  // Проверка ответа в тренажере
  const checkAnswer = useCallback((answer) => {
    let correct = false;
    const mode = currentQuestion.type;

    if (mode === 'multiple-choice-en-ru' || mode === 'word-choice') {
      setSelectedAnswer(answer);
      correct = answer === currentQuestion.correctId;
    } else if (mode === 'typing-en-ru' || mode === 'typing-ru-en' || mode === 'listening' || mode === 'first-letter') {
      correct = userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase();
    } else if (mode === 'scramble') {
      const assembled = selectedLetters.map(l => l.letter).join('');
      correct = assembled === currentQuestion.correctAnswer;
    }

    setShowResult(true);
    playSound(correct);

    // Проверка активных бустов
    const hasXPBoost = userStats.activeBoosts.some(b => b.id === 'boost-xp' && b.expiresAt > Date.now());
    const hasCoinBoost = userStats.activeBoosts.some(b => b.id === 'boost-coins' && b.expiresAt > Date.now());

    if (correct) {
      setUserStats(prev => ({
        ...prev,
        xp: prev.xp + (hasXPBoost ? 30 : 15),
        coins: prev.coins + (hasCoinBoost ? 20 : 10),
        level: Math.floor((prev.xp + (hasXPBoost ? 30 : 15)) / 100) + 1,
        totalReviews: prev.totalReviews + 1
      }));
    } else {
      setUserStats(prev => ({
        ...prev,
        totalReviews: prev.totalReviews + 1
      }));
    }

    const wordId = currentQuestion.word.id;
    const newCorrectValue = (wordCorrectMap[wordId] ?? true) && correct;
    setWordCorrectMap(prev => ({ ...prev, [wordId]: newCorrectValue }));
    const newCount = (wordTaskCounts.current[wordId] || 0) - 1;
    wordTaskCounts.current[wordId] = newCount;
    if (newCount === 0) {
      if (trainingType === 'zapominanie') {
        const updatedWord = updateWordProgress(currentQuestion.word, newCorrectValue);
        setWords(w => w.map(word => word.id === wordId ? updatedWord : word));
        setTrainingStats(prev => ({
          ...prev,
          correct: prev.correct + (newCorrectValue ? 1 : 0),
          incorrect: prev.incorrect + (newCorrectValue ? 0 : 1),
          results: [...prev.results, {
            id: updatedWord.id,
            word: updatedWord.english,
            level: updatedWord.level,
            levelUp: updatedWord.level - (trainingStartLevels.current[wordId] || 0),
            learned: updatedWord.status === 'mastered'
          }]
        }));
      } else {
        setTrainingStats(prev => ({
          ...prev,
          correct: prev.correct + (newCorrectValue ? 1 : 0),
          incorrect: prev.incorrect + (newCorrectValue ? 0 : 1),
          results: [...prev.results, { id: wordId, word: currentQuestion.word.english, correct: newCorrectValue }]
        }));
      }
      setTrainingWords(words => words.filter(w => w.id !== wordId));
    }

    setTimeout(() => {
      const nextIndex = taskIndex + 1;
      if (nextIndex < trainingQueue.length) {
        setTaskIndex(nextIndex);
        generateQuestion(trainingQueue[nextIndex]);
        setUserInput('');
        setSelectedLetters([]);
        setShowHint(false);
      } else {
        setCurrentView('trainingSummary');
      }
    }, 2000);
  }, [currentQuestion, userInput, selectedLetters, userStats.activeBoosts, wordCorrectMap, trainingQueue, taskIndex, updateWordProgress, generateQuestion, trainingType, playSound]);

  const checkAnswerRef = useRef(checkAnswer);
  useEffect(() => { checkAnswerRef.current = checkAnswer; }, [checkAnswer]);

  useEffect(() => {
    if (trainingType === 'jam' && currentView === 'training' && !showResult) {
      setTimeLeft(10);
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            clearInterval(interval);
            checkAnswerRef.current(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (trainingType === 'jam') {
      setTimeLeft(null);
    }
  }, [taskIndex, currentView, trainingType, showResult]);

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

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 256;
        let { width, height } = img;
        if (width > height && width > MAX_SIZE) {
          height = height * (MAX_SIZE / width);
          width = MAX_SIZE;
        } else if (height >= width && height > MAX_SIZE) {
          width = width * (MAX_SIZE / height);
          height = MAX_SIZE;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setNewWord(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }, [setNewWord]);

  const handleExampleChange = useCallback((index, value) => {
    setNewWord(prev => {
      const newExamples = [...prev.examples];
      newExamples[index] = value;
      return { ...prev, examples: newExamples };
    });
  }, []);

  // Обработчики для редактирования слова
  const handleEditWordChange = useCallback((field, value) => {
    setEditingWord(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleEditExampleChange = useCallback((index, value) => {
    setEditingWord(prev => {
      const examples = [...(prev.examples || ['', ''])];
      examples[index] = value;
      return { ...prev, examples };
    });
  }, []);

  const handleEditImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 256;
        let { width, height } = img;
        if (width > height && width > MAX_SIZE) {
          height = height * (MAX_SIZE / width);
          width = MAX_SIZE;
        } else if (height >= width && height > MAX_SIZE) {
          width = width * (MAX_SIZE / height);
          height = MAX_SIZE;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setEditingWord(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const saveEditedWord = useCallback(() => {
    if (!editingWord) return;
    setWords(prev => {
      const updated = prev.map(w => (w.id === editingWord.id ? editingWord : w));
      saveWords(updated);
      return updated;
    });
    setEditingWord(null);
  }, [editingWord]);

  const resetWordProgress = useCallback(() => {
    setEditingWord(prev => prev ? {
      ...prev,
      level: 0,
      reviewCount: 0,
      errorCount: 0,
      status: 'new',
      nextReview: Date.now(),
      lastReviewed: null,
    } : prev);
  }, []);

  const markWordLearned = useCallback(() => {
    setEditingWord(prev => prev ? {
      ...prev,
      level: maxLevel,
      status: 'mastered',
      nextReview: Date.now(),
    } : prev);
  }, [maxLevel]);

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
          {shopItems.map(item => {
            const isPurchased = userStats.purchasedItems.includes(item.id);
            return (
            <div
              key={item.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                item.type === 'theme'
                  ? (userStats.currentTheme === item.id ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-blue-400 hover:shadow-lg')
                  : isPurchased
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
                  disabled={!isPurchased && userStats.coins < item.price}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    !isPurchased && userStats.coins < item.price
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {item.type === 'theme'
                    ? (isPurchased ? (userStats.currentTheme === item.id ? 'Выключить' : 'Включить') : 'Купить')
                    : (isPurchased ? 'Куплено' : 'Купить')}
                </button>
              </div>
            </div>
          );})}
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
  const WordCard = ({ word }) => {
    const isAvailable = word.nextReview <= Date.now();
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto transform transition-all hover:scale-105">
        <div className="flex flex-col items-center mb-4">
          {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
            <img
              src={word.image}
              alt={word.english}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <span className="text-7xl">{word.image}</span>
          )}
          <span className="text-xs text-gray-500 mt-2">
            {isAvailable ? 'Доступно' : `Будет доступно ${formatDate(word.nextReview)}`}
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{word.english}</h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4" />
            {word.pronunciation}
          </p>
          <p className="text-sm text-gray-500 mt-2">Уровень: {word.level}/{maxLevel}</p>
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
  };

  // Компонент тренажера
  const TrainingComponent = () => {
    if (!currentQuestion) return null;
    const mode = currentQuestion.type;

    // Режим выбора из вариантов
    if (mode === 'multiple-choice-en-ru' || mode === 'word-choice') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  {mode === 'multiple-choice-en-ru' ? 'Выберите перевод:' : 'Выберите слово:'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Осталось: {trainingWords.length}
                  </span>
                  {trainingType === 'jam' && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      ⏱️ {timeLeft}
                    </span>
                  )}
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    💡 {userStats.hintsRemaining}
                  </span>
                </div>
              </div>
              
              <div className="text-center py-8">
                {typeof currentQuestion.word.image === 'string' && (currentQuestion.word.image.startsWith('http') || currentQuestion.word.image.startsWith('data:')) ? (
                  <img
                    src={currentQuestion.word.image}
                    alt={currentQuestion.word.english}
                    className="w-24 h-24 mb-4 mx-auto object-cover rounded"
                  />
                ) : (
                  <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                )}
                <h2 className="text-3xl font-bold text-gray-800">
                  {mode === 'multiple-choice-en-ru' ? currentQuestion.word.english : currentQuestion.word.russian}
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
                    {mode === 'multiple-choice-en-ru' ? answer.russian : answer.english}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Режим ввода текста
    if (mode === 'typing-en-ru' || mode === 'typing-ru-en') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  {mode === 'typing-en-ru' ? 'Введите перевод на русский:' : 'Type in English:'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Осталось: {trainingWords.length}
                  </span>
                  {trainingType === 'jam' && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      ⏱️ {timeLeft}
                    </span>
                  )}
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    💡 {userStats.hintsRemaining}
                  </span>
                </div>
              </div>
              
              <div className="text-center py-8">
                 {typeof currentQuestion.word.image === 'string' && (currentQuestion.word.image.startsWith('http') || currentQuestion.word.image.startsWith('data:')) ? (
                  <img
                    src={currentQuestion.word.image}
                    alt={currentQuestion.word.english}
                    className="w-24 h-24 mb-4 mx-auto object-cover rounded"
                  />
                ) : (
                  <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                )}
                <h2 className="text-3xl font-bold text-gray-800">
                  {mode === 'typing-en-ru' ? currentQuestion.word.english : currentQuestion.word.russian}
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
    if (mode === 'scramble') {
      const assembled = selectedLetters.map(l => l.letter).join('');
      
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Составьте слово из букв:
                </h3>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Осталось: {trainingWords.length}
                  </span>
                  {trainingType === 'jam' && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      ⏱️ {timeLeft}
                    </span>
                  )}
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    💡 {userStats.hintsRemaining}
                  </span>
                </div>
              </div>
              
              <div className="text-center py-6">
                {typeof currentQuestion.word.image === 'string' && (currentQuestion.word.image.startsWith('http') || currentQuestion.word.image.startsWith('data:')) ? (
                  <img
                    src={currentQuestion.word.image}
                    alt={currentQuestion.word.english}
                    className="w-24 h-24 mb-4 mx-auto object-cover rounded"
                  />
                ) : (
                  <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                )}
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
    if (mode === 'listening') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Прослушайте и напишите слово:
                </h3>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Осталось: {trainingWords.length}
                  </span>
                  {trainingType === 'jam' && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      ⏱️ {timeLeft}
                    </span>
                  )}
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    💡 {userStats.hintsRemaining}
                  </span>
                </div>
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
    if (mode === 'first-letter') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Допишите слово:
                </h3>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Осталось: {trainingWords.length}
                  </span>
                  {trainingType === 'jam' && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      ⏱️ {timeLeft}
                    </span>
                  )}
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    💡 {userStats.hintsRemaining}
                  </span>
                </div>
              </div>
              
              <div className="text-center py-8">
                {typeof currentQuestion.word.image === 'string' && (currentQuestion.word.image.startsWith('http') || currentQuestion.word.image.startsWith('data:')) ? (
                  <img
                    src={currentQuestion.word.image}
                    alt={currentQuestion.word.english}
                    className="w-24 h-24 mb-4 mx-auto object-cover rounded"
                  />
                ) : (
                  <span className="text-6xl mb-4 inline-block">{currentQuestion.word.image}</span>
                )}
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

  const TrainingSummary = () => {
    const confettiPlayed = useRef(false);
    useEffect(() => {
      if (confettiPlayed.current) return;
      confettiPlayed.current = true;
      const colors = ['#bb0000', '#ffffff', '#3333ff', '#00bb00', '#ffbb00', '#ff00bb'];
      const pieces = 100;
      for (let i = 0; i < pieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.setProperty('--end-x', (Math.random() * 400 - 200) + 'px');
        piece.style.setProperty('--end-y', (-Math.random() * 200 - 50) + 'px');
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
      }
    }, []);
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Результаты</h2>
          <p className="mb-1">Правильно: {trainingStats.correct} слов</p>
          <p className="mb-4">Ошибок: {trainingStats.incorrect}</p>
          {trainingType === 'zapominanie' && (
            <div className="text-left">
              <h3 className="font-semibold mb-2">Прогресс слов:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {trainingStats.results.map(r => {
                  const wordObj = words.find(w => w.id === r.id);
                  return (
                    <li key={r.id}>
                      <button
                        onClick={() => wordObj && setSelectedWord(wordObj)}
                        className="text-blue-600 hover:underline"
                      >
                        {r.word}
                      </button>
                      {' '}— уровень {r.level}
                      {r.levelUp > 0 ? ` (+${r.levelUp})` : ''}
                      {r.learned ? ' ⭐' : ''}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {trainingType === 'jam' && (
            <div className="text-left">
              <h3 className="font-semibold mb-2">Слова:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {trainingStats.results.map(r => {
                  const wordObj = words.find(w => w.id === r.id);
                  return (
                    <li key={r.id}>
                      <button
                        onClick={() => wordObj && setSelectedWord(wordObj)}
                        className="text-blue-600 hover:underline"
                      >
                        {r.word}
                      </button>
                      {' '}— {r.correct ? '✅' : '❌'}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <button
            onClick={() => setCurrentView('dashboard')}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            На главную
          </button>
        </div>
      </div>
    );
  };

  // Компонент списка слов
  // Модальное окно со списком слов
  const WordListModal = ({ modal, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{modal.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ul className="space-y-2">
          {modal.words.map(w => (
              <li
                key={w.id}
                className="word-card-list cursor-pointer"
                onClick={() => {
                  setSelectedWord(w);
                  onClose();
                }}
              >
                <div className="word-left">
                  <div className="word-media">
                    {typeof w.image === 'string' && (w.image.startsWith('http') || w.image.startsWith('data:')) ? (
                      <img src={w.image} alt={w.english} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl grid place-items-center h-full w-full">{w.image}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="word-title">{w.english}</p>
                  </div>
                </div>
                <div className="word-right">
                  <div className="flex items-center justify-center gap-2 self-center w-full">
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${(w.level / maxLevel) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{w.level}/{maxLevel}</span>
                  </div>
                </div>
              </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const WordDetailsModal = ({ word, onClose }) => {
    const accuracy = word.reviewCount > 0
      ? Math.round(((word.reviewCount - word.errorCount) / word.reviewCount) * 100)
      : 0;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Карточка слова</h2>
            <div className="flex gap-2">
              <button
                onClick={() => { onClose(); setEditingWord(word); }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden text-7xl">
              {typeof word.image === 'string' && (word.image.startsWith('http') || word.image.startsWith('data:')) ? (
                <img src={word.image} alt={word.english} className="h-full w-full object-cover" />
              ) : (
                <span>{word.image}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-center">{word.english}</h3>
              <button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(word.english);
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            {word.pronunciation && (
              <p className="text-gray-500">{word.pronunciation}</p>
            )}
            <p className="text-lg text-blue-600 text-center">{word.russian}</p>
            {word.examples && word.examples.length > 0 && (
              <div className="w-full">
                <h3 className="font-semibold mb-2 text-center">Примеры</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-left">
                  {word.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="w-full">
              <h3 className="font-semibold mb-2 text-center">Статистика</h3>
              <p className="text-sm">Прохождений: {word.reviewCount}</p>
              <p className="text-sm">Ошибок: {word.errorCount}</p>
              {word.reviewCount > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${accuracy}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">Точность {accuracy}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <div
            className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => setWordListModal({ title: 'Все слова', words })}
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold">{words.length}</span>
            </div>
            <p className="text-gray-600">Всего слов</p>
          </div>

          <div
            className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => setWordListModal({ title: 'Слова к повторению', words: wordsToReview })}
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold">{wordsToReview.length}</span>
            </div>
            <p className="text-gray-600">К повторению</p>
          </div>

          <div
            className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => setWordListModal({ title: 'В процессе', words: words.filter(w => w.status === 'learning') })}
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold">{words.filter(w => w.status === 'learning').length}</span>
            </div>
            <p className="text-gray-600">В процессе</p>
          </div>

          <div
            className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => setWordListModal({ title: 'Изучено', words: words.filter(w => w.status === 'mastered') })}
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">{words.filter(w => w.status === 'mastered').length}</span>
            </div>
            <p className="text-gray-600">Изучено</p>
          </div>
        </div>

        {/* Раздел тренировок */}
        <h3 className="text-xl font-bold mb-4">Тренировка слов:</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              if (newWords.length > 0) {
                setReviewWords(newWords);
                setCurrentCardIndex(0);
                setCurrentView('cards');
                setShowAnswer(false);
              }
            }}
            disabled={newWords.length === 0}
            className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg transition-all transform ${
              newWords.length > 0 ? 'hover:shadow-xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Clock className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Новые слова</h3>
            <p className="text-sm opacity-90">{newWords.length} новых слов</p>
          </button>

          <button
            onClick={startTraining}
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Sparkles className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Запоминание</h3>
            <p className="text-sm opacity-90">Смешанные задания</p>
          </button>

          <button
            onClick={startJam}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Music className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-bold mb-1">Словарный джем</h3>
            <p className="text-sm opacity-90">До 30 случайных слов</p>
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
        {currentView === 'words' && (
          <WordsList
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredWords={filteredWords}
            maxLevel={maxLevel}
            deleteWord={deleteWord}
            setShowAddWordForm={setShowAddWordForm}
            onWordClick={setSelectedWord}
            addCategory={addCategory}
            generateWord={generateAutoWord}
            importCSV={importCSV}
          />
        )}
        {currentView === 'shop' && <Shop />}
        {currentView === 'stats' && <Statistics />}
        {currentView === 'cards' && reviewWords.length > 0 && (
          <div className="px-6">
            <div className="max-w-md mx-auto mb-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Карточка {currentCardIndex + 1} из {reviewWords.length}</span>
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
                  style={{ width: `${((currentCardIndex + 1) / reviewWords.length) * 100}%` }}
                />
              </div>
            </div>
            <WordCard word={reviewWords[currentCardIndex]} />
          </div>
        )}
        {currentView === 'training' && <TrainingComponent />}
        {currentView === 'trainingSummary' && <TrainingSummary />}
      </div>
      
      {wordListModal && (
        <WordListModal modal={wordListModal} onClose={() => setWordListModal(null)} />
      )}
      {selectedWord && (
        <WordDetailsModal word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
      {/* Форма добавления слова */}
      {showAddWordForm && (
        <AddWordForm
          newWord={newWord}
          handleNewWordChange={handleNewWordChange}
          handleExampleChange={handleExampleChange}
          addNewWord={addNewWord}
          setShowAddWordForm={setShowAddWordForm}
          emojiList={emojiList}
          handleImageUpload={handleImageUpload}
          categories={categoryOptions}
        />
      )}
      {editingWord && (
        <EditWordForm
          word={editingWord}
          handleWordChange={handleEditWordChange}
          handleExampleChange={handleEditExampleChange}
          saveWord={saveEditedWord}
          onClose={() => setEditingWord(null)}
          emojiList={emojiList}
          handleImageUpload={handleEditImageUpload}
          categories={categoryOptions}
          resetProgress={resetWordProgress}
          markLearned={markWordLearned}
        />
      )}
    </div>
  );
};

export default App;
