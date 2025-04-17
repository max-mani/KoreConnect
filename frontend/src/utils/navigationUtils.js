/**
 * Navigation utility functions to prevent throttling issues
 */

// Store timestamps of last navigation to each path
const navigationTimestamps = {};

/**
 * Throttled navigation function to prevent browser IPC flooding
 * 
 * @param {function} navigate - React Router's navigate function
 * @param {string} path - The path to navigate to
 * @param {Object} options - Navigation options (optional)
 * @param {number} cooldownMs - Cooldown in milliseconds (default: 1000ms)
 * @returns {boolean} - Whether navigation was performed
 */
export const throttledNavigate = (navigate, path, options = {}, cooldownMs = 1000) => {
  const now = Date.now();
  const lastNavigationTime = navigationTimestamps[path] || 0;
  
  // Check if we're within the cooldown period
  if (now - lastNavigationTime < cooldownMs) {
    console.log(`Navigation to ${path} throttled to prevent flooding`);
    return false;
  }
  
  // Update timestamp and perform navigation
  navigationTimestamps[path] = now;
  
  // Use a session flag to indicate navigation is in progress
  sessionStorage.setItem('isNavigating', 'true');
  
  // Navigate with the provided options
  navigate(path, options);
  
  // Clear the navigation flag after a delay
  setTimeout(() => {
    sessionStorage.removeItem('isNavigating');
  }, 500);
  
  return true;
};

/**
 * Check if navigation is currently in progress
 * 
 * @returns {boolean} - Whether a navigation is in progress
 */
export const isNavigationInProgress = () => {
  return sessionStorage.getItem('isNavigating') === 'true';
}; 