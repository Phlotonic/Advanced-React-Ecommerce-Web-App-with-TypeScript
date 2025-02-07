import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const UpdateUser = () => {
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState(user.name); // Initialize with current username from context
    const [email, setEmail] = useState(''); // You might want to fetch and pre-fill email as well
    const [password, setPassword] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if user is not logged in
        if (!user.isLoggedIn) {
            navigate('/');
        }
        // In a real app, you might fetch the user's current profile data here and pre-fill the form
        // For FakeStoreAPI, the /users endpoint for PUT requests requires user ID, which we don't have readily available after login.
        // For simplicity in this project with FakeStoreAPI, we'll just allow updating username and password.
    }, [user.isLoggedIn, navigate]);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowErrorAlert(false);
        setErrorMessage('');

        // In a real application, you would likely fetch the user's ID from your session or context
        // and include it in the API request URL.
        // FakeStoreAPI's /users endpoint for PUT requests expects the user ID in the URL, e.g., /users/1.
        // However, we don't have user IDs readily available in this simplified login/session setup with FakeStoreAPI.
        // For this project, we will *simulate* user update as FakeStoreAPI is limited for PUT/PATCH on /users without knowing user ID.

        const updatedUserData = {
            username: username,
            password: password, // In a real app, handle password updates securely
            // Email could be added here if you decide to include it in the update process
        };

        // **SIMULATED UPDATE - In a real app, you would make a PUT or PATCH request to FakeStoreAPI /users/{userId} endpoint**
        // Since we are simulating, we will just update the user context and local storage with the new username.
        let updatedUser = { ...user, name: username }; // Assume username is the only updatable field for simulation

        // Simulate delay to show loading state (remove in real implementation)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

        setUser(updatedUser); // Update UserContext with new username
        localStorage.setItem('userSession', JSON.stringify(updatedUser)); // Update local storage
        setShowSuccessAlert(true);
        setIsLoading(false);
        setTimeout(() => {
            setShowSuccessAlert(false);
            navigate('/home'); // Redirect to home page after successful update
        }, 3000);


        /*  **REAL API CALL (Conceptual - Requires User ID which we don't readily have in this simplified FakeStoreAPI setup)**

        try {
            const response = await fetch(`https://fakestoreapi.com/users/{userId}`, { // Replace {userId} with actual user ID
                method: 'PUT', // Or PATCH
                headers: {
                    'Content-Type': 'application/json',
                    // Include authentication token if your API requires it for user updates
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Update failed: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('User updated successfully:', data);

            // Update UserContext and session storage with updated user data (if API returns updated user info)
            // setUser(data); // Assuming API returns updated user object
            // localStorage.setItem('userSession', JSON.stringify(data));

            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);

        } catch (error) {
            console.error('Update error:', error);
            setShowErrorAlert(true);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }

        */
    };

    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    {showSuccessAlert && <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Profile updated successfully!
                    </Alert>}
                    {showErrorAlert && <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Update failed: {errorMessage}
                    </Alert>}
                    <Form onSubmit={handleUpdateUser}>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="emailInput" className="mb-3">
                            <Form.Label>Email (Not currently updatable in this demo)</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter new email (not functional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled // Email update is not actually implemented with FakeStoreAPI simulation
                            />
                            <Form.Text className="text-muted">
                                Email updates are not functional in this demo due to FakeStoreAPI limitations.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="passwordInput" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                Leave password blank to keep current password.
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <NavLink to="/delete-user" variant="danger">Delete Account</NavLink>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateUser;