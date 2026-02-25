import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';
import DataTable from '../components/DataTable';

export default function ItemData() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: '',
        price: 0,
        cost: 0,
        stock: 0
    });

    useEffect(() => {
        if (user?.store_id) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/getProductList/${user.store_id}`);
            if (Array.isArray(res.data)) {
                setProducts(res.data);
            }
        } catch (err) {
            console.error("Failed to load products", err);
            showAlert('錯誤', '載入品項清單失敗', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (title, message, variant = 'primary') => {
        setAlert({ show: true, title, message, variant });
    };

    const handleShow = (product = null) => {
        if (product) {
            setEditingId(product.id);
            setFormData({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price || 0,
                cost: product.cost || 0,
                stock: product.stock || 0
            });
        } else {
            setEditingId(null);
            setFormData({ id: '', name: '', category: '', price: 0, cost: 0, stock: 0 });
        }
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                store_id: user?.store_id,
                ...formData
            };

            if (editingId) {
                await axios.post('/api/updateProductList', payload);
            } else {
                await axios.post('/api/insertProductList', payload);
            }

            handleClose();
            showAlert('成功', '品項儲存成功', 'success');
            fetchProducts(); // Refresh list
        } catch (err) {
            console.error(err);
            showAlert('錯誤', '儲存品項失敗', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除此品項嗎？')) {
            setLoading(true);
            try {
                await axios.post('/api/deleteProductList', { product_id: id });
                showAlert('成功', '品項刪除成功', 'success');
                fetchProducts();
            } catch (err) {
                console.error(err);
                showAlert('錯誤', '刪除品項失敗', 'danger');
            } finally {
                setLoading(false);
            }
        }
    };

    const tableHeaders = ['代碼 (ID)', '類別', '名稱', '售價', '成本', '庫存', '操作'];

    const renderRow = (p) => (
        <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.category}</td>
            <td>{p.name}</td>
            <td>${p.price}</td>
            <td>${p.cost}</td>
            <td>{p.stock}</td>
            <td>
                <div className="d-flex justify-content-center gap-2">
                    <Button variant="warning" size="sm" onClick={() => handleShow(p)}>
                        編輯
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                        刪除
                    </Button>
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

            <Card className="shadow border-0">
                <Card.Header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">品項建立與管理</h5>
                    <Button variant="light" size="sm" onClick={() => handleShow()}>+ 新增品項</Button>
                </Card.Header>
                <Card.Body>
                    <DataTable
                        headers={tableHeaders}
                        data={products}
                        renderRow={renderRow}
                        emptyMessage="目前沒有紀錄"
                    />
                </Card.Body>
            </Card>

            {/* Product Edit/Create Modal */}
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fs-5">{editingId ? '編輯品項' : '新增品項'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="p-4">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">商品代碼 (ID)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="id"
                                        value={formData.id}
                                        onChange={handleChange}
                                        disabled={!!editingId}
                                        required
                                        placeholder="例如: P001"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">類別</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">請選擇</option>
                                        <option value="檳榔">檳榔</option>
                                        <option value="飲料">飲料</option>
                                        <option value="香菸">香菸</option>
                                        <option value="其他">其他</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">商品名稱</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="輸入完整商品名稱"
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">售價</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">成本</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">初始庫存</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button variant="secondary" onClick={handleClose}>取消</Button>
                        <Button variant="primary" type="submit" className="px-4">
                            {editingId ? '更新品項' : '新增品項'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
