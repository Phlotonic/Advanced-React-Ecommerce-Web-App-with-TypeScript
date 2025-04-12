import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext'; 
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// Defines the structure for user data used locally in this component.
interface User {
    name: string;
    isLoggedIn: boolean;
}

/**
 * Login Component
 * Handles user login by taking a username, updating the global user context,
 * saving the session to localStorage, and redirecting the user.
 * Also attempts to automatically log in user if a valid session exists in localStorage.
 * This version simulates login based on username only; no password or API call involved.
 */
function Login() {
    // --- State and Context ---

    // State to hold the value entered in the username input field
    const [username, setUsername] = useState<string>(''); 
    // Get the setUser function from the UserContext to update the global user state
    const { setUser } = useContext(UserContext); 
    // Get the navigate function from React Router for redirection
    const navigate = useNavigate(); 

    // --- Effects ---

    // This effect runs once when the component mounts (due to stable 'navigate' dependency) 
    // to check if a user session already exists in localStorage and automatically log the user in.
    useEffect(() => {
        // Debugging log
        console.log("Login.tsx useEffect: Checking for stored user session...");
        // Attempt to retrieve the user session data stored previously
        const storedUser = localStorage.getItem('userSession');
        // Debugging log
        console.log("Login.tsx useEffect: Retrieved storedUser from localStorage:", storedUser);
        
        // Check if any session data was found
        if (storedUser) {
            try {
                // Attempt to parse the stored JSON string back into an object.
                // Explicitly typing the parsed result to match the expected User structure.
                const userSession: User = JSON.parse(storedUser); 
                // Debugging log
                console.log("Login.tsx useEffect: Parsed userSession:", userSession);

                // Update the global user state via context with the retrieved session data
                setUser(userSession);
                // Debugging log
                console.log("Login.tsx useEffect: setUser called with:", userSession);

                // --- Redirection Logic (based on stored session) ---
                // Check if the restored user is 'admin' (case-insensitive)
                if (userSession.name.toLowerCase() === 'admin') {
                    // Navigate admin users to the Add Product page
                    navigate('/add-product'); 
                    // Debugging log
                    console.log("Login.tsx useEffect: Navigating to /add-product (admin)");
                } else {
                    // Navigate regular users to the Home page
                    navigate('/home'); 
                    // Debugging log
                    console.log("Login.tsx useEffect: Navigating to /home (non-admin)");
                }
            } catch (error) {
                // Handle errors during JSON parsing (e.g., corrupted data in localStorage)
                console.error("Login.tsx useEffect: Error parsing stored user session:", error);
                // Remove the potentially corrupted item from localStorage
                localStorage.removeItem('userSession'); 
            }
        } else {
            // Debugging log
            console.log("Login.tsx useEffect: No stored user session found.");
        }
        // Dependency array: 'navigate' is included as per React hook rules. 'setUser' is often
        // stable from context and usually omitted, making this effect run only once on mount.
    }, [navigate]); // Dependency array ensures this effect runs primarily on mount

    // --- Event Handlers ---

    // Handles the form submission event when the Login button is clicked.
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => { // Added type for event 'e'
        // Prevent the default form submission behavior which causes a page reload.
        e.preventDefault(); 
        // Debugging log
        console.log("Login.tsx handleLogin: Login button clicked");
        // Debugging log
        console.log("Login.tsx handleLogin: Username entered:", username);

        // --- !!! SIMULATED LOGIN - NO AUTHENTICATION !!! ---
        // In a real app, you would typically send the username and password 
        // to an API endpoint here for verification before proceeding.
        // This example assumes login is successful if a username is entered.

        // Create the user data object based on the entered username.
        // Assumes successful login and sets isLoggedIn to true. Matches 'User'/'UserState' type.
        const userData = { name: username, isLoggedIn: true };
        // Debugging log
        console.log("Login.tsx handleLogin: Creating userData:", userData);

        // Update the global user state via context
        setUser(userData);
        // Debugging log
        console.log("Login.tsx handleLogin: setUser called with:", userData);
        
        // Persist the user session data in localStorage for subsequent visits/reloads.
        localStorage.setItem('userSession', JSON.stringify(userData)); 
        // Debugging log
        console.log("Login.tsx handleLogin: Stored userSession in localStorage:", userData);

        // --- Redirection Logic (based on current login) ---
        // Redirect user based on username after successful "login".
        if (userData.name.toLowerCase() === 'admin') {
            // Navigate admin users to the Add Product page
            navigate('/add-product'); 
             // Debugging log
            console.log("Login.tsx handleLogin: Navigating to /add-product (admin)");
        } else {
            // Navigate regular users to the Home page
            navigate('/home'); 
            // Debugging log
            console.log("Login.tsx handleLogin: Navigating to /home (non-admin)");
        }
    };

    // --- Component Rendering (JSX) ---
    return (
        // Use React Bootstrap components for layout and styling
        // fluid=true makes the container span the full width
        // vh-100 makes the container span the full viewport height
        <Container fluid className="vh-100"> 
            <Row className="justify-content-center align-items-center h-100"> 
                <Col md={4}>
                    <div
                        className="p-5 rounded shadow"
                        style={{
                            background: 'linear-gradient(135deg, #1e3c72, #2a5298',
                            color: '#ffffff',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        }}
                    > 
                        {/* Form element using React Bootstrap, calls handleLogin on submit */}
                        <Form onSubmit={handleLogin}>
                            <h2 className="text-center mb-4">Login</h2> 
                            {/* Form group for the username input */}
                            <Form.Group controlId="usernameInput" className="mb-3">
                                <Form.Label>Username</Form.Label>
                                {/* Controlled input: value linked to state, onChange updates state */}
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    // Update username state on every change in the input field
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} // Added type for event 'e'
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;