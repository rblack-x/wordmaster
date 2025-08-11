export const calculateNextReview = (word, correct) => {
  const intervals = [
    1000 * 60 * 10,
    1000 * 60 * 60,
    1000 * 60 * 60 * 6,
    1000 * 60 * 60 * 24,
    1000 * 60 * 60 * 24 * 3,
    1000 * 60 * 60 * 24 * 7,
    1000 * 60 * 60 * 24 * 14,
    1000 * 60 * 60 * 24 * 30,
    1000 * 60 * 60 * 24 * 90
  ];

  let nextInterval;

  if (correct) {
    const nextIndex = Math.min(word.correctCount, intervals.length - 1);
    nextInterval = intervals[nextIndex];
  } else {
    nextInterval = intervals[0];
  }

  return new Date().getTime() + nextInterval;
};

export default calculateNextReview;
