import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  systemStatus: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
}

interface AdminState {
  stats: AdminStats | null;
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  users: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action: PayloadAction<{ stats: AdminStats; users: AdminUser[] }>) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.users = action.payload.users;
    },
    fetchDashboardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDashboardStart, fetchDashboardSuccess, fetchDashboardFailure } = adminSlice.actions;
export default adminSlice.reducer;