import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function PrintAndSale() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });

    const [formData, setFormData] = useState({
        category: '',
        product_id: '',
        package: 1, // unit packages
        piece: 0,
        broken: 0
    });

    useEffect(() => {
        if (user?.store_id) {
            fetchCategories();
        }
    }, [user]);

    useEffect(() => {
        if (formData.category) {
            fetchProductsByCategory();
        } else {
            setProducts([]);
        }
    }, [formData.category]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/getCategory/${user.store_id}`);
            if (Array.isArray(res.data)) {
                setCategories(res.data.map(item => item.category));
            }
        } catch (err) {
            console.error("Failed to load categories", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsByCategory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/getProductName/${user.store_id}/${formData.category}`);
            if (Array.isArray(res.data)) {
                setProducts(res.data);
            }
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSale = async (e) => {
        e.preventDefault();
        setLoading(true);

        const selectedProduct = products.find(p => p.product_id.toString() === formData.product_id);
        if (!selectedProduct) {
            setAlert({ show: true, title: '錯誤', message: '請選擇商品', variant: 'danger' });
            setLoading(false);
            return;
        }

        try {
            const total = (parseInt(formData.package) || 0) + (parseInt(formData.piece) || 0);

            const payload = {
                shift_id: `shift_${Date.now()}`,
                product_id: selectedProduct.product_id,
                product_name: selectedProduct.name,
                store_id: user?.store_id,
                class: '晚班',
                user_id: user?.user_id,
                user: user?.user_name,
                package: parseInt(formData.package),
                piece: parseInt(formData.piece),
                total: total,
                broken: parseInt(formData.broken)
            };

            await axios.post('/api/insertLabelPrint', payload);

            // Update stock downwards
            await axios.put('/api/updateStock', {
                product_id: selectedProduct.product_id,
                stock: total
            });

            setAlert({
                show: true,
                title: '成功',
                message: `成功銷售：${selectedProduct.name} - 總量: ${total}，標籤已準備列印。`,
                variant: 'success'
            });
            setFormData(prev => ({ ...prev, package: 1, piece: 0, broken: 0 }));

        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '銷售處理時發生錯誤。', variant: 'danger' });
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

            <h2 className="mb-4 text-center fw-bold">標籤列印 & 銷售過帳</h2>

            <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: '800px' }}>
                <Card.Header className="bg-success text-white py-3">
                    <h5 className="mb-0">銷售資訊錄入</h5>
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                    <Form onSubmit={handleSale}>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">商品類別</Form.Label>
                                    <Form.Select
                                        name="category"
                                        size="lg"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">請選擇類別</option>
                                        {categories.map((c, idx) => (
                                            <option key={idx} value={c}>{c}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">商品名稱</Form.Label>
                                    <Form.Select
                                        name="product_id"
                                        size="lg"
                                        value={formData.product_id}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.category}
                                    >
                                        <option value="">請選擇商品</option>
                                        {products.map(p => (
                                            <option key={p.product_id} value={p.product_id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="section-title mb-4 pb-2 border-bottom fw-bold text-success">數量設定 (銷售/標籤)</div>
                        <Row className="mb-4 g-4">
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">包數 (Package)</Form.Label>
                                    <InputGroup size="lg">
                                        <Form.Control
                                            type="number"
                                            name="package"
                                            min="0"
                                            value={formData.package}
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputGroup.Text>包</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">粒數 (Piece)</Form.Label>
                                    <InputGroup size="lg">
                                        <Form.Control
                                            type="number"
                                            name="piece"
                                            min="0"
                                            value={formData.piece}
                                            onChange={handleChange}
                                        />
                                        <InputGroup.Text>粒</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-danger">破損數 (Broken)</Form.Label>
                                    <InputGroup size="lg">
                                        <Form.Control
                                            type="number"
                                            name="broken"
                                            min="0"
                                            value={formData.broken}
                                            onChange={handleChange}
                                        />
                                        <InputGroup.Text>毀損</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid mt-5">
                            <Button variant="success" type="submit" size="lg" className="py-3 fw-bold shadow">
                                確認銷售並執行列印
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
