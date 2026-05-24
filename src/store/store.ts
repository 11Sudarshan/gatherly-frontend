import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import eventReducer from '../features/events/eventSlice';
import bookingReducer from '../features/booking/bookingSlice';
import paymentReducer from '../features/payments/paymentSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    event: eventReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    admin: adminReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;