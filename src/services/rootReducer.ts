import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import feedsReducer from './slices/feedsSlice';
import wsReducer from './slices/wsSlice';
import profileReducer from './slices/profileSlice';
import constructorReducer from './slices/constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  orders: ordersReducer,
  feeds: feedsReducer,
  ws: wsReducer,
  profile: profileReducer,
  burgerConstructor: constructorReducer
});
