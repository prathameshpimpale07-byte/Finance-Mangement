import { create } from 'zustand';
import api from '../utils/api.js';

const initialState = {
  trips: [],
  currentTrip: null,
  members: [],
  expenses: [],
  settlement: null,
  activity: [],
  loading: false,
  error: null,
};

const useTripStore = create((set, get) => ({
  ...initialState,
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  fetchTrips: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/trips');
      set({ trips: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  selectTrip: async (tripId) => {
    if (!tripId) return;
    set({ loading: true });
    try {
      const [tripRes, expenseRes, memberRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/expenses/${tripId}`),
        api.get(`/members/${tripId}`),
      ]);

      set({
        currentTrip: tripRes.data,
        expenses: expenseRes.data,
        members: memberRes.data,
        activity: tripRes.data.activity || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createTrip: async (payload) => {
    const { data } = await api.post('/trips', payload);
    set((state) => ({ trips: [data, ...state.trips] }));
    return data;
  },

  addMember: async (tripId, payload) => {
    const { data } = await api.post(`/members/${tripId}`, payload);
    set((state) => ({
      members: [...state.members, data],
      trips: state.trips.map((trip) =>
        trip._id === tripId
          ? { ...trip, members: [...(trip.members || []), data] }
          : trip
      ),
    }));
    return data;
  },

  removeMember: async (tripId, memberId) => {
    await api.delete(`/members/${tripId}/${memberId}`);
    set((state) => ({
      members: state.members.filter((member) => member._id !== memberId),
      trips: state.trips.map((trip) =>
        trip._id === tripId
          ? {
              ...trip,
              members: (trip.members || []).filter(
                (member) => member._id !== memberId
              ),
            }
          : trip
      ),
    }));
  },

  addExpense: async (tripId, payload) => {
    const { data } = await api.post(`/expenses/${tripId}`, payload);
    set((state) => ({
      expenses: [data, ...state.expenses],
    }));
    await get().selectTrip(tripId);
    return data;
  },

  updateExpense: async (tripId, expenseId, payload) => {
    const { data } = await api.put(
      `/expenses/${tripId}/${expenseId}`,
      payload
    );
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense._id === expenseId ? data : expense
      ),
    }));
    return data;
  },

  deleteExpense: async (tripId, expenseId) => {
    await api.delete(`/expenses/${tripId}/${expenseId}`);
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense._id !== expenseId),
    }));
  },

  loadSettlement: async (tripId) => {
    const { data } = await api.get(`/settlement/${tripId}`);
    set({ settlement: data });
    return data;
  },

  deleteTrip: async (tripId) => {
    await api.delete(`/trips/${tripId}`);
    set((state) => ({
      trips: state.trips.filter((trip) => trip._id !== tripId),
      currentTrip: state.currentTrip?._id === tripId ? null : state.currentTrip,
    }));
  },

  reset: () => set(initialState),
}));

export default useTripStore;

