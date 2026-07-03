import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';

interface ProfileState {
  profile: TUser | null;
}

const initialState: ProfileState = {
  profile: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    }
  }
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
