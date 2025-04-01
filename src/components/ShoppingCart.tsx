import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../features/cart/cartSlice';
import { Container, Row, Col, Button, Table, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ShoppingCart() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            setTimeout(() => {
                const orderId = `ORD-${Date.now()}`;
                const orderDate = new Date().toISOString();
                const orderTotal = calculateTotal();
                const orderItems = [...cartItems];

                const newOrder = {
                    orderId: orderId,
                    dateCreated: orderDate,
                    totalPrice: orderTotal,
                    items: orderItems,
                };

                saveOrderToLocalStorage(newOrder);

                console.log("Simulating Order Creation - Order:", newOrder);
                alert(`${t('checkoutSuccessful')}! (Simulated). Order ID: ${orderId}. ${t('orderDetailsLoggedConsole')}.`);

                dispatch(clearCart());
            }, 500);

        } else {
            alert(t('cartEmptyCheckoutAlert'));
        }
    };

    const saveOrderToLocalStorage = (order) => {
        const existingOrders = getOrdersFromLocalStorage();
        localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, order]));
    };

    const getOrdersFromLocalStorage = () => {
        const orders = localStorage.getItem('orderHistory');
        return orders ? JSON.parse(orders) : [];
    };


    if (cartItems.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="info" role="alert">
                    <Alert.Heading>{t('cartEmpty')}</Alert.Heading>
                    <p>
                        {t('cartEmptyMessage')} <Link to="/home">{t('continueShopping')}</Link>
                    </p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2>{t('shoppingCart')}</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>{t('product')}</th>
                        <th>{t('price')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('total')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                    thumbnail
                                    className="me-2"
                                />
                                {item.title}
                            </td>
                            <td>${item.price}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <Button variant="danger" size="sm" aria-label={`Remove ${item.title} from cart`} onClick={() => handleRemoveFromCart(item.id)}>
                                    {t('remove')}
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3" className="text-end"><strong>{t('subtotal')}</strong></td>
                        <td colSpan="2"><strong>${calculateTotal()}</strong></td>
                    </tr>
                </tbody>
            </Table>

            <Row className="mt-3 justify-content-between">
                <Col md="auto">
                    <Button variant="danger" onClick={handleClearCart} disabled={cartItems.length === 0} aria-label={t('clearCart')}>
                        {t('clearCart')}
                    </Button>
                </Col>
                <Col md="auto">
                    <h3>{t('total')}: ${calculateTotal()}</h3>
                </Col>
                <Col md="auto">
                    <Button variant="primary" size="lg" onClick={handleCheckout} disabled={cartItems.length === 0} aria-label={t('checkout')}>
                        {t('checkout')}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ShoppingCart;