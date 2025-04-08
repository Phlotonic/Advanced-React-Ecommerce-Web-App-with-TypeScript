// Import createSlice function from Redux Toolkit and PayloadAction type for typing actions
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- Type Definitions ---
// Assuming Product and CartItem types are defined elsewhere (e.g., shared types file or relevant component)
// If not, define them here or import them. Let's assume they exist and look like this:
// import type { Product } from './productTypes'; // Example import

// Define structure for items stored in the cart (Product + quantity)
interface CartItem { // Replace with import if defined elsewhere
    id: number; 
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: { rate: number; count: number; }; // Assuming rating structure
    quantity: number; 
}

// Define the shape of the state managed by this cart slice
interface CartState {
    items: CartItem[]; // An array of items currently in the cart
    totalItems: number; // The total count of all individual items (sum of quantities)
    totalPrice: number; // The total price of all items in the cart
}

// --- Initial State ---

// Define the initial state for the cart slice, conforming to CartState interface
const initialState: CartState = {
    items: [], // Start with an empty array of items
    totalItems: 0,
    totalPrice: 0,
};

// --- Slice Definition ---

// Create the cart slice using Redux Toolkit's createSlice function
const cartSlice = createSlice({
    name: 'cart', // Name of the slice, used in action types
    initialState, // The initial state defined above
    // Reducers define how the state can be updated in response to dispatched actions.
    // Redux Toolkit uses Immer internally, allowing us to write "mutating" logic safely.
    reducers: {
        /**
         * Adds a product to the cart. If the product already exists, increments its quantity.
         * Updates totalItems and totalPrice accordingly.
         * Expects a Product object as the action payload.
         */
        addToCart: (state, action: PayloadAction<Product>) => { // Type the action payload as Product
            const itemToAdd = action.payload; // The product object to add
            // Find if the item already exists in the cart items array
            const existingItemIndex = state.items.findIndex(item => item.id === itemToAdd.id);

            if (existingItemIndex !== -1) {
                // If item exists, just increment its quantity
                state.items[existingItemIndex].quantity += 1;
            } else {
                // If item doesn't exist, add it to the array with quantity 1
                // Spread the product properties and add the quantity property
                state.items.push({ ...itemToAdd, quantity: 1 }); 
            }
            // Increment the total number of items in the cart
            state.totalItems += 1; 
            // Add the price of the added item to the total price
            state.totalPrice += itemToAdd.price; 
        },

        /**
         * Removes an item (entirely, regardless of quantity) from the cart based on its ID.
         * Updates totalItems and totalPrice accordingly.
         * Expects the product ID (number) as the action payload.
         */
        removeFromCart: (state, action: PayloadAction<number>) => { // Type the action payload as number (product ID)
            const itemIdToRemove = action.payload; // The ID of the item to remove
            // Find the index of the item to remove
            const itemIndex = state.items.findIndex(item => item.id === itemIdToRemove);

            // Proceed only if the item was found
            if (itemIndex !== -1) {
                const itemToRemove = state.items[itemIndex]; // Get the item object being removed
                // Decrease total item count by the quantity of the removed item
                state.totalItems -= itemToRemove.quantity; 
                // Decrease total price by the total value of the removed item (price * quantity)
                state.totalPrice -= itemToRemove.price * itemToRemove.quantity; 
                // Remove the item from the items array using splice
                state.items.splice(itemIndex, 1); 
            }
        },

        /**
         * Updates the quantity of a specific item in the cart.
         * Adjusts totalItems and totalPrice based on the quantity change.
         * Expects an object { itemId: number, quantity: number } as the action payload.
         */
        updateQuantity: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => { // Type the payload object
            // Destructure itemId and new quantity from the payload
            const { itemId, quantity } = action.payload; 
            // Find the index of the item to update
            const itemIndex = state.items.findIndex(item => item.id === itemId);

            // Proceed only if the item exists and the new quantity is valid (greater than 0)
            if (itemIndex !== -1 && quantity > 0) {
                const itemToUpdate = state.items[itemIndex]; // Get the item object
                // Calculate the difference between the new quantity and the old quantity
                const quantityDifference = quantity - itemToUpdate.quantity; 
                // Update the total item count by this difference
                state.totalItems += quantityDifference; 
                // Update the total price based on the price of the item and the quantity difference
                state.totalPrice += quantityDifference * itemToUpdate.price; 
                // Set the item's quantity to the new value
                state.items[itemIndex].quantity = quantity; 
            }
            // Consider adding logic here to remove the item if quantity becomes 0, 
            // or handle that via removeFromCart action elsewhere.
        },

        /**
         * Clears the entire shopping cart, resetting it to the initial empty state.
         * Takes no payload.
         */
        clearCart: (state) => { // No payload needed for this action
            // Reset all parts of the cart state back to their initial values
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },
    },
});

// --- Exports ---

// Export the action creators generated by createSlice.
// These are used in components to dispatch actions (e.g., dispatch(addToCart(product))).
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Export the reducer function generated by createSlice.
// This will be added to the root reducer in the main store configuration.
export default cartSlice.reducer;

// Optional: Export the state type if needed elsewhere (e.g., for selectors)
export type { CartState, CartItem };