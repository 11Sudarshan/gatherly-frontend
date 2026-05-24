import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { processBookingStart, processBookingSuccess, processBookingFailure, clearBookingState } from './bookingSlice';
import type { Event } from '../events/eventSlice';

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Extract the event passed from the previous page's router state
  const event = location.state?.event as Event;
  
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading, error, successMessage } = useAppSelector((state) => state.booking);

  const [ticketCount, setTicketCount] = useState<number>(1);
  
 
  // If someone tries to navigate directly to /book without an event, kick them back
  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const subtotal = event.ticketPrice * ticketCount;
  const tax = subtotal * 0.10; // 10% mock tax
  const total = subtotal + tax;

  const handleConfirmBooking = async () => {
    dispatch(processBookingStart());

    try {
      // --- TEMPORARY UI MOCK (Bypassing real API Gateway) ---
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network
      
      const mockBackendResponse = {
        id: Math.floor(Math.random() * 10000), // Fake booking ID
        eventId: event.id,
        userId: user || 'Unknown',
        numberOfTickets: ticketCount,
        totalPrice: total,
        bookingDate: new Date().toISOString(),
        status: 'CONFIRMED' as const
      };
      // ------------------------------------------------------

      dispatch(processBookingSuccess(mockBackendResponse));
      
      // Navigate to a success/payment page after 2 seconds
      setTimeout(() => {
        navigate('/payment'); // We will change this to '/payment' later!
      }, 2000);

    } catch (err) {
      dispatch(processBookingFailure("Payment gateway failed. Please try again."));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center"
      >
        ← Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Event Details & Ticket Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-primary mb-2">{event.name}</h1>
            <p className="text-on-surfaceVariant mb-6">{event.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:space-x-8 text-secondary text-sm">
              <div className="mb-2 sm:mb-0">
                <span className="block font-bold text-on-surface">Date & Time</span>
                {event.eventDate}
              </div>
              <div>
                <span className="block font-bold text-on-surface">Location</span>
                {event.venue}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-on-surface mb-4">Select Tickets</h2>
            <div className="flex items-center justify-between border border-outline p-4 rounded-lg bg-background">
              <div>
                <p className="font-semibold text-on-surface">General Admission</p>
                <p className="text-sm text-secondary">${event.ticketPrice.toFixed(2)} per ticket</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-8 h-8 rounded-full bg-surfaceVariant text-on-surfaceVariant font-bold hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50"
                  disabled={ticketCount <= 1 || isLoading || !!successMessage}
                >
                  -
                </button>
                <span className="font-bold text-lg w-4 text-center">{ticketCount}</span>
                <button 
                  onClick={() => setTicketCount(Math.min(event.capacity, ticketCount + 1))}
                  className="w-8 h-8 rounded-full bg-surfaceVariant text-on-surfaceVariant font-bold hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50"
                  disabled={ticketCount >= 10 || isLoading || !!successMessage}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-bold text-on-surface mb-6">Order Summary</h2>
          
          <div className="space-y-3 text-sm mb-6 border-b border-outline pb-6">
            <div className="flex justify-between text-on-surface">
              <span>{ticketCount}x Tickets</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Taxes & Fees (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between font-bold text-lg text-on-surface mb-8">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {error && <p className="text-error text-sm font-medium mb-4 text-center">{error}</p>}
          
          {successMessage ? (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded text-center font-bold">
              {successMessage}
              <p className="text-xs mt-1 font-normal">Redirecting...</p>
            </div>
          ) : (
            <button
              onClick={handleConfirmBooking}
              disabled={isLoading}
              className="w-full py-3 bg-primary text-on-primary rounded-md font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                `Confirm & Pay $${total.toFixed(2)}`
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingPage;