import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 1. Define the shape of our state
interface AuthState {
  user: string | null;
  role: string | null;
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

// 2. Define the payload shape for logging in
interface LoginPayload {
  user: string;
  role: string;
  email: string;
  token: string;
}

const initialState: AuthState = {
  user: localStorage.getItem('name') || null,
  email: localStorage.getItem('email') || null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginPayload>) => {
      const { user, role, email, token } = action.payload;
      state.user = user;
      state.role = role;
      state.email = email;
      state.token = token;
      state.isAuthenticated = true;
      
      localStorage.setItem('name', user);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.email = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;