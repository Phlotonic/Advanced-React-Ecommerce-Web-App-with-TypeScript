import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
    },
    reducers: {
        addToCart: (state, action) => {
            const itemToAdd = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.id === itemToAdd.id);

            if (existingItemIndex !== -1) {
                state.items[existingItemIndex].quantity += 1;
            } else {
                state.items.push({ ...itemToAdd, quantity: 1 });
            }
            state.totalItems += 1;
            state.totalPrice += itemToAdd.price; // Assuming itemToAdd has a price property
        },
        removeFromCart: (state, action) => { // Example of another action creator
            const itemIdToRemove = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === itemIdToRemove);
            if (itemIndex !== -1) {
                const itemToRemove = state.items[itemIndex];
                state.totalItems -= itemToRemove.quantity;
                state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
                state.items.splice(itemIndex, 1);
            }
        },
        updateQuantity: (state, action) => { // Example of another action creator
            const { itemId, quantity } = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1 && quantity > 0) {
                const itemToUpdate = state.items[itemIndex];
                const quantityDifference = quantity - itemToUpdate.quantity; // Calculate the difference
                state.totalItems += quantityDifference; // Update total items
                state.totalPrice += quantityDifference * itemToUpdate.price; // Update total price based on difference
                state.items[itemIndex].quantity = quantity; // Update item quantity
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },
    },
});

// Export action creators (this is crucial!)
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;