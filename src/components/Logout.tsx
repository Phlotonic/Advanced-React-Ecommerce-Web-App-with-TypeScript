import React, { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

/**
 * Logout Component
 * This component doesn't render significant UI but acts as a functional route
 * to handle the user logout process when it's rendered (e.g., by navigating to '/logout').
 * It clears user session data and redirects to the login page.
 */
function Logout() {
    // Get the setUser function from the UserContext to update the global user state
    const { setUser } = useContext(UserContext);
    // Get the navigate function from React Router to redirect the user
    const navigate = useNavigate();

    // useEffect hook performs the logout actions when the component mounts.
    useEffect(() => {
        // --- Logout Actions ---

        // 1. Clear the persisted user session from browser's local storage.
        // This prevents automatic login on future visits based on stored data.
        localStorage.removeItem('userSession');

        // 2. Reset the user state in the global context back to the default logged-out state.
        // This updates the application's UI to reflect the logged-out status immediately.
        setUser({ name: '', isLoggedIn: false });

        // 3. Navigate the user back to the login page (root route '/').
        navigate('/');

        // Dependencies: The effect depends on 'navigate' and 'setUser'. While these
        // typically have stable references, they are included as per React hook dependency rules.
        // The primary purpose is to run these logout actions once on component mount/render.
    }, [navigate, setUser]);

    // --- Component Rendering (JSX) ---
    // This component renders minimal UI, often just a loading/status message,
    // as its main purpose is the side effect (logout actions) in the useEffect hook,
    // which quickly leads to a redirect.
    return (
        <div>Logging out...</div>
    );
}

export default Logout;