import React, { useContext, useEffect } from 'react';
import type { RootState } from '../store';
import UserContext from '../context/UserContext';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ProductCatalog from './ProductCatalog';
import { Link, NavLink, useNavigate } from 'react-router-dom';

/**
 * HomePage Component
 * Acts as the main dashboard or landing page for logged-in users.
 * Displays personalized greetings, navigation links, cart info, and the product catalog.
 * Also handles basic authentication checks and session restoration from localStorage.
 */
function HomePage() {
    // --- Hooks and State Access ---

    // Get the current user state object and the function to update it from UserContext
    const { user, setUser } = useContext(UserContext); 
    // Select the total number of items from the 'cart' slice of the Redux store.
    // Uses RootState to provide type safety for the state object.
    const cartCount = useSelector((state: RootState) => state.cart.totalItems); 
    // Get the navigate function from React Router for programmatic redirection
    const navigate = useNavigate(); 

    // --- Effects ---

    // This useEffect handles authentication checks and session restoration on component mount
    // and when relevant dependencies change.
    useEffect(() => {
        // --- Authentication Guard ---
        // Priority 1: Check if the user is currently marked as logged in via context state.
        if (!user.isLoggedIn) {
            // If not logged in, redirect the user immediately to the login page ('/').
            navigate('/'); 
            // Exit the effect early to prevent further checks or state updates.
            return; 
        }

        // --- Session Restoration (Fallback/Initial Load) ---
        // Priority 2: This part runs only if the user IS logged in according to the check above.
        // It attempts to restore user details from localStorage if they exist (e.g., from a previous session).
        // NOTE: The primary `if (!user.isLoggedIn)` check ensures this restoration logic doesn't
        // accidentally override an active session established through a fresh login.
        const storedUser = localStorage.getItem('userSession');
        // Check if session data exists in localStorage
        if (storedUser) {
            try {
                // Attempt to parse the JSON string from localStorage into a user session object.
                const userSession = JSON.parse(storedUser); 
                
                // **Important Check:** Although the outer 'if' already checked, this double-check ensures 
                // we only call setUser if the context still shows the user as logged out.
                // This prevents unnecessary re-renders or potential race conditions if the context 
                // state updated between the top check and here.
                if (!user.isLoggedIn) { 
                    // If context isn't yet reflecting a logged-in user (e.g., initial load), 
                    // update the context with the data retrieved from localStorage.
                    setUser(userSession); 
                }
            } catch (error) {
                // Handle potential errors during JSON parsing (e.g., corrupted data).
                console.error("Error parsing stored user session:", error);
                // Clear the corrupted item from localStorage to prevent repeated errors.
                localStorage.removeItem('userSession'); 
            }
        }
        // Dependencies for useEffect:
        // - user.isLoggedIn: Rerun the effect if the user's login status changes.
        // - setUser: Include if the identity of the setter function could change (though often stable from context).
        // - navigate: Include as it's used within the effect (React hook dependency rule).
    }, [user.isLoggedIn, setUser, navigate]); 

    // --- Component Rendering (JSX) ---
    // Render the main content for a logged-in user.
    return (
        <Container className="mt-5"> {/* Use Bootstrap Container for layout */}
            {/* Personalized welcome message using the user's name from context */}
            <h1>Welcome, {user.name}!</h1>
            {/* Display login status based on context state */}
            <p>You are now {user.isLoggedIn ? 'logged in' : 'logged out'}.</p>
            {/* Display the number of items in the cart, retrieved from Redux state */}
            <p>Your cart has {cartCount} item(s).</p>
            
            {/* Navigation Links using React Router's NavLink/Link */}
            <NavLink to="/logout">Logout</NavLink> <br/>
            <NavLink to="/cart">Your cart ({cartCount} item(s))</NavLink> <br/>
            <NavLink to="/update-profile">Update Profile</NavLink> <br/>
            <Link to="/order-history">View Order History</Link>

            {/* Embed the ProductCatalog component to display the list of products */}
            <ProductCatalog />
        </Container>
    );
}

export default HomePage;