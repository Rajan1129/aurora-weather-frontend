import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeLocation: null,
  savedLocations: [],
  units: 'celsius',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setActiveLocation(state, action) {
      state.activeLocation = action.payload;
    },
    setSavedLocations(state, action) {
      state.savedLocations = action.payload;
    },
    setUnits(state, action) {
      state.units = action.payload;
    },
  },
});

export const { setActiveLocation, setSavedLocations, setUnits } = weatherSlice.actions;
export default weatherSlice.reducer;
