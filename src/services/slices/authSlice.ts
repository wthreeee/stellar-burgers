import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface AuthState {
  user: TUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null
};

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const res = await getUserApi();
  return res;
});

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);
    return res;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; name: string; password: string }) => {
    const res = await registerUserApi(data);
    return res;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const res = await logoutApi();
  return res;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
      state.isAuth = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload?.user || null;
      state.isAuth = !!action.payload?.user;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      const payload: any = action.payload;
      if (payload && payload.success) {
        // save tokens
        try {
          localStorage.setItem('refreshToken', payload.refreshToken);
          const rawAccessToken = payload.accessToken.replace(/^Bearer\s+/i, '');
          setCookie('accessToken', rawAccessToken);
        } catch (e) {}
        state.user = payload.user;
        state.isAuth = true;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      const payload: any = action.payload;
      if (payload && payload.success) {
        try {
          localStorage.setItem('refreshToken', payload.refreshToken);
          const rawAccessToken = payload.accessToken.replace(/^Bearer\s+/i, '');
          setCookie('accessToken', rawAccessToken);
        } catch (e) {}
        state.user = payload.user;
        state.isAuth = true;
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(logout.fulfilled, (state) => {
      // clear tokens and user
      try {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      } catch (e) {}
      state.user = null;
      state.isAuth = false;
    });
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
