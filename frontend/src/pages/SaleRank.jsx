import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function SaleRank() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });
    const [filters, setFilters] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (user?.store_id) {
            fetchRankData();
        }
    }, [user]);

    const fetchRankData = async () => {
        setLoading(true);
        try {
            // Updated to handle both vendor and store based ranks
            const vendorId = 1; // Default vendor
            const res = await axios.get(`/api/getAllSaleAmount/${vendorId}/${filters.startDate}/${filters.endDate}`);
            if (Array.isArray(res.data)) {
                setData(res.data);
            }
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '載入銷售數據失敗', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const headers = ['品項名稱', '銷售數量', '銷售金額', '佔比'];

    const renderRow = (item, index) => (
        <tr key={index}>
            <td className="fw-bold">{item.name || '檳榔'}</td>
            <td>{item.total_count || 0}</td>
            <td className="text-primary fw-bold">${item.total_amount?.toLocaleString() || 0}</td>
            <td>{item.percentage || '-'}%</td>
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

            <h2 className="mb-4 text-primary fw-bold">銷售排行分析</h2>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="bg-light rounded p-4">
                    <Form>
                        <Row className="gy-3 align-items-end">
                            <Col lg={4} md={6}>
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
                            <Col lg={4} md={6}>
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
                            <Col lg={4} md={12}>
                                <Button variant="primary" className="w-100 py-2 fw-bold shadow-sm" onClick={fetchRankData}>
                                    產生銷售統計排行
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Body className="p-0">
                    <DataTable
                        headers={headers}
                        data={data}
                        renderRow={renderRow}
                        emptyMessage="選擇日期範圍後點擊統計按鈕顯示數據"
                    />
                </Card.Body>
            </Card>
        </Container>
    );
}
