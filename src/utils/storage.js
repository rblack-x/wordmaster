export const loadSavedData = (initialWords) => {
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
