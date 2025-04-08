// Import necessary React hooks, routing, context, and UI components
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext'; // Context for accessing user state and setter
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'; // UI components

/**
 * DeleteUser Component
 * Provides a user interface for deleting the currently logged-in user's account.
 * Implements a two-step confirmation process for safety.
 * NOTE: Currently simulates the deletion process; requires a real API call in production.
 */
const DeleteUser = () => {
    // --- State and Context ---
    
    // Get user state and the function to update it from UserContext
    const { user, setUser } = useContext(UserContext); 
    // State to manage whether the final deletion confirmation dialog is shown
    const [showConfirmation, setShowConfirmation] = useState(false); 
    // State for showing success feedback to the user
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
    // State for showing error feedback to the user
    const [showErrorAlert, setShowErrorAlert] = useState(false); 
    // State to store the error message text to display
    const [errorMessage, setErrorMessage] = useState(''); 
    // State to track if the deletion process (API call simulation) is in progress
    const [isLoading, setIsLoading] = useState(false); 
    // Hook to programmatically navigate the user (e.g., redirecting after deletion)
    const navigate = useNavigate(); 

    // --- Effects ---

    // Effect hook to ensure only logged-in users can access this page
    useEffect(() => {
        // If the user is not logged in (based on context state)
        if (!user.isLoggedIn) {
            // Redirect them to the login page ('/')
            navigate('/'); 
        }
        // Dependencies: This effect runs when the component mounts and whenever
        // user.isLoggedIn or the navigate function changes (though navigate is usually stable).
    }, [user.isLoggedIn, navigate]);

    // --- Event Handlers ---

    // Handles the final confirmation and execution of the account deletion
    const handleDeleteAccount = async () => {
        // Indicate that the process is starting
        setIsLoading(true); 
        // Hide any previous error messages
        setShowErrorAlert(false); 
        setErrorMessage('');

        // --- !!! SIMULATED API CALL !!! ---
        // In a real application, you would replace this Promise/setTimeout 
        // with an actual API call (e.g., using fetch or axios) to your backend 
        // endpoint that handles user deletion, passing necessary authentication (e.g., user ID, token).
        // await api.deleteUser(user.id); 
        console.warn("Simulating account deletion API call.");
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        // You would also need proper try...catch error handling around the real API call
        // to catch failures, setErrorMessage, and setShowErrorAlert(true).

        // --- Local Logout and Cleanup ---
        // Assuming the simulated (or real) API call was successful:
        // 1. Update the global user state via context to log the user out locally
        setUser({ name: '', isLoggedIn: false }); 
        // 2. Remove the user session data from local storage to prevent auto-login
        localStorage.removeItem('userSession'); 

        // --- UI Feedback and Redirection ---
        // Show the success message
        setShowSuccessAlert(true); 
        // Indicate that the process is finished
        setIsLoading(false); 
        // Set a timer to redirect the user to the login page after 3 seconds
        setTimeout(() => {
            setShowSuccessAlert(false); // Hide alert before navigating
            navigate('/'); 
        }, 3000);
    };

    // Handles the click on the "Cancel" button in the confirmation step
    const handleCancelDelete = () => {
        // Simply hides the confirmation dialog, returning to the initial prompt
        setShowConfirmation(false); 
    };

    // Handles the click on the initial "Delete Account" button
    const showDeleteConfirmation = () => {
        // Shows the final confirmation dialog/step
        setShowConfirmation(true); 
    };

    // --- Component Rendering (JSX) ---
    return (
        // Use React Bootstrap components for layout and styling
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={6}> {/* Column for content */}
                    {/* Display success alert when appropriate */}
                    {showSuccessAlert && <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Account deleted successfully! Redirecting to login...
                    </Alert>}
                    {/* Display error alert when appropriate */}
                    {showErrorAlert && <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Account deletion failed: {errorMessage}
                    </Alert>}

                    {/* Conditional Rendering for Two-Step Confirmation */}
                    {/* If showConfirmation is false, show the initial prompt */}
                    {!showConfirmation ? (
                        <div className="text-center">
                            <h2>Delete Account</h2>
                            <p>Are you sure you want to delete your account?</p>
                            {/* Button to trigger showing the final confirmation step */}
                            <Button variant="danger" onClick={showDeleteConfirmation}>Delete Account</Button>
                        </div>
                    ) : (
                        /* If showConfirmation is true, show the final confirmation view */
                        <div className="text-center">
                            <h2>Confirm Account Deletion</h2>
                            {/* Display a strong warning about the irreversible action */}
                            <Alert variant="warning">
                                <p><strong>Warning:</strong> Deleting your account is permanent and cannot be undone.</p>
                                <p>Are you absolutely sure you want to proceed?</p>
                            </Alert>
                            {/* Final confirmation button, disabled while loading */}
                            <Button variant="danger" onClick={handleDeleteAccount} disabled={isLoading}>
                                {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                            </Button>
                            {/* Cancel button, also disabled while loading */}
                            <Button variant="secondary" className="ms-2" onClick={handleCancelDelete} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

// Export the component for use in routing/application structure
export default DeleteUser;