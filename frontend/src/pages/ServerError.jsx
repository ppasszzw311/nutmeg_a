import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ServerError() {
    const navigate = useNavigate();
    return (
        <Container className="text-center py-5">
            <h1 className="display-1 text-danger">500</h1>
            <h2 className="mb-4">伺服器錯誤</h2>
            <p className="lead mb-5">抱歉，伺服器出現了一些問題，請稍後再試。</p>
            <Button variant="primary" onClick={() => navigate('/home')}>回到首頁</Button>
        </Container>
    );
}
