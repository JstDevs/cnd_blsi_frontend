import { getApiUrl } from '../../utils/apiConfig';

const login = async (userName, password) => {
  try {
    const API_URL = getApiUrl();
    // Ensure API_URL is not empty
    if (!API_URL || API_URL.trim() === '') {
      throw new Error('API URL is not configured. Please set VITE_API_URL in your .env file or ensure backend is accessible.');
    }

    // Construct full URL - backend routes don't have /api prefix, so just append the route
    // Remove trailing slash if present, then add route
    const baseUrl = API_URL.replace(/\/$/, '');
    const fullUrl = `${baseUrl}/auth/login`;

    const requestBody = { userName, password };
    console.log('Login API URL:', fullUrl); // Debug log - remove in production
    console.log('Request body:', requestBody); // Debug log

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      // Try to parse error response, but handle if it's not JSON
      let errorMessage = `Login failed (${response.status} ${response.statusText})`;
      let errorData = null;
      try {
        const responseText = await response.text();
        console.error('Backend error response:', responseText);
        if (responseText) {
          errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorData.errors?.general || errorMessage;
          // Include more details if available
          if (errorData.stack && import.meta.env.DEV) {
            console.error('Backend error stack:', errorData.stack);
          }
        }
      } catch (e) {
        // Response is not JSON, use default error message
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const res = await response.json();
    if (!res.token) {
      throw new Error(res.message || res.errors?.general || 'Login failed');
    }
    // Set initial selected role
    if (res.user.accessList?.length > 0) {
      const defaultRole =
        res.user.accessList.length >= 2
          ? res.user.accessList[1]
          : res.user.accessList[0];
      sessionStorage.setItem('selectedRole', JSON.stringify(defaultRole));
    }
    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const logout = async () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('selectedRole');
  return null;
};

const fetchUserProfile = async (token) => {
  // In a real implementation, this would verify the token with the backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token) {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          resolve(JSON.parse(storedUser));
        } else {
          reject(new Error('User not found'));
        }
      } else {
        reject(new Error('Invalid token'));
      }
    }, 500);
  });
};

const changePassword = async (currentPassword, newPassword) => {
  // Simulating API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentPassword === 'password') {
        resolve({ success: true, message: 'Password changed successfully' });
      } else {
        reject(new Error('Current password is incorrect'));
      }
    }, 800);
  });
};

export default {
  login,
  logout,
  fetchUserProfile,
  changePassword,
};
