import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function CheckinList() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });
    const [filters, setFilters] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (user?.store_id) {
            fetchRecords();
        }
    }, [user, filters]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            // This API might need adjustments depending on real backend implementation
            const res = await axios.get(`/api/checkin`);
            if (Array.isArray(res.data)) {
                // Filter by date if necessary on frontend if API doesn't support it
                setRecords(res.data);
            }
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '載入紀錄失敗', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const headers = ['員工 ID', '店舖 ID', '類型', '日期', '時間'];

    const renderRow = (record, index) => (
        <tr key={index}>
            <td>{record.user_id}</td>
            <td>{record.store_id}</td>
            <td>{record.type === 'in' ? <span className="text-success fw-bold">上班</span> : <span className="text-danger fw-bold">下班</span>}</td>
            <td>{record.created_at ? record.created_at.split(' ')[0] : '-'}</td>
            <td>{record.created_at ? record.created_at.split(' ')[1] : '-'}</td>
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

            <h2 className="mb-4">打卡紀錄查詢</h2>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="bg-light rounded">
                    <Form>
                        <Row className="gy-3 align-items-end">
                            <Col md={5} sm={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small text-uppercase">開始日期</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={5} sm={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small text-uppercase">結束日期</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2} sm={12}>
                                <Button variant="primary" className="w-100 py-2" onClick={fetchRecords}>
                                    搜尋
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
                <Card.Body className="p-0">
                    <DataTable
                        headers={headers}
                        data={records}
                        renderRow={renderRow}
                        emptyMessage="此日期範圍內尚無紀錄"
                    />
                </Card.Body>
            </Card>
        </Container>
    );
}
