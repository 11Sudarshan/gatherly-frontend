import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  isProcessing: boolean;
  paymentSuccess: boolean;
  transactionId: string | null;
  error: string | null;
}

const initialState: PaymentState = {
  isProcessing: false,
  paymentSuccess: false,
  transactionId: null,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    processPaymentStart: (state) => {
      state.isProcessing = true;
      state.error = null;
      state.paymentSuccess = false;
    },
    processPaymentSuccess: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.paymentSuccess = true;
      state.transactionId = action.payload;
    },
    processPaymentFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.error = action.payload;
      state.paymentSuccess = false;
    },
    resetPaymentState: (state) => {
      state.isProcessing = false;
      state.paymentSuccess = false;
      state.transactionId = null;
      state.error = null;
    }
  },
});

export const { processPaymentStart, processPaymentSuccess, processPaymentFailure, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;