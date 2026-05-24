import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

// Matches the backend Booking entity
export interface Booking {
  id?: number;
  eventId: number;
  userId: string;
  numberOfTickets: number;
  totalPrice: number;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

interface BookingState {
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: BookingState = {
  currentBooking: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    processBookingStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    processBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.isLoading = false;
      state.currentBooking = action.payload;
      state.successMessage = 'Booking confirmed successfully!';
    },
    processBookingFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearBookingState: (state) => {
      state.currentBooking = null;
      state.error = null;
      state.successMessage = null;
    }
  },
});

export const { processBookingStart, processBookingSuccess, processBookingFailure, clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;