// src/utils/cn.js
// Utility for conditional class merging

/**
 * Merges class names, filtering out falsy values.
 * Compatible with Tailwind CSS without the need for tailwind-merge.
 * @param {...(string|boolean|undefined|null)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Returns the appropriate performance rating label and badge class
 * @param {number} score
 * @returns {{ label: string, badgeClass: string, colorClass: string }}
 */
export function getPerformanceRating(score) {
  if (score >= 90) return { label: 'Excellent', badgeClass: 'badge-excellent', colorClass: 'text-positive' };
  if (score >= 80) return { label: 'Very Good', badgeClass: 'badge-verygood', colorClass: 'text-blue-600' };
  if (score >= 70) return { label: 'Good', badgeClass: 'badge-good', colorClass: 'text-purple-600' };
  if (score >= 60) return { label: 'Needs Improvement', badgeClass: 'badge-needsimprovement', colorClass: 'text-warning' };
  return { label: 'Poor', badgeClass: 'badge-poor', colorClass: 'text-critical' };
}

/**
 * Returns trend display data
 * @param {number} change - positive or negative number
 */
export function getTrend(change) {
  if (change > 0) return { label: `↑ ${change}%`, class: 'trend-up', direction: 'up' };
  if (change < 0) return { label: `↓ ${Math.abs(change)}%`, class: 'trend-down', direction: 'down' };
  return { label: '—', class: 'trend-neutral', direction: 'neutral' };
}

/**
 * Generate consistent initials from a name
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Generate a consistent color from a name (for avatars)
 * @param {string} name
 * @returns {string} hex color
 */
export function getAvatarColor(name) {
  const colors = [
    '#D97706', '#B45309', '#7C3AED', '#6D28D9',
    '#1D4ED8', '#0369A1', '#0F766E', '#15803D',
    '#B91C1C', '#9D174D',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

/**
 * Format a number to display
 * @param {number} num
 * @param {number} decimals
 */
export function formatScore(num, decimals = 1) {
  return typeof num === 'number' ? num.toFixed(decimals) : '—';
}

/**
 * Get progress fill color class based on percentage
 * @param {number} value
 */
export function getProgressColor(value) {
  if (value >= 85) return 'positive';
  if (value >= 70) return 'accent';
  if (value >= 55) return 'warning';
  return 'critical';
}
