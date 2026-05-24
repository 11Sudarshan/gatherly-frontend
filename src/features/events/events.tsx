import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchEventsStart, fetchEventsSuccess, fetchEventsFailure } from './eventSlice';
import api from '../../config/api';

const Events: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { events, isLoading, error } = useAppSelector((state) => state.event);
  const { user } = useAppSelector((state) => state.auth);

  // Function to actually fetch from your backend later
  const loadEvents = async () => {
    dispatch(fetchEventsStart());
    try {
      const response = await api.get('/events');
      dispatch(fetchEventsSuccess(response.data));
    } catch (err: any) {
      dispatch(fetchEventsFailure(err.response?.data?.message || 'Failed to load events'));
    }
  };

  // Temporary function to inject fake data for UI testing
  const injectMockData = () => {
    const mockEvents = [
      {
        id: 1, name: "Global Tech Summit 2026", description: "The premier gathering for software engineers and innovators.",
        eventDate: "2026-08-15", venue: "Silicon Valley Convention Center", ticketPrice: 299.99,
        capacity: 5000, category: "Technology", status: "UPCOMING", organizer: "Tech Innovators Inc."
      },
      {
        id: 2, name: "Neon Nights Music Festival", description: "A three-day electronic music experience.",
        eventDate: "2026-09-10", venue: "Downtown Arena", ticketPrice: 150.00,
        capacity: 15000, category: "Music", status: "UPCOMING", organizer: "Live Nation"
      }
    ];
    dispatch(fetchEventsSuccess(mockEvents));
  };

  useEffect(() => {
    // We will uncomment this when the backend is ready to test!
    // loadEvents();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Discover Events</h1>
          <p className="text-secondary mt-1">Welcome back, {user}</p>
        </div>
        
        {/* DEV ONLY: Button to load fake data for UI testing */}
        <button 
          onClick={injectMockData}
          className="mt-4 md:mt-0 px-4 py-2 border-2 border-primary text-primary rounded-md font-semibold hover:bg-primary hover:text-on-primary transition-colors"
        >
          Load Mock Data (UI Test)
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-error text-on-error rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-outline rounded-xl">
          <p className="text-secondary text-lg">No events found. Check back later!</p>
        </div>
      ) : (
        /* Event Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="flex flex-col bg-surface border border-outline rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card Header (Optional Image placeholder space) */}
              <div className="h-32 bg-secondaryContainer flex items-end p-4">
                <span className="px-3 py-1 bg-background text-primary text-xs font-bold uppercase rounded-full tracking-wider">
                  {event.category}
                </span>
              </div>
              
              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-on-surface mb-2 line-clamp-1">{event.name}</h3>
                <p className="text-on-surfaceVariant text-sm mb-4 line-clamp-2 flex-1">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-6 text-sm text-secondary">
                  <div className="flex items-center">
                    <span className="font-semibold w-16">Date:</span> {event.eventDate}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-16">Venue:</span> {event.venue}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-16">Price:</span> ${event.ticketPrice.toFixed(2)}
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/book/${event.id}`, { state: { event } })}
                  className="w-full py-2.5 bg-primary text-on-primary rounded-md font-semibold hover:opacity-90 transition-opacity mt-auto"
                >
                  Book Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;