import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function AlertModal({ show, title, message, variant = 'primary', onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className={variant === 'danger' ? 'bg-danger text-white' : variant === 'success' ? 'bg-success text-white' : ''}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="fs-5">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={variant} onClick={onHide}>確認</Button>
            </Modal.Footer>
        </Modal>
    );
}
