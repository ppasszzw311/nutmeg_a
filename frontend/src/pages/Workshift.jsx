import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function Workshift() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });

    const [formData, setFormData] = useState({
        operator: user?.user_name || '',
        successor: '',
        handover_amount: 0,
        shortage_amount: 0,
        total_sales: 0,
        betelnut_sales: 0,
        drinks_sales: 0,
        cigarette_sales: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name !== 'successor' && name !== 'operator' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const shift_id = `shift_${Date.now()}`;

            const payload = {
                store_id: user?.store_id,
                class: '晚班', // TODO: Fetch from dynamic shift state
                user_id: user?.user_id,
                user: user?.user_name,
                operator: formData.operator,
                successor: formData.successor,
                handover_amount: formData.handover_amount,
                shortage_amount: formData.shortage_amount,
                total_sales: formData.total_sales,
                betelnut_sales: formData.betelnut_sales,
                drinks_sales: formData.drinks_sales,
                cigarette_sales: formData.cigarette_sales,
                shift_id: shift_id
            };

            await axios.post('/api/inserWorkShift', payload);
            setAlert({ show: true, title: '成功', message: '交班紀錄已成功儲存！', variant: 'success' });

            // Reset form
            setFormData(prev => ({
                ...prev,
                successor: '',
                handover_amount: 0,
                shortage_amount: 0,
                total_sales: 0,
                betelnut_sales: 0,
                drinks_sales: 0,
                cigarette_sales: 0,
            }));
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '儲存交班紀錄時發生錯誤。', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

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

            <h2 className="mb-4 text-center fw-bold text-dark">店舖交班作業</h2>

            <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: '900px' }}>
                <Card.Body className="p-4 p-md-5">
                    <Form onSubmit={handleSubmit}>
                        <div className="section-title mb-4 pb-2 border-bottom fw-bold text-primary">基本資訊</div>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">值班人 (交班者)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="operator"
                                        size="lg"
                                        value={formData.operator}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">接班人</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="successor"
                                        size="lg"
                                        value={formData.successor}
                                        onChange={handleChange}
                                        placeholder="輸入接班員工姓名"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="section-title mb-4 pb-2 border-bottom fw-bold text-primary">帳務確認</div>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-success">交班金額 (現金)</Form.Label>
                                    <InputGroup size="lg">
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="handover_amount"
                                            value={formData.handover_amount}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-danger">短溢金額</Form.Label>
                                    <InputGroup size="lg">
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="shortage_amount"
                                            value={formData.shortage_amount}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                    <Form.Text className="text-muted">正數為溢領，負數為短缺。</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="section-title mb-4 pb-2 border-bottom fw-bold text-primary">銷售統計回報</div>
                        <Row className="mb-2">
                            <Col md={6} lg={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">總銷售額</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="total_sales"
                                        value={formData.total_sales}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} lg={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">檳榔銷售額</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="betelnut_sales"
                                        value={formData.betelnut_sales}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} lg={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">飲料銷售額</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="drinks_sales"
                                        value={formData.drinks_sales}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} lg={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">香菸銷售額</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cigarette_sales"
                                        value={formData.cigarette_sales}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid mt-5">
                            <Button variant="danger" type="submit" size="lg" className="py-3 fw-bold shadow">
                                確認交班並送出紀錄
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
