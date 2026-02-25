import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function Checkin() {
    const { user } = useAuth();
    const [classType, setClassType] = useState('早班');
    const [status, setStatus] = useState('上班');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });

    const handleCheckin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                user_id: user?.user_id,
                user: user?.user_name,
                storeId: user?.store_id,
                class: classType,
                status: status
            };

            await axios.post('/api/clockInAndOut', payload);
            setAlert({
                show: true,
                title: '打卡成功',
                message: `${status}打卡成功！時間：${new Date().toLocaleString()}`,
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '打卡失敗，請稍後再試。', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <LoadingSpinner show={loading} />
            <AlertModal
                show={alert.show}
                title={alert.title}
                message={alert.message}
                variant={alert.variant}
                onHide={() => setAlert({ ...alert, show: false })}
            />

            <Card className="mx-auto shadow-sm border-0" style={{ maxWidth: '500px' }}>
                <Card.Header className="bg-dark text-white text-center py-3">
                    <h4 className="mb-0 fw-bold">員工上下班打卡</h4>
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                    <Form onSubmit={handleCheckin}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-muted small text-uppercase">員工姓名</Form.Label>
                            <Form.Control
                                type="text"
                                size="lg"
                                value={user?.user_name || ''}
                                readOnly
                                disabled
                                className="bg-light border-0"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-muted small text-uppercase">目前班別</Form.Label>
                            <Form.Select
                                size="lg"
                                value={classType}
                                onChange={e => setClassType(e.target.value)}
                                className="border-2"
                            >
                                <option value="早班">早班 (07:00 - 15:00)</option>
                                <option value="中班">中班 (15:00 - 23:00)</option>
                                <option value="晚班">晚班 (23:00 - 07:00)</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-5">
                            <Form.Label className="fw-bold text-muted small text-uppercase">打卡類型</Form.Label>
                            <div className="d-flex gap-3">
                                <Button
                                    variant={status === '上班' ? 'primary' : 'outline-primary'}
                                    className="flex-grow-1 py-3 fw-bold"
                                    onClick={() => setStatus('上班')}
                                >
                                    上班
                                </Button>
                                <Button
                                    variant={status === '下班' ? 'danger' : 'outline-danger'}
                                    className="flex-grow-1 py-3 fw-bold"
                                    onClick={() => setStatus('下班')}
                                >
                                    下班
                                </Button>
                            </div>
                        </Form.Group>

                        <Button variant="dark" type="submit" size="lg" className="w-100 py-3 fw-bold shadow">
                            確認打卡
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer className="bg-light text-center py-3 text-muted small">
                    打卡紀錄將自動傳送至後端系統進行審核。
                </Card.Footer>
            </Card>
        </Container>
    );
}
