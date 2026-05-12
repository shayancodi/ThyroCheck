/**
 * API service layer
 * Handle all API calls here
 */

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api' // Development URL
  : 'https://api.thyrocheck.com/api'; // Production URL

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} API response
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Example API methods
 */
export const api = {
  // GET request
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),

  // POST request
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // PUT request
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE request
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

