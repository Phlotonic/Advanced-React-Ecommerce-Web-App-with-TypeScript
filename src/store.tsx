import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/productsSlice';
import cartReducer from './features/cart/cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// (Optional but recommended) Infer the `AppDispatch` type
export type AppDispatch = typeof store.dispatch; 