export const loadSavedData = (initialWords) => {
  const defaultStats = {
    level: 1,
    xp: 0,
    streak: 0,
    totalWords: 0,
    masteredWords: 0,
    coins: 100,
    hintsRemaining: 3,
    purchasedItems: [],
    activeBoosts: [],
    currentTheme: 'default',
    totalReviews: 0,
    perfectDays: 0,
    bestStreak: 0,
    startDate: new Date().getTime(),
    lastActiveDate: null
  };

  try {
    const savedWords = localStorage.getItem('wordmaster_words');
    const savedStats = localStorage.getItem('wordmaster_stats');

    const parsedWords = (savedWords ? JSON.parse(savedWords) : initialWords).map(w => ({ level: 0, errorCount: 0, ...w }));
    return {
      words: parsedWords,
      stats: savedStats ? { ...defaultStats, ...JSON.parse(savedStats) } : defaultStats
    };
  } catch (error) {
    console.error('Error loading saved data:', error);
    return {
      words: initialWords,
      stats: defaultStats
    };
  }
};

export const saveWords = (words) => {
  try {
    localStorage.setItem('wordmaster_words', JSON.stringify(words));
  } catch (error) {
    console.error('Error saving words:', error);
  }
};

export const saveStats = (stats) => {
  try {
    localStorage.setItem('wordmaster_stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

export const loadCategories = (defaults) => {
  try {
    const saved = localStorage.getItem('wordmaster_categories');
    return saved ? JSON.parse(saved) : defaults;
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaults;
  }
};

export const saveCategories = (categories) => {
  try {
    localStorage.setItem('wordmaster_categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};
