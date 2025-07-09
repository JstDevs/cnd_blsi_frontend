import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/budget`, { method: 'GET' })
      const res = await response.json()

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch')
      }

      return res
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budgetData) => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: Date.now(),
            ...budgetData,
            status: 'active'
          }
        })
      }, 1000)
    })
    return response.data
  }
)

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, budgetData }) => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id,
            ...budgetData
          }
        })
      }, 1000)
    })
    return response.data
  }
)

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (id) => {
    // Simulate API call
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    return id
  }
)

const initialState = {
  budgets: [],
  isLoading: false,
  error: null
}

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets.push(action.payload)
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Update budget
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.budgets.findIndex(
          (budget) => budget.id === action.payload.id
        )
        if (index !== -1) {
          state.budgets[index] = action.payload
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== action.payload
        )
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  }
})

export default budgetSlice.reducer
