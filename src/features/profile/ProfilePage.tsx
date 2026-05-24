import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, email } = useAppSelector((state) => state.auth);

  // Mocking data that would normally come from an API call to your booking-service
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  const mockTickets = [
    { id: 'TXN-84729', eventName: 'Global Tech Summit 2026', date: '2026-08-15', tickets: 2, status: 'UPCOMING' },
    { id: 'TXN-11923', eventName: 'React Native Masterclass', date: '2025-11-10', tickets: 1, status: 'PAST' },
  ];

  const filteredTickets = mockTickets.filter(t => t.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      
      {/* Profile Header */}
      <div className="bg-surface border border-outline rounded-xl p-8 shadow-sm mb-8 flex items-center space-x-6">
        <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-3xl font-bold">
          {user ? user.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{user}</h1>
          <p className="text-secondary">{email || 'user@gatherly.com'}</p>
        </div>
      </div>

      {/* Tickets Section */}
      <h2 className="text-2xl font-bold text-primary mb-4">My Tickets</h2>
      
      {/* Custom Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-outline pb-2">
        <button 
          onClick={() => setActiveTab('UPCOMING')}
          className={`pb-2 px-2 font-semibold transition-colors ${activeTab === 'UPCOMING' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-on-surface'}`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => setActiveTab('PAST')}
          className={`pb-2 px-2 font-semibold transition-colors ${activeTab === 'PAST' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-on-surface'}`}
        >
          Past Events
        </button>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="p-8 text-center border border-outline rounded-xl bg-surfaceVariant text-on-surfaceVariant">
          No {activeTab.toLowerCase()} tickets found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-surface border border-outline rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-background px-2 py-1 rounded-md mb-2 inline-block">
                  {ticket.id}
                </span>
                <h3 className="text-xl font-bold text-on-surface">{ticket.eventName}</h3>
                <p className="text-secondary text-sm mt-1">{ticket.date} • {ticket.tickets} Ticket(s)</p>
              </div>
              
              {/* Conditional Action Button based on Tab */}
              <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                {activeTab === 'UPCOMING' ? (
                  <button className="w-full sm:w-auto px-4 py-2 border border-outline text-on-surface rounded-md font-medium hover:bg-surfaceVariant transition-colors">
                    View QR Code
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate(`/feedback/${ticket.id}`, { state: { eventName: ticket.eventName } })}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-on-primary rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    Leave a Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;