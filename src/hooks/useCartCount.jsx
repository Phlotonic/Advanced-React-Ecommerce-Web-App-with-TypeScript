import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';

export const useCartCount = () => {
    const [cartCount, setCartCount] = useState(0);
    const { user } = useContext(UserContext);

    useEffect(() => {
        // Simulate fetching cart count from a database or local storage
        // For demonstration, we'll just increase the count by 1 every second
        const interval = setInterval(() => {
            setCartCount((currentCount) => currentCount + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [user]); //Depend on user to reset count when user changes

    return cartCount;
};