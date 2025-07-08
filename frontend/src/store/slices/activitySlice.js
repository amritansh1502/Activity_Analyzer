import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  'activity/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/activity');
      return response.data.activities;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch activities');
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivities(state) {
      state.activities = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
        state.error = null;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActivities } = activitySlice.actions;

export default activitySlice.reducer;
