import React from 'react';
import { useSelector } from 'react-redux';
// Import the typed dispatch hook and RootState type
import { useAppDispatch, RootState } from '../store'; 
import { removeFromCart, clearCart } from '../features/cart/cartSlice';
import { Container, Row, Col, Button, Table, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- Type Definitions ---

// Define the structure for the nested rating object (matching ProductCatalog)
interface ProductRating {
    rate: number;
    count: number;
}

// Define the structure for a Product (matching ProductCatalog)
interface Product {
    id: number; // Use number for ID consistency
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: ProductRating; 
}

// Define the structure for an item in the shopping cart
// It extends Product and adds quantity
interface CartItem extends Product {
    quantity: number;
}

// Define the structure for an order object (matching OrderHistory)
// Ensure ProductItem here matches CartItem structure if applicable, or use CartItem[] directly
interface ProductItem extends Product { // Re-using ProductItem name, ensure structure matches CartItem if needed
    quantity: number; // Make sure this matches what OrderHistory expects
}
interface Order {
    orderId: string; // Typically string IDs are better
    dateCreated: string; // ISO string format is standard
    items: ProductItem[]; // Array of items in the order
    totalPrice: number; // Use number for calculations, format later
}

// --- Component ---

function ShoppingCart() {
    // --- Hooks ---
    // Use the typed dispatch hook
    const dispatch = useAppDispatch(); 
    // Select the cart items from the Redux store. 
    // Explicitly type the return value as CartItem[] for safety.
    const cartItems = useSelector((state: RootState): CartItem[] => state.cart.items); 
    // Get translation function
    const { t } = useTranslation(); 

    // --- Event Handlers & Logic ---

    /**
     * Dispatches action to remove an item from the cart based on its ID.
     * @param productId - The ID (number) of the product to remove.
     */
    const handleRemoveFromCart = (productId: number) => { // Add type for productId
        dispatch(removeFromCart(productId));
    };

    /**
     * Dispatches action to clear all items from the shopping cart.
     */
    const handleClearCart = () => {
        dispatch(clearCart());
    };

    /**
     * Calculates the total price of all items currently in the cart.
     * @returns {number} The calculated total price.
     */
    const calculateTotal = (): number => { // Ensure it returns a number
        // Use reduce to sum up the price * quantity for each item.
        // Add explicit types for accumulator (total) and item.
        return cartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0); 
    };

    // --- Local Storage Helpers --- (Consider moving to a separate utility file)

    /**
     * Retrieves the order history array from localStorage.
     * @returns {Order[]} An array of Order objects or an empty array.
     */
    const getOrdersFromLocalStorage = (): Order[] => {
        const orders = localStorage.getItem('orderHistory');
        try {
            // Parse stored orders, asserting the type (use carefully, assumes data is valid)
            return orders ? JSON.parse(orders) as Order[] : []; 
        } catch (error) {
            console.error("Error parsing order history from localStorage:", error);
            return []; // Return empty array if parsing fails
        }
    };

    /**
     * Saves a new order object to the order history in localStorage.
     * Appends the new order to any existing orders.
     * @param order - The new Order object to save.
     */
    const saveOrderToLocalStorage = (order: Order) => { // Add type for order parameter
        const existingOrders = getOrdersFromLocalStorage();
        // Add the new order and save the updated array back to localStorage
        localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, order]));
    };

    // --- Checkout Simulation ---

    /**
     * Handles the checkout process (currently simulated).
     * Creates an order object, saves it to localStorage, shows an alert, and clears the cart.
     */
    const handleCheckout = () => {
        // Proceed only if the cart is not empty
        if (cartItems.length > 0) {
            // Simulate an asynchronous process (like API call)
            setTimeout(() => {
                // Generate a unique order ID and get the current date/time
                const orderId = `ORD-${Date.now()}`; 
                const orderDate = new Date().toISOString(); // ISO format is standard
                // Calculate total price as a number
                const orderTotal = calculateTotal(); 
                // Create a shallow copy of cart items for the order
                // Ensure CartItem structure is compatible with Order['items'] (ProductItem[])
                const orderItems: ProductItem[] = [...cartItems]; 

                // Create the new order object, conforming to the Order interface
                const newOrder: Order = {
                    orderId: orderId,
                    dateCreated: orderDate,
                    totalPrice: orderTotal, // Use the number value
                    items: orderItems,
                };

                // Save the newly created order
                saveOrderToLocalStorage(newOrder);

                // Log simulation details and show a confirmation alert
                console.log("Simulating Order Creation - Order:", newOrder);
                alert(t('Checkout successful! Thank you for your purchase!'));

                // Clear the cart in the Redux store after successful checkout
                dispatch(clearCart());
            }, 500); // Short delay for simulation

        } else {
            // Alert the user if they try to checkout with an empty cart
            alert(t('cartEmptyCheckoutAlert'));
        }
    };


    // --- Conditional Rendering: Empty Cart ---
    // If the cart has no items, display an informative message and a link to shop.
    if (cartItems.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="info" role="alert">
                    <Alert.Heading>{t('cartEmpty')}</Alert.Heading>
                    <p>
                        {t('cartEmptyMessage')} <Link to="/home">{t('continueShopping')}</Link>
                    </p>
                </Alert>
            </Container>
        );
    }

    // --- Main Rendering: Cart Table ---
    // Render the shopping cart contents in a table if items exist.
    const totalAmount = calculateTotal(); // Calculate total once for display
    return (
        <Container className="mt-5">
            <h2>{t('shoppingCart')}</h2>
            {/* Responsive table using React Bootstrap */}
            <Table striped bordered hover responsive>
                {/* Table Headers */}
                <thead>
                    <tr>
                        <th>{t('product')}</th>
                        <th>{t('price')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('total')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                {/* Table Body - Map over cart items */}
                <tbody>
                    {/* Each 'item' is typed as CartItem due to useSelector typing */}
                    {cartItems.map(item => ( 
                        // Use item ID as the unique key
                        <tr key={item.id}> 
                            {/* Product Column: Image and Title */}
                            <td>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                    thumbnail // Adds a small border/padding
                                    className="me-2" // Margin end for spacing
                                />
                                {item.title}
                            </td>
                            {/* Price Column */}
                            <td>${item.price.toFixed(2)}</td> {/* Format price */}
                            {/* Quantity Column */}
                            <td>{item.quantity}</td>
                            {/* Item Total Column */}
                            <td>${(item.price * item.quantity).toFixed(2)}</td> {/* Format item total */}
                            {/* Actions Column */}
                            <td>
                                {/* Remove Button */}
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    aria-label={`Remove ${item.title} from cart`} // Accessibility label
                                    onClick={() => handleRemoveFromCart(item.id)} // Pass item ID to handler
                                >
                                    {t('remove')}
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {/* Subtotal Row */}
                    <tr>
                        {/* Use colSpan to make cells span multiple columns */}
                        <td colSpan={3} className="text-end"><strong>{t('subtotal')}</strong></td> 
                        {/* Display formatted total */}
                        <td colSpan={2}><strong>${totalAmount.toFixed(2)}</strong></td> 
                    </tr>
                </tbody>
            </Table>

            {/* Action Buttons Row */}
            <Row className="mt-3 justify-content-between align-items-center">
                {/* Clear Cart Button */}
                <Col md="auto">
                    <Button 
                        variant="danger" 
                        onClick={handleClearCart} 
                        disabled={cartItems.length === 0} // Disable if cart is already empty
                        aria-label={t('clearCart')}
                    >
                        {t('clearCart')}
                    </Button>
                </Col>
                {/* Display Total Amount */}
                 <Col md="auto">
                    <h3>{t('total')}: ${totalAmount.toFixed(2)}</h3> {/* Display formatted total */}
                 </Col>
                {/* Checkout Button */}
                <Col md="auto">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={handleCheckout} 
                        disabled={cartItems.length === 0} // Disable if cart is empty
                        aria-label={t('checkout')}
                    >
                        {t('checkout')}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ShoppingCart;