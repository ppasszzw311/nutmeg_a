import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <Container className="text-center py-5">
            <h1 className="display-1">404</h1>
            <h2 className="mb-4">頁面未找到</h2>
            <p className="lead mb-5">抱歉，您訪問的頁面不存在。</p>
            <Button variant="primary" onClick={() => navigate('/home')}>回到首頁</Button>
        </Container>
    );
}
