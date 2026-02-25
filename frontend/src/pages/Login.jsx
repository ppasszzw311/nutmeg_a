import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [idnum, setIdnum] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/login', { idnum, password });

            if (response.data && response.data[0] && response.data[0].status === "success login") {
                const token = response.data[0].token;
                login(response.data[0], token);
                navigate('/home');
            } else {
                setError(response.data.status || response.data.ststus || '登入失敗');
            }
        } catch (err) {
            console.error(err);
            setError('伺服器錯誤，請稍後再試');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">系統登入</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>帳號</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="請輸入帳號"
                                value={idnum}
                                onChange={(e) => setIdnum(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>密碼</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="請輸入密碼"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            登入
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
