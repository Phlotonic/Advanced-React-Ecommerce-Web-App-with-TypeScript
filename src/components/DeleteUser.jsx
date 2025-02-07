import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

const DeleteUser = () => {
    const { user, setUser } = useContext(UserContext);
    const [showConfirmation, setShowConfirmation] = useState(false);
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
    }, [user.isLoggedIn, navigate]);

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        setShowErrorAlert(false);
        setErrorMessage('');

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Clear user session from context and local storage
        setUser({ name: '', isLoggedIn: false });
        localStorage.removeItem('userSession');

        setShowSuccessAlert(true);
        setIsLoading(false);
        setTimeout(() => {
            setShowSuccessAlert(false);
            navigate('/'); // Redirect to login page after successful deletion
        }, 3000);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false); // Hide confirmation message
    };

    const showDeleteConfirmation = () => {
        setShowConfirmation(true); // Show confirmation message
    };


    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={6}>
                    {showSuccessAlert && <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Account deleted successfully! Redirecting to login...
                    </Alert>}
                    {showErrorAlert && <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Account deletion failed: {errorMessage}
                    </Alert>}

                    {!showConfirmation ? (
                        <div className="text-center">
                            <h2>Delete Account</h2>
                            <p>Are you sure you want to delete your account?</p>
                            <Button variant="danger" onClick={showDeleteConfirmation}>Delete Account</Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2>Confirm Account Deletion</h2>
                            <Alert variant="warning">
                                <p><strong>Warning:</strong> Deleting your account is permanent and cannot be undone.</p>
                                <p>Are you absolutely sure you want to proceed?</p>
                            </Alert>
                            <Button variant="danger" onClick={handleDeleteAccount} disabled={isLoading}>
                                {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                            </Button>
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

export default DeleteUser;