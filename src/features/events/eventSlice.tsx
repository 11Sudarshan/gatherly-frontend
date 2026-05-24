import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Matches your Spring Boot Event model
export interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  venue: string;
  ticketPrice: number;
  capacity: number;
  category: string;
  status: string;
  organizer: string;
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  isLoading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.isLoading = false;
      state.events = action.payload;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchEventsStart, fetchEventsSuccess, fetchEventsFailure } = eventSlice.actions;
export default eventSlice.reducer;