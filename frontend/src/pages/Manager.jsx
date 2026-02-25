import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Manager() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Container className="py-4">
            <h2 className="mb-4">店舖後台系統 - {user?.store_id === 1 ? '預設店舖' : `店舖 ${user?.store_id}`}</h2>

            <Row className="g-4">
                <Col md={4} sm={6}>
                    <Card className="h-100 text-center shadow-sm hover-card">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                            <Card.Title className="mb-3">銷售排行</Card.Title>
                            <Card.Text className="text-muted mb-4">
                                檢視各類商品的銷售數據與排名
                            </Card.Text>
                            <Button variant="outline-primary" onClick={() => navigate('/salerank')}>
                                進入銷售排行
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} sm={6}>
                    <Card className="h-100 text-center shadow-sm hover-card">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                            <Card.Title className="mb-3">月結報表</Card.Title>
                            <Card.Text className="text-muted mb-4">
                                統計當月營收、成本與獲利分析
                            </Card.Text>
                            <Button variant="outline-success" onClick={() => navigate('/monthlyreport')}>
                                查看月結報表
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} sm={6}>
                    <Card className="h-100 text-center shadow-sm hover-card">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                            <Card.Title className="mb-3">品項管理</Card.Title>
                            <Card.Text className="text-muted mb-4">
                                新增、修改或刪除系統內建的商品品項
                            </Card.Text>
                            <Button variant="outline-info" onClick={() => navigate('/itemdata')}>
                                管理品項
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} sm={6}>
                    <Card className="h-100 text-center shadow-sm hover-card">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                            <Card.Title className="mb-3">錯誤修正</Card.Title>
                            <Card.Text className="text-muted mb-4">
                                人工介入修正系統單據或帳務異常
                            </Card.Text>
                            <Button variant="outline-warning" onClick={() => navigate('/errorfix')}>
                                進入除錯與修正
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} sm={6}>
                    <Card className="h-100 text-center shadow-sm hover-card">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                            <Card.Title className="mb-3">打卡紀錄</Card.Title>
                            <Card.Text className="text-muted mb-4">
                                檢視員工上下班打卡時間與紀錄
                            </Card.Text>
                            <Button variant="outline-secondary" onClick={() => navigate('/record')}>
                                查看所有紀錄
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style type="text/css">
                {`
                .hover-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                    border-color: #0d6efd;
                }
                @media (max-width: 576px) {
                    .hover-card .card-body {
                        padding: 2rem 1rem !important;
                    }
                    .hover-card .card-title {
                        font-size: 1.25rem;
                    }
                }
                `}
            </style>
        </Container>
    );
}
