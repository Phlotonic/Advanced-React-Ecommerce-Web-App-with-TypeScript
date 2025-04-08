import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
// Import UserContext and the UserState type (assuming it's exported from UserContext.tsx)
import UserContext, { UserState } from '../context/UserContext'; 
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

/**
 * UpdateUser Component
 * Provides a form for the logged-in user to update their profile information.
 * Currently allows updating the username and simulates password update.
 * NOTE: Due to FakeStoreAPI limitations (requiring user ID for PUT/PATCH /users), 
 * this component *simulates* the update by modifying local state (context, localStorage) 
 * instead of making a real API call. A conceptual API call is commented out below.
 */
const UpdateUser = () => {
    // --- State and Context ---
    
    // Get current user data and the setter function from context
    const { user, setUser } = useContext(UserContext); 
    // Initialize username input state with the current username from context
    const [username, setUsername] = useState(user.name); 
    // State for email input (currently disabled in this demo)
    const [email, setEmail] = useState(''); // Consider fetching/pre-filling user's email if available
    // State for the new password input
    const [password, setPassword] = useState(''); 
    // State for UI feedback alerts
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // State to track loading status during the simulated update
    const [isLoading, setIsLoading] = useState(false); 
    // Hook for programmatic navigation
    const navigate = useNavigate(); 

    // --- Effects ---

    // Effect to ensure only logged-in users can access this page.
    useEffect(() => {
        // If user is not marked as logged in in the context state...
        if (!user.isLoggedIn) {
            // Redirect to the login page ('/')
            navigate('/'); 
        }
        // Dependency array: only re-run if login status or navigate function changes.
        // In a full application, you might fetch current user profile data here 
        // on mount to pre-fill the form fields (e.g., email).
    }, [user.isLoggedIn, navigate]);

    // --- Event Handlers ---

    /**
     * Handles the submission of the update profile form.
     * Simulates an update process due to FakeStoreAPI limitations.
     * Updates the user's name in context and localStorage, then redirects.
     * @param e - The form submission event object.
     */
    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => { // Add type for event 'e'
        // Prevent default page reload on form submission
        e.preventDefault(); 
        // Set loading state, clear previous errors
        setIsLoading(true); 
        setShowErrorAlert(false);
        setErrorMessage('');

        // --- !!! SIMULATED UPDATE PROCESS !!! ---
        
        // In a real app, you'd gather necessary data (incl. password handling)
        // and likely call an API endpoint like PUT /api/users/profile or PATCH /api/users/{userId}.
        // This simulation only updates the username locally.
        console.warn("Simulating profile update...");

        // Create an object representing the potentially updated user state.
        // Only includes the 'name' from the form for this simulation.
        // Keeps other 'user' properties (like isLoggedIn) from the current context state.
        // Explicitly type using the imported UserState for clarity.
        const updatedUser: UserState = { 
            ...user,       // Spread existing user properties (like isLoggedIn)
            name: username // Update the name with the value from the form state
        };

        // Simulate network delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        // --- Update Local State (Context & localStorage) ---
        // Update the global user state in the context
        setUser(updatedUser); 
        // Update the persisted session in localStorage to match the context
        localStorage.setItem('userSession', JSON.stringify(updatedUser)); 

        // --- UI Feedback & Redirection ---
        // Show success message
        setShowSuccessAlert(true); 
        // Clear loading state
        setIsLoading(false); 
        // Set a timeout to hide the alert and redirect the user after 3 seconds
        setTimeout(() => {
            setShowSuccessAlert(false);
            navigate('/home'); // Redirect back to the home page
        }, 3000);

        /* * --- CONCEPTUAL REAL API CALL (Commented Out) ---
         * This block shows how a real API call might look if we had a suitable backend
         * and the user's ID. It's commented out because it's not functional here.
         
         const updatedUserData = { username: username, password: password }; // Data to send
         try {
             // const userId = user.id; // Need user ID from context/session
             const response = await fetch(`https://fakestoreapi.com/users/{userId}`, { // Replace {userId}
                 method: 'PUT', 
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(updatedUserData),
             });
             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`Update failed: ${response.status} - ${JSON.stringify(errorData)}`);
             }
             const data = await response.json();
             console.log('User updated successfully via API:', data);
             // Update context/localStorage based on API response
             // setUser(mapApiResponseToUserState(data)); 
             // localStorage.setItem('userSession', JSON.stringify(mapApiResponseToUserState(data)));
             setShowSuccessAlert(true);
             setTimeout(() => setShowSuccessAlert(false), 3000);
         } catch (error) {
             console.error('Update error:', error);
             setShowErrorAlert(true);
             // Use instanceof check for type safety before accessing error.message
             setErrorMessage(error instanceof Error ? error.message : 'Unknown update error');
         } finally {
             setIsLoading(false);
         }
         */
    };

    // --- Component Rendering (JSX) ---
    return (
        <Container className="vh-100"> {/* Full viewport height */}
            <Row className="justify-content-center align-items-center h-100"> {/* Centering */}
                <Col md={5}> {/* Column width control */}
                    {/* Conditional Success Alert */}
                    {showSuccessAlert && <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Profile updated successfully!
                    </Alert>}
                    {/* Conditional Error Alert */}
                    {showErrorAlert && <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Update failed: {errorMessage}
                    </Alert>}
                    
                    {/* Update Form */}
                    <Form onSubmit={handleUpdateUser}>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        
                        {/* Username Input */}
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new username"
                                value={username} // Controlled input
                                // Add type annotation for event 'e'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} 
                                required // Mark field as required
                            />
                        </Form.Group>

                        {/* Email Input (Disabled Demo) */}
                        <Form.Group controlId="emailInput" className="mb-3">
                            <Form.Label>Email (Not currently updatable in this demo)</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter new email (not functional)"
                                value={email}
                                // Add type annotation for event 'e'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                disabled // Field is disabled as update isn't implemented
                            />
                            <Form.Text className="text-muted">
                                Email updates are not functional in this demo due to FakeStoreAPI limitations.
                            </Form.Text>
                        </Form.Group>

                        {/* Password Input */}
                        <Form.Group controlId="passwordInput" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                // Add type annotation for event 'e'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                Leave password blank to keep current password (Note: update is simulated).
                            </Form.Text>
                        </Form.Group>
                        
                        {/* Submit Button */}
                        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                            {/* Change text and disable based on loading state */}
                            {isLoading ? 'Updating...' : 'Update Profile'} 
                        </Button>
                    </Form>
                    {/* Link to Delete Account Page */}
                    <div className="text-center mt-3">
                        {/* Use NavLink for styling active links, Link is also fine */}
                        <NavLink to="/delete-user" className="text-danger">Delete Account</NavLink> 
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

// Export the component
export default UpdateUser;