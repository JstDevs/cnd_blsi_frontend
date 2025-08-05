import axiosInstance from '@/utils/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// Async Thunks
export const fetchBudgetOptions = createAsyncThunk(
  'budgetTransfer/fetchBudgetOptions',
  async () => {
    const response = await axiosInstance.get('/budgetTransfer/budgetList');
    return response.data;
  }
);

export const fetchBudgetTransfers = createAsyncThunk(
  'budgetTransfer/fetchBudgetTransfers',
  async () => {
    const response = await axiosInstance.get('/budgetTransfer/list');
    return response.data;
  }
);

export const createBudgetTransfer = createAsyncThunk(
  'budgetTransfer/createBudgetTransfer',
  async (values) => {
    const response = await axiosInstance.post('/budgetTransfer/save', values, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for FormData
      },
    });
    toast.success('Budget transfer created successfully');
    return response.data;
  }
);

export const deleteBudgetTransfer = createAsyncThunk(
  'budgetTransfer/deleteBudgetTransfer',
  async (id) => {
    await axiosInstance.delete(`/budgetTransfer/${id}`);
    toast.success('Budget transfer deleted successfully');
    return id;
  }
);

const budgetTransferSlice = createSlice({
  name: 'budgetTransfer',
  initialState: {
    budgetOptions: [], // For the select dropdown
    transfers: [], // For the table data
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch budget options
      .addCase(fetchBudgetOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetOptions = action.payload || [];
      })
      .addCase(fetchBudgetOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to fetch budget options');
      })

      // Fetch budget transfers
      .addCase(fetchBudgetTransfers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload || [];
      })
      .addCase(fetchBudgetTransfers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to fetch budget transfers');
      })

      // Create budget transfer
      .addCase(createBudgetTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudgetTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = [...state.transfers, action.payload];
      })
      .addCase(createBudgetTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to create budget transfer');
      })

      // Delete budget transfer
      .addCase(deleteBudgetTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudgetTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = state.transfers.filter(
          (transfer) => transfer.id !== action.payload
        );
      })
      .addCase(deleteBudgetTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to delete budget transfer');
      });
  },
});

export default budgetTransferSlice.reducer;
