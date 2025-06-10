import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    fetchActivitiesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchActivitiesSuccess(state, action) {
      state.loading = false;
      state.activities = action.payload;
      state.error = null;
    },
    fetchActivitiesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearActivities(state) {
      state.activities = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchActivitiesStart,
  fetchActivitiesSuccess,
  fetchActivitiesFailure,
  clearActivities,
} = activitySlice.actions;

export default activitySlice.reducer;
