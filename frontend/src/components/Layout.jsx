import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/home">檳榔攤系統</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/home">首頁</Nav.Link>
                            <Nav.Link as={Link} to="/checkin">上下班打卡</Nav.Link>
                            <Nav.Link as={Link} to="/workshift">交班</Nav.Link>
                            <Nav.Link as={Link} to="/printAndSale">列印與銷售</Nav.Link>
                            <Nav.Link as={Link} to="/purchase">進貨</Nav.Link>

                        </Nav>
                        <Nav>
                            <Navbar.Text className="me-3">
                                Hello, {user?.user_name || 'User'}
                            </Navbar.Text>
                            <Button variant="outline-light" onClick={handleLogout}>登出</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid>
                <Outlet />
            </Container>
        </div>
    );
}
