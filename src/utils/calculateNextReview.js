export const reviewIntervals = [
  1000 * 60 * 10, // 10 minutes
  1000 * 60 * 60, // 1 hour
  1000 * 60 * 60 * 6, // 6 hours
  1000 * 60 * 60 * 24, // 1 day
  1000 * 60 * 60 * 24 * 3, // 3 days
  1000 * 60 * 60 * 24 * 7, // 1 week
  1000 * 60 * 60 * 24 * 14, // 2 weeks
  1000 * 60 * 60 * 24 * 30, // 1 month
  1000 * 60 * 60 * 24 * 90 // 3 months
];

export const calculateNextReview = (level) => {
  const index = Math.min(level, reviewIntervals.length - 1);
  return Date.now() + reviewIntervals[index];
};

export default calculateNextReview;
