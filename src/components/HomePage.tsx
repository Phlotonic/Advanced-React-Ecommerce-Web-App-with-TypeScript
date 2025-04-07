import { useContext, useEffect } from 'react';
import type { RootState } from '../store';
import UserContext from '../context/UserContext';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ProductCatalog from './ProductCatalog';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function HomePage() {
    const { user, setUser } = useContext(UserContext);
    const cartCount = useSelector((state: RootState) => state.cart.totalItems); 
    const navigate = useNavigate(); // Get navigate function

    useEffect(() => {
        // **Primary check: Is user logged in?**
        if (!user.isLoggedIn) {
            navigate('/'); // Redirect to login if not logged in
            return; // Exit useEffect early
        }

        // Secondary: Restore session from local storage (fallback/initial load)
        const storedUser = localStorage.getItem('userSession');
        if (storedUser) {
            try {
                const userSession = JSON.parse(storedUser);
                // **Important:** Only update context if it's *not* already logged in.
                // The primary isLoggedIn check should take precedence.
                if (!user.isLoggedIn) { // Double check isLoggedIn again just to be safe
                    setUser(userSession);
                }
            } catch (error) {
                console.error("Error parsing stored user session:", error);
                localStorage.removeItem('userSession'); // Clear corrupted session
            }
        }
    }, [user.isLoggedIn, setUser, navigate]); // Add user.isLoggedIn and navigate as dependencies

    return (
        <Container className="mt-5">
            <h1>Welcome, {user.name}!</h1>
            <p>You are now {user.isLoggedIn ? 'logged in' : 'logged out'}.</p>
            <p>Your cart has {cartCount} item(s).</p>
            <NavLink to="/logout">Logout</NavLink> <br/>
            <NavLink to="/cart">Your cart ({cartCount} item(s))</NavLink> <br/>
            <NavLink to="/update-profile">Update Profile</NavLink> <br/>
            <Link to="/order-history">View Order History</Link>
            <ProductCatalog />
        </Container>
    );
}

export default HomePage;