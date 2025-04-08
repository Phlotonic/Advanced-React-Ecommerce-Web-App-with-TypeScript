import React from 'react';
// Import hook for data fetching and state management from TanStack Query (React Query)
import { useQuery } from '@tanstack/react-query';
// Import UI components from React Bootstrap
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
// Import Link component for navigation from React Router
import { Link } from 'react-router-dom';
// Import hook for internationalization (translation)
import { useTranslation } from 'react-i18next';

// --- Type Definitions ---

/**
 * Defines the structure for a single item within an order.
 * Used for type safety when processing order data.
 */
interface ProductItem {
    id: number; 
    name: string; 
    price: number; 
    quantity: number; 
    // Add other product properties if they exist in the stored data
}

/**
 * Defines the structure for a single order object.
 * Used for type safety when fetching and displaying order history.
 */
interface Order {
    orderId: string | number; // Unique identifier for the order
    dateCreated: string | number; // Timestamp or date string when the order was created
    items: ProductItem[]; // An array containing the products in this order
    totalPrice: number; // The total price calculated for the order
    // Add any other relevant order properties (e.g., status, shippingAddress) if they exist
}

/**
 * OrderHistory Component
 * Fetches and displays a list of past orders for the user.
 * Retrieves order data from localStorage (simulating an async fetch using React Query).
 * Handles loading, error, and empty states.
 */
function OrderHistory() {
    // Get the translation function 't' from react-i18next
    const { t } = useTranslation();

    // --- Data Fetching Functions ---

    /**
     * Retrieves order history data directly from the browser's localStorage.
     * Parses the stored JSON string into an array or returns an empty array if not found.
     * @returns {Order[]} An array of Order objects or an empty array.
     */
    const getOrdersFromLocalStorage = (): Order[] => {
        const orders = localStorage.getItem('orderHistory');
        // Use try-catch for robust parsing, although omitted here for brevity
        // Consider adding error handling for JSON.parse if data might be corrupted
        return orders ? JSON.parse(orders) : [];
    };
    
    /**
     * Asynchronous function designed to be used as the 'queryFn' for React Query.
     * It simulates a network delay and then fetches order history from localStorage.
     * In a real application, this would likely fetch data from a backend API endpoint.
     * @returns {Promise<Order[]>} A promise that resolves to the array of orders.
     */
    const fetchOrderHistory = async (): Promise<Order[]> => {
        // Simulate network latency (e.g., 200ms delay)
        await new Promise(resolve => setTimeout(resolve, 200));
        const orders = getOrdersFromLocalStorage();
        return orders;
    };


    // --- React Query Hook ---
    
    // Use the useQuery hook to fetch, cache, and manage the order history data.
    // The generic <Order[]> explicitly tells useQuery the expected data type, enabling type safety.
    const { 
        data: orderHistory, // The fetched data (renamed from 'data' to 'orderHistory'), typed as Order[] or undefined initially
        status,             // The current status of the query ('pending', 'error', 'success')
        error,              // Stores the error object if status is 'error'
        isFetching          // Boolean, true if the query is currently fetching (initial or background)
    } = useQuery<Order[]>({
        queryKey: ['orderHistory'], // Unique key to identify this query data in the cache
        queryFn: fetchOrderHistory, // The function that performs the data fetching
        // Provides initial data (empty array). This means 'status' will likely start as 'success'.
        // 'isFetching' will be true during the initial simulated fetch.
        initialData: [], 
    });

    // --- Conditional Rendering based on Query State ---

    // Display a loading spinner if the query is currently fetching data.
    // Uses 'isFetching' which covers initial fetch and background refetches.
    if (isFetching) { 
        return (
            <Container className="mt-5 text-center">
                {/* Use React Bootstrap Spinner component for loading indication */}
                <Spinner animation="border" role="status" aria-live="polite"> {/* ARIA attributes enhance accessibility */}
                    <span className="visually-hidden">{t('loadingOrderHistory')}</span> 
                </Spinner>
                <p>{t('loadingOrderHistory')}</p> 
            </Container>
        );
    }

    // Display an error message if the query encountered an error.
    if (status === 'error') {
        return (
            <Container className="mt-5">
                {/* Use React Bootstrap Alert component for error feedback */}
                <Alert variant="danger" role="alert"> {/* role="alert" helps screen readers */}
                    <Alert.Heading>{t('errorLoadingData')}</Alert.Heading>
                    <p>{t('tryAgainLater')}</p>
                    {/* Display the error message. Use optional chaining (?.) as error might be null. */}
                    <p>{t('orderHistoryError')}: {error?.message}</p> 
                    {/* Duplicated error message line - might be intentional or a typo? */}
                    <p>{t('productDataError')}: {error?.message}</p> 
                </Alert>
            </Container>
        );
    }

    // Display a message if the fetch was successful but no orders were found.
    // Checks if orderHistory is falsy (shouldn't happen with initialData=[]) or if the array is empty.
    if (!orderHistory || orderHistory.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="info" role="alert"> 
                    <Alert.Heading>{t('noOrderHistory')}</Alert.Heading>
                    <p>{t('noOrdersFound')}</p>
                </Alert>
            </Container>
        );
    }

    // --- Render Order History Table (Success State) ---
    // This section renders only if data fetching was successful and there are orders to display.
    return (
        <Container className="mt-5">
            {/* Page Title */}
            <h2>{t('orderHistoryTitle')}</h2>
            {/* Responsive table using React Bootstrap */}
            <Table striped bordered hover responsive>
                {/* Table Headers */}
                <thead>
                    <tr>
                        <th>{t('orderId')}</th>
                        <th>{t('date')}</th>
                        <th>{t('totalItems')}</th>
                        <th>{t('totalPrice')}</th>
                    </tr>
                </thead>
                {/* Table Body - Iterate over the fetched orderHistory array */}
                <tbody>
                    {/* Map each 'order' object (correctly typed as 'Order' due to useQuery<Order[]>) to a table row */}
                    {orderHistory.map(order => ( 
                        // Use a unique key for each row, essential for React list rendering
                        <tr key={order.orderId}> 
                            {/* Display Order ID */}
                            <td>{order.orderId}</td>
                            {/* Display formatted date - assumes dateCreated is valid for Date constructor */}
                            <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                            {/* Calculate total items by summing quantities from the 'items' array */}
                            <td>
                                {order.items.reduce(
                                    // Accumulator 'sum' is typed as number, 'product' as ProductItem
                                    (sum: number, product: ProductItem) => sum + product.quantity, 
                                    0 // Initial value for the sum
                                )}
                            </td>
                            {/* Display total price, formatted as currency */}
                            <td>
                                ${order.totalPrice.toFixed(2)} {/* Use toFixed(2) for consistent decimal places */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Link to navigate back to the home page */}
            <p className="mt-3">
                <Link to="/home">{t('backToHome')}</Link>
            </p>
        </Container>
    );
}

// Export the component
export default OrderHistory;