import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaClock,
    FaExchangeAlt,
    FaPrint,
    FaCartPlus,
    FaChartLine,
    FaCog
} from 'react-icons/fa';

export default function Home() {
    const modules = [
        {
            title: '上下班打卡',
            desc: '記錄員工出勤時間與狀態',
            icon: <FaClock />,
            link: '/checkin',
            color: 'primary'
        },
        {
            title: '交班作業',
            desc: '班次銷售額清點與異常回報',
            icon: <FaExchangeAlt />,
            link: '/workshift',
            color: 'success'
        },
        {
            title: '列印標籤 & 銷售',
            desc: '標籤列印與商品過帳處理',
            icon: <FaPrint />,
            link: '/printAndSale',
            color: 'info'
        },
        {
            title: '進貨管理',
            desc: '商品進貨錄入與庫存校準',
            icon: <FaCartPlus />,
            link: '/purchase',
            color: 'warning'
        },
        {
            title: '銷售統計排行',
            desc: '即時查詢銷售業績與熱門商品',
            icon: <FaChartLine />,
            link: '/saleRank',
            color: 'danger'
        },
        {
            title: '後台系統管理',
            desc: '商品、人員、報表與帳務修正',
            icon: <FaCog />,
            link: '/manager',
            color: 'dark'
        }
    ];

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-dark">檳榔攤智慧管理系統</h1>
                <p className="lead text-muted">Nutmeg Management System v2.0 - Powered by React</p>
            </div>

            <Row className="g-4">
                {modules.map((m, idx) => (
                    <Col key={idx} lg={4} md={6}>
                        <Card as={Link} to={m.link} className="h-100 shadow-sm hover-card text-decoration-none border-0 overflow-hidden">
                            <div className={`bg-${m.color} bg-gradient p-3 text-white text-center d-flex align-items-center justify-content-center`} style={{ height: '80px', fontSize: '2rem' }}>
                                {m.icon}
                            </div>
                            <Card.Body className="p-4">
                                <Card.Title className="fw-bold text-dark h4 mb-2">{m.title}</Card.Title>
                                <Card.Text className="text-muted mb-3">
                                    {m.desc}
                                </Card.Text>
                                <div className={`text-${m.color} fw-bold d-flex align-items-center`}>
                                    進入模組 <span className="ms-2">→</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <footer className="text-center mt-5 pt-5 text-muted small">
                © 2026 Antigravity Systems. All rights reserved.
            </footer>
        </Container>
    );
}
