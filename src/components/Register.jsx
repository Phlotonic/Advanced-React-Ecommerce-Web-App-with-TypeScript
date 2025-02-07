import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowErrorAlert(false); // Hide any previous error alerts
        setErrorMessage('');

        const userData = {
            email: email,
            username: username,
            password: password,
        };

        try {
            const response = await fetch('https://fakestoreapi.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Registration failed: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('User registered successfully:', data);
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/'); // Redirect to login page after successful registration
            }, 3000); // Redirect after 3 seconds

        } catch (error) {
            console.error('Registration error:', error);
            setShowErrorAlert(true);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    {showSuccessAlert && <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Registration successful! Redirecting to login...
                    </Alert>}
                    {showErrorAlert && <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Registration failed: {errorMessage}
                    </Alert>}
                    <Form onSubmit={handleRegister}>
                        <h2 className="text-center mb-4">Register</h2>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="emailInput" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="passwordInput" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                        <p className="mt-3 text-center">
                            Already have an account? <a href="/">Login</a>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;