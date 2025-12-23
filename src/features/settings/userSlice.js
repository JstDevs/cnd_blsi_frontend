import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialUsers = [];
// const initialUsers = [
//   {
//     id: 1,
//     username: 'admin',
//     firstName: 'Admin',
//     lastName: 'User',
//     email: 'admin@lgu.gov.ph',
//     departmentId: 4,
//     departmentName: 'Information Technology Department',
//     position: 'System Administrator',
//     role: 'Administrator',
//     status: 'Active',
//     lastLoginDate: '2024-01-15T08:30:00'
//   },
//   {
//     id: 2,
//     username: 'jsmith',
//     firstName: 'John',
//     lastName: 'Smith',
//     email: 'jsmith@lgu.gov.ph',
//     departmentId: 2,
//     departmentName: 'Accounting Department',
//     position: 'Accountant III',
//     role: 'Department Head',
//     status: 'Active',
//     lastLoginDate: '2024-01-15T09:15:00'
//   },
//   {
//     id: 3,
//     username: 'mgarcia',
//     firstName: 'Maria',
//     lastName: 'Garcia',
//     email: 'mgarcia@lgu.gov.ph',
//     departmentId: 1,
//     departmentName: 'Office of the Mayor',
//     position: 'Executive Assistant',
//     role: 'Staff',
//     status: 'Active',
//     lastLoginDate: '2024-01-15T08:45:00'
//   }
// ];

const initialState = {
  users: initialUsers,
  user: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (_, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(initialUsers);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('token');
      
      console.log('🔵 Starting fetchUsers...');
      console.log('🔵 API_URL:', API_URL);
      console.log('🔵 Token exists:', !!token);


       // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      
      console.log('🟢 Fetch completed. Status:', response.status);
      console.log('🟢 Response OK?', response.ok);

      clearTimeout(timeoutId);

      // Try to parse response, handle both JSON and text responses
      let res;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        res = await response.json();
      } else {
        const text = await response.text();
        console.warn('⚠️ Non-JSON response:', text);
        try {
          res = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
        }
      }

      console.log('🟡 Response parsed:', res);
      console.log('🟡 Response type:', typeof res);
      console.log('🟡 Is array?', Array.isArray(res));
      
      if (!response.ok) {
        const errorMessage = res.message || res.error || `Server error: ${response.status}`;
        console.error('🔴 Server error response:', res);
        throw new Error(errorMessage);
      }

      // DEBUG: Check API response structure
      console.log('API Response:', res);
      console.log('Response type:', typeof res);
      console.log('Is array?', Array.isArray(res));
      console.log('Has items?', res.items);
      console.log('Has data?', res.data);

      // Handle different response structures
      if (Array.isArray(res)) {
        return res; // API returns array directly
      } else if (Array.isArray(res.items)) {
        return res.items; // API returns { items: [...] }
      } else if (Array.isArray(res.data)) {
        return res.data; // API returns { data: [...] }
      } else {
        console.warn('Unexpected API response structure:', res);
        return []; // Fallback to empty array
      }
    } catch (error) {
      // Handle different error types
      console.error('🔴 ERROR in fetchUsers:', error);
      console.error('🔴 Error name:', error.name);
      console.error('🔴 Error message:', error.message);
      
      if (error.name === 'AbortError') {
        return thunkAPI.rejectWithValue('Request timeout. Please check your connection.');
      }
      
      // Handle network errors
      if (error.message && error.message.includes('Failed to fetch')) {
        return thunkAPI.rejectWithValue('Network error. Please check your connection and try again.');
      }
      
      // Handle JSON parsing errors
      if (error.message && error.message.includes('JSON')) {
        return thunkAPI.rejectWithValue('Invalid response from server. Please contact support.');
      }
      
      if (error.message) {
        return thunkAPI.rejectWithValue(error.message);
      }
      
      return thunkAPI.rejectWithValue('Failed to fetch users. Please try again.');
    }
  }
);

// export const addUser = createAsyncThunk(
//   'users/addUser',
//   async (user, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           const newUser = {
//             ...user,
//             id: Date.now(),
//             status: user.status || 'Active',
//             lastLoginDate: null
//           };
//           resolve(newUser);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const addUser = createAsyncThunk(
  'users/addUser',
  async (user, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(user),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || res.error || 'Failed to add user');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// export const updateUser = createAsyncThunk(
//   'users/updateUser',
//   async (user, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(user);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(user),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || res.error || 'Failed to update user');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Failed to delete');
      }

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUserState: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('✅ fetchUsers.fulfilled - Payload:', action.payload);
        console.log('✅ Payload type:', typeof action.payload);
        console.log('✅ Is array?', Array.isArray(action.payload));
        console.log('✅ Payload length:', Array.isArray(action.payload) ? action.payload.length : 'N/A');
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        console.error('❌ fetchUsers.rejected - Error:', action.payload || action.error?.message);
        state.error = action.payload || action.error?.message || 'Failed to fetch users';
        // Don't clear users on error, keep existing data
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.users)) {
          state.users = [];
        }
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(
          (user) => user.ID === action.payload.ID
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.ID !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, resetUserState } = userSlice.actions;

export default userSlice.reducer;

