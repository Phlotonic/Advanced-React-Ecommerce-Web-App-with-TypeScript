import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import productsReducer from './features/products/productsSlice';
import cartReducer from './features/cart/cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch; 

export const useAppDispatch = () => useDispatch<AppDispatch>(); 