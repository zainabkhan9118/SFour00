
/**
 * Simple caching utility for API responses
 * This improves application performance by avoiding unnecessary API calls
 */

// Cache storage
const cache = new Map();

// Default cache time - 5 minutes in milliseconds
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * Get cached data if available and not expired
 * @param {string} key - The cache key
 * @returns {Object|null} The cached data or null
 */
export const getCachedData = (key) => {
  if (!cache.has(key)) return null;
  
  const { data, expiry } = cache.get(key);
  
  // Check if cached data is expired
  if (Date.now() > expiry) {
    cache.delete(key);
    return null;
  }
  
  return data;
};

/**
 * Set data in the cache
 * @param {string} key - The cache key
 * @param {Object} data - The data to cache
 * @param {number} cacheTime - Time in milliseconds to cache the data (default: 5 minutes)
 */
export const setCacheData = (key, data, cacheTime = DEFAULT_CACHE_TIME) => {
  cache.set(key, {
    data,
    expiry: Date.now() + cacheTime
  });
};

/**
 * Clear the entire cache or a specific key
 * @param {string} key - The specific cache key to clear (optional)
 */
export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Wrapper for API calls with caching
 * @param {Function} apiFn - The API function to call
 * @param {Array} args - Arguments to pass to the API function
 * @param {string} cacheKey - The cache key (optional, will be generated if not provided)
 * @param {number} cacheTime - Time in milliseconds to cache the data (default: 5 minutes)
 * @returns {Promise<Object>} The API response
 */
export const cachedApiCall = async (apiFn, args = [], cacheKey = null, cacheTime = DEFAULT_CACHE_TIME) => {
  // Generate a cache key if not provided
  const key = cacheKey || `${apiFn.name}-${JSON.stringify(args)}`;
  
  // Check cache first
  const cachedData = getCachedData(key);
  if (cachedData) {
    console.log(`Using cached data for ${key}`);
    return cachedData;
  }
  
  // Make the API call
  try {
    const result = await apiFn(...args);
    
    // Store the result in cache
    setCacheData(key, result, cacheTime);
    return result;
  } catch (error) {
    // Don't cache errors
    throw error;
  }
};