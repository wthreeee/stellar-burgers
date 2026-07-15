import { createSlice } from '@reduxjs/toolkit';

interface WSSliceState {
  connected: boolean;
}

const initialState: WSSliceState = {
  connected: false
};

const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setConnected(state) {
      state.connected = true;
    },
    setDisconnected(state) {
      state.connected = false;
    }
  }
});

export const { setConnected, setDisconnected } = wsSlice.actions;
export default wsSlice.reducer;
