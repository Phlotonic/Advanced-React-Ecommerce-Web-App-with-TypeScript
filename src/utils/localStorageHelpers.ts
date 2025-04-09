// --- Local Storage Helpers ---

// Import the Order type
import { Order } from '../types/Order';

/**
 * Retrieves the order history array from localStorage.
 * @returns {Order[]} An array of Order objects or an empty array.
 */
export const getOrdersFromLocalStorage = (): Order[] => {
    const orders = localStorage.getItem('orderHistory');
    try {
        return orders ? JSON.parse(orders) as Order[] : [];
    } catch (error) {
        console.error("Error parsing order history from localStorage:", error);
        return [];
    }
};

/**
 * Saves a new order to localStorage.
 * @param newOrder - The Order object to save.
 */
export const saveOrderToLocalStorage = (newOrder: Order) => {
    const orders = getOrdersFromLocalStorage();
    orders.push(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
};