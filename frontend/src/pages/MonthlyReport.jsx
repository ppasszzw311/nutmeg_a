import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function MonthlyReport() {
    const { user } = useAuth();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });
    const [formData, setFormData] = useState({
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0')
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated API call based on what was in the file: /api/getStoreCheckOut/:store_id/:year/:month
            const res = await axios.get(`/api/getStoreCheckOut/${user.store_id}/${formData.year}/${formData.month}`);
            if (Array.isArray(res.data)) {
                setReportData(res.data);
            } else {
                setReportData([]);
            }
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '查詢月結紀錄失敗', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const headers = ['項目', '金額'];

    const renderRow = (item, index) => (
        <tr key={index}>
            <td className="fw-bold">{item.item_name || '營收'}</td>
            <td className="text-success fw-bold">${item.amount?.toLocaleString()}</td>
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

            <h2 className="mb-4 text-dark fw-bold">店舖月結統計</h2>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body className="bg-light p-4 rounded text-center">
                    <Form onSubmit={handleSearch}>
                        <Row className="gy-3 justify-content-center align-items-end">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small text-uppercase">年份</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small text-uppercase">月份</Form.Label>
                                    <Form.Select
                                        name="month"
                                        value={formData.month}
                                        onChange={handleChange}
                                        required
                                    >
                                        {[...Array(12).keys()].map(m => {
                                            const val = (m + 1).toString().padStart(2, '0');
                                            return <option key={val} value={val}>{val}月</option>;
                                        })}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Button variant="primary" type="submit" className="w-100 py-2 shadow-sm fw-bold">
                                    產生報表
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
                <Card.Header className="bg-dark text-white py-3">
                    <h5 className="mb-0">{formData.year} 年 {formData.month} 月 銷售數據</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <DataTable
                        headers={headers}
                        data={reportData}
                        renderRow={renderRow}
                        emptyMessage="請點擊查詢按鈕產生報表"
                    />
                </Card.Body>
            </Card>
        </Container>
    );
}
