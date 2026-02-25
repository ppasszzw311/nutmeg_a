import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function LoadingSpinner({ show, message = '載入中...' }) {
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 fs-5 fw-bold">{message}</p>
        </div>
    );
}
