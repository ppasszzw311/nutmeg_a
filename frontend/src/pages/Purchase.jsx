import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertModal from '../components/AlertModal';

export default function Purchase() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'primary' });

    const [formData, setFormData] = useState({
        category: '',
        product_id: '',
        inbound_count: 1
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

    const handlePurchase = async (e) => {
        e.preventDefault();
        setLoading(true);

        const selectedProduct = products.find(p => p.product_id.toString() === formData.product_id);
        if (!selectedProduct) {
            setAlert({ show: true, title: '錯誤', message: '請選擇商品', variant: 'danger' });
            setLoading(false);
            return;
        }

        try {
            const shift_id = `shift_${Date.now()}`;

            // 1. Record inbound log
            await axios.post('/api/inbound', {
                store_id: user?.store_id,
                store_name: user?.store_name || "Store",
                category: formData.category,
                product_name: selectedProduct.name,
                product_id: selectedProduct.product_id,
                inbound_count: parseInt(formData.inbound_count),
                inbound_unit: selectedProduct.inbound_unit || '單位',
                inbound_unit_count: selectedProduct.inbound_unit_count || 1,
                shift_id: shift_id
            });

            // 2. Update Stock
            await axios.post('/api/updateInBoundStock', {
                product_id: selectedProduct.product_id,
                product_name: selectedProduct.name,
                stock: parseInt(formData.inbound_count),
                inbound_unit_count: selectedProduct.inbound_unit_count || 1
            });

            setAlert({
                show: true,
                title: '成功',
                message: `成功進貨：${selectedProduct.name} x ${formData.inbound_count}`,
                variant: 'success'
            });
            setFormData(prev => ({ ...prev, inbound_count: 1 }));
        } catch (err) {
            console.error(err);
            setAlert({ show: true, title: '錯誤', message: '進貨失敗，請檢查系統紀錄。', variant: 'danger' });
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

            <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: '700px' }}>
                <Card.Header className="bg-primary text-white py-3">
                    <h5 className="mb-0">商品進貨作業</h5>
                </Card.Header>
                <Card.Body className="p-4">
                    <Form onSubmit={handlePurchase}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">1. 選擇商品類別</Form.Label>
                                    <Form.Select
                                        name="category"
                                        size="lg"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="border-primary"
                                    >
                                        <option value="">請選擇類別</option>
                                        {categories.map((c, idx) => (
                                            <option key={idx} value={c}>{c}</option>
                                        ))}
                                        {categories.length === 0 && (
                                            <>
                                                <option value="檳榔">檳榔</option>
                                                <option value="飲料">飲料</option>
                                                <option value="香菸">香菸</option>
                                            </>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">2. 選擇商品名稱</Form.Label>
                                    <Form.Select
                                        name="product_id"
                                        size="lg"
                                        value={formData.product_id}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.category}
                                        className={formData.category ? "border-primary" : ""}
                                    >
                                        <option value="">請選擇商品</option>
                                        {products.map(p => (
                                            <option key={p.product_id} value={p.product_id}>
                                                {p.name} (目前庫存: {p.stock})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">3. 輸入進貨數量 (大單位)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        size="lg"
                                        name="inbound_count"
                                        min="1"
                                        value={formData.inbound_count}
                                        onChange={handleChange}
                                        required
                                        className="border-primary"
                                    />
                                    <Form.Text className="text-muted">
                                        系統將自動根據商品定義的大單位換算為小單位庫存。
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit" size="lg" className="w-100 py-3 mt-2 shadow-sm fw-bold">
                            確認進貨送出
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
