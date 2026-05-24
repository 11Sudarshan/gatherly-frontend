import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchDashboardStart, fetchDashboardSuccess, fetchDashboardFailure } from './adminSlice';
import type { Event } from '../events/eventSlice';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, users, isLoading } = useAppSelector((state) => state.admin);
  const { events } = useAppSelector((state) => state.event); // Pull events from existing slice

  const [activeTab, setActiveTab] = useState<'USERS' | 'EVENTS'>('USERS');

  useEffect(() => {
    const loadAggregatedData = async () => {
      dispatch(fetchDashboardStart());
      try {
        // --- TEMPORARY MOCK: Simulating the admin-service aggregator pattern ---
        await new Promise((resolve) => setTimeout(resolve, 1200));
        
        const mockData = {
          stats: {
            totalUsers: 1248,
            totalEvents: 42,
            totalBookings: 8930,
            systemStatus: 'Healthy - All 9 Services Online',
          },
          users: [
            { id: 'USR-1', name: 'Super Admin', email: 'admin@gatherly.com', role: 'ADMIN', joinDate: '2025-01-10' },
            { id: 'USR-2', name: 'Standard User', email: 'user@gatherly.com', role: 'USER', joinDate: '2026-03-15' },
            { id: 'USR-3', name: 'John Doe', email: 'john@example.com', role: 'USER', joinDate: '2026-04-20' },
          ]
        };

        dispatch(fetchDashboardSuccess(mockData));
      } catch (err) {
        dispatch(fetchDashboardFailure("Failed to load dashboard data."));
      }
    };

    loadAggregatedData();
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Control Panel</h1>
          <p className="text-secondary mt-1">Master Aggregator View</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-300 dark:border-green-800">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          {stats.systemStatus}
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm">
          <h3 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-on-surface">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm">
          <h3 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Total Events</h3>
          <p className="text-4xl font-bold text-on-surface">{stats.totalEvents.toLocaleString()}</p>
        </div>
        <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm">
          <h3 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Total Bookings</h3>
          <p className="text-4xl font-bold text-on-surface">{stats.totalBookings.toLocaleString()}</p>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-outline bg-background">
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'USERS' ? 'bg-surface text-primary border-b-2 border-primary' : 'text-secondary hover:bg-surfaceVariant'}`}
          >
            Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('EVENTS')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'EVENTS' ? 'bg-surface text-primary border-b-2 border-primary' : 'text-secondary hover:bg-surfaceVariant'}`}
          >
            Manage Events
          </button>
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto">
          {activeTab === 'USERS' && (
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-background text-secondary font-bold uppercase">
                <tr>
                  <th className="px-6 py-4 border-b border-outline">User ID</th>
                  <th className="px-6 py-4 border-b border-outline">Name</th>
                  <th className="px-6 py-4 border-b border-outline">Email</th>
                  <th className="px-6 py-4 border-b border-outline">Role</th>
                  <th className="px-6 py-4 border-b border-outline">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surfaceVariant transition-colors border-b border-outline last:border-0">
                    <td className="px-6 py-4 font-mono text-xs">{u.id}</td>
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${u.role === 'ADMIN' ? 'bg-primary text-on-primary' : 'bg-secondaryContainer text-on-secondaryContainer'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-error font-medium hover:underline">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'EVENTS' && (
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-background text-secondary font-bold uppercase">
                <tr>
                  <th className="px-6 py-4 border-b border-outline">Event</th>
                  <th className="px-6 py-4 border-b border-outline">Date</th>
                  <th className="px-6 py-4 border-b border-outline">Status</th>
                  <th className="px-6 py-4 border-b border-outline">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-secondary">
                      No events loaded in Redux. Go to the Events page first to load mock data!
                    </td>
                  </tr>
                ) : (
                  events.map((e: Event) => (
                    <tr key={e.id} className="hover:bg-surfaceVariant transition-colors border-b border-outline last:border-0">
                      <td className="px-6 py-4 font-medium">{e.name}</td>
                      <td className="px-6 py-4">{e.eventDate}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-tertiaryContainer text-on-tertiaryContainer">
                          {e.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary font-medium hover:underline mr-4">Edit</button>
                        <button className="text-error font-medium hover:underline">Cancel</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;