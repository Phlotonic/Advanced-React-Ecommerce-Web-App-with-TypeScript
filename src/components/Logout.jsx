import { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user session from local storage
        localStorage.removeItem('userSession');

        // Reset user context
        setUser({ name: '', isLoggedIn: false });

        // Navigate back to the login page
        navigate('/');
    }, [navigate, setUser]);

    // Optionally, render a message or loader while the logout process completes
    return (
        <div>Logging out...</div>
    );
}

export default Logout;