import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    // () => <Promise>
    // pending 'products/fetchProducts/pending'
    // fulfilled 'products/fetchProducts/fulfilled'
    // rejected 'products/fetchProducts/rejected'
    async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add fetched products to state
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });
    },
});

export default productSlice.reducer;