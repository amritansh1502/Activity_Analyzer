import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess(state, action) {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    },
    fetchProfileFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
