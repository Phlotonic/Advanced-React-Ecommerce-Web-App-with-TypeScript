import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

interface User {
    name: string;
    isLoggedIn: boolean;

}

function Login () {
    const [username, setUsername] = useState<string>('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Login.jsx useEffect: Checking for stored user session...");
        const storedUser = localStorage.getItem('userSession');
        console.log("Login.jsx useEffect: Retrieved storedUser from localStorage:", storedUser);
        if (storedUser) {
            try {
                const userSession: User = JSON.parse(storedUser);
                console.log("Login.jsx useEffect: Parsed userSession:", userSession);
                setUser(userSession);
                console.log("Login.jsx useEffect: setUser called with:", userSession);

                if (userSession.name.toLowerCase() === 'admin') {
                    navigate('/add-product');
                    console.log("Login.jsx useEffect: Navigating to /add-product (admin)");
                } else {
                    navigate('/home');
                    console.log("Login.jsx useEffect: Navigating to /home (non-admin)");
                }
            } catch (error) {
                console.error("Login.jsx useEffect: Error parsing stored user session:", error);
                localStorage.removeItem('userSession'); // Clear potentially corrupted data
            }
        } else {
            console.log("Login.jsx useEffect: No stored user session found.");
        }
    }, [navigate]); // Corrected dependency array: removed 'setUser'

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login.jsx handleLogin: Login button clicked");
        console.log("Login.jsx handleLogin: Username entered:", username);
        const userData = { name: username, isLoggedIn: true };
        console.log("Login.jsx handleLogin: Creating userData:", userData);
        setUser(userData);
        console.log("Login.jsx handleLogin: setUser called with:", userData);
        localStorage.setItem('userSession', JSON.stringify(userData)); // Save user session to local storage
        console.log("Login.jsx handleLogin: Stored userSession in localStorage:", userData);

        if (userData.name.toLowerCase() === 'admin') {
            navigate('/add-product');
            console.log("Login.jsx handleLogin: Navigating to /add-product (admin)");
        } else {
            navigate('/home');
            console.log("Login.jsx handleLogin: Navigating to /home (non-admin)");
        }
    };

    return (
        <Container fluid className="vh-100"> {/* Use 'fluid' and vh-100 for full viewport */}
            <Row className="justify-content-center align-items-center h-100"> {/* Centering row with full height */}
                <Col md={4}> {/* Adjust md value (e.g., 4, 5, 6) to control form width */}
                    <div className="p-5 rounded shadow" style={{ backgroundColor: '#f8f9fa' }}> {/* Optional: Styling for the form container */}
                        <Form onSubmit={handleLogin}>
                            <h2 className="text-center mb-4">Login</h2> {/* Optional: Login heading */}
                            <Form.Group controlId="usernameInput" className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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