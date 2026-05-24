import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { processPaymentStart, processPaymentSuccess, processPaymentFailure, resetPaymentState } from './paymentSlice';
import { clearBookingState } from '../booking/bookingSlice';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Pull the pending booking details from Redux
  const { currentBooking } = useAppSelector((state) => state.booking);
  const { isProcessing, paymentSuccess, transactionId, error } = useAppSelector((state) => state.payment);

  // Mock Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  // Cleanup when leaving the page
  useEffect(() => {
    return () => { dispatch(resetPaymentState()); };
  }, [dispatch]);

  // Security Check: If there is no pending booking, kick them out
  if (!currentBooking) {
    return <Navigate to="/events" replace />;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(processPaymentStart());

    try {
      // --- TEMPORARY UI MOCK (Bypassing real API Gateway) ---
      // Simulate connecting to Stripe/Razorpay and your payment-service
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      
      // Simple validation mock
      if (cardNumber.length < 16) {
        throw new Error("Invalid card number");
      }

      const mockTransactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
      // ------------------------------------------------------

      dispatch(processPaymentSuccess(mockTransactionId));
      
      // Clear the booking and send them to the events page after 3 seconds
      setTimeout(() => {
        dispatch(clearBookingState());
        navigate('/events'); 
      }, 3000);

    } catch (err: any) {
      dispatch(processPaymentFailure(err.message || "Payment processing failed."));
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-surface border border-outline rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Payment Successful!</h2>
          <p className="text-secondary mb-6">Your tickets have been confirmed.</p>
          <div className="bg-background rounded-lg p-4 text-sm text-on-surface text-left">
            <p><span className="font-bold">Transaction ID:</span> {transactionId}</p>
            <p><span className="font-bold">Amount Paid:</span> ${currentBooking.totalPrice.toFixed(2)}</p>
          </div>
          <p className="text-sm text-secondary mt-6 animate-pulse">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Secure Checkout</h1>

      <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-on-surface mb-2">Order Total</h2>
        <p className="text-4xl font-bold text-primary">${currentBooking.totalPrice.toFixed(2)}</p>
        <p className="text-sm text-secondary mt-1">For {currentBooking.numberOfTickets} ticket(s)</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error text-on-error rounded-lg font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePayment} className="bg-surface border border-outline rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Name on Card</label>
          <input
            type="text"
            required
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            className="w-full px-4 py-2 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Card Number</label>
          <input
            type="text"
            required
            maxLength={16}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-2 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Expiry (MM/YY)</label>
            <input
              type="text"
              required
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-4 py-2 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="12/26"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">CVV</label>
            <input
              type="text"
              required
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full mt-6 py-3 bg-primary text-on-primary rounded-md font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center"
        >
          {isProcessing ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            `Pay $${currentBooking.totalPrice.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;