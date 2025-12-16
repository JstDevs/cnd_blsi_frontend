// Utility to get API URL dynamically based on current hostname
// This allows the app to work when accessed via network IP

export const getApiUrl = () => {
  // Debug: log environment variable
  if (import.meta.env.DEV) {
    console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
    console.log('Window location:', typeof window !== 'undefined' ? window.location.href : 'N/A');
  }
  
  // If VITE_API_URL is set in env and not empty, use it (backend routes don't have /api prefix)
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim() !== '') {
    let url = envApiUrl.trim();
    // Remove /api suffix if present (backend doesn't use /api prefix in routes)
    url = url.replace(/\/api\/?$/, '');
    // Fix: If URL is using port 3000 (frontend), change to port 5001 (backend)
    if (url.includes(':3000')) {
      url = url.replace(':3000', ':5001');
      if (import.meta.env.DEV) {
        console.warn('Fixed VITE_API_URL from frontend port (3000) to backend port (5001):', url);
      }
    }
    // Fix: If URL is using port 5000, change to port 5001 (backend runs on 5001)
    if (url.includes(':5000') && !url.includes(':5001')) {
      url = url.replace(':5000', ':5001');
      if (import.meta.env.DEV) {
        console.warn('Fixed VITE_API_URL from port 5000 to backend port 5001:', url);
      }
    }
    return url;
  }
  
  // Otherwise, construct URL based on current hostname (backend runs on port 5001, no /api prefix)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // If localhost, use localhost for API
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5001';
    }
    // Otherwise, use current hostname with API port (backend runs on port 5001)
    // Use http for API even if frontend is https (backend might not have SSL)
    const apiProtocol = protocol === 'https:' ? 'https:' : 'http:';
    return `${apiProtocol}//${hostname}:5001`;
  }
  
  // Fallback for SSR
  return 'http://localhost:5001';
};

// Export API_URL for backwards compatibility
export const API_URL = getApiUrl();

