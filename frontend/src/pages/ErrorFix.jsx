import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function ErrorFix() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        if (user?.store_id) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/getSaleRecordAll');
            if (Array.isArray(res.data)) {
                // filter by store_id if needed locally
                setOrders(res.data.filter(o => o.store_id === user.store_id));
            }
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '載入訂單失敗', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (order) => {
        setCurrentOrder({ ...order });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除此訂單嗎？這將會同步影響帳務。')) {
            setLoading(true);
            try {
                await axios.post('/api/deleteSaleAmount', { id });
                setAlert({ show: true, title: '成功', message: '訂單已刪除', variant: 'success' });
                fetchOrders();
            } catch (err) {
                console.error(err);
                setAlert({ show: true, title: '錯誤', message: '刪除失敗', variant: 'danger' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await axios.post('/api/updateSaleAmount', currentOrder);
            setShowModal(false);
            setAlert({ show: true, title: '成功', message: '訂單已更新', variant: 'success' });
            fetchOrders();
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '更新失敗', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const tableHeaders = ['訂單編號', '員工 ID', '金額', '類別', '時間', '操作'];

    const renderRow = (order) => (
        <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.user_id}</td>
            <td className="fw-bold">${order.total_amount || order.amount}</td>
            <td>{order.category || '一般'}</td>
            <td>{order.created_at || '-'}</td>
            <td>
                <div className="d-flex justify-content-center gap-2">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(order)}>修正</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>移除</Button>
                </div>
            </td>
        </tr>
    );

    return (
        <Container className="py-4">
            <LoadingSpinner show={loading} />
            <AlertModal
                show={alert.show}
                title={alert.title}
                message={alert.message}
                variant={alert.variant}
                onHide={() => setAlert({ ...alert, show: false })}
            />

            <h2 className="mb-4 text-warning fw-bold">系統帳務錯誤修正</h2>

            <Card className="shadow-sm border-0 overflow-hidden">
                <Card.Header className="bg-warning text-dark py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">銷售單據列表 (店舖 {user?.store_id})</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <DataTable
                        headers={tableHeaders}
                        data={orders}
                        renderRow={renderRow}
                        emptyMessage="尚無銷售紀錄"
                    />
                </Card.Body>
            </Card>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>修正單據 #{currentOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentOrder && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>金額</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentOrder.total_amount || currentOrder.amount}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, total_amount: e.target.value, amount: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>時間 (YYYY-MM-DD HH:mm:ss)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentOrder.created_at || ''}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, created_at: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
                    <Button variant="primary" onClick={handleUpdate}>儲存修正</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
