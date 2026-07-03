import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';
import { clearConstructor } from './constructorSlice';

interface OrdersState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  lastOrder: any | null;
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  lastOrder: null
};

export const createOrder = createAsyncThunk<any, void, { state: RootState }>(
  'orders/create',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const bun = state.constructor.bun;
    const ingredients = state.constructor.ingredients;
    const ids = [] as string[];
    if (bun) {
      ids.push(bun._id);
    }
    ingredients.forEach((i) => ids.push(i._id));

    const res = await orderBurgerApi(ids);
    return res;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.lastOrder = action.payload;
      state.error = null;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка заказа';
    });

    builder.addCase(fetchUserOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });
  }
});

export default ordersSlice.reducer;
