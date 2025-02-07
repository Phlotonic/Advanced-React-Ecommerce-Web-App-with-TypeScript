import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function OrderHistory() {
    const { t } = useTranslation();

    const fetchOrderHistory = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));

        const orders = getOrdersFromLocalStorage();
        return orders;
    };

    const getOrdersFromLocalStorage = () => {
        const orders = localStorage.getItem('orderHistory');
        return orders ? JSON.parse(orders) : [];
    };

    const { data: orderHistory, status, error } = useQuery({
        queryKey: ['orderHistory'],
        queryFn: fetchOrderHistory,
        initialData: [],
    });

    if (status === 'loading') {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" aria-live="polite"> {/* Added ARIA attributes for screen reader */}
                    <span className="visually-hidden">{t('loadingOrderHistory')}</span>
                </Spinner>
                <p>{t('loadingOrderHistory')}</p>
            </Container>
        );
    }

    if (status === 'error') {
        return (
            <Container className="mt-5">
                <Alert variant="danger" role="alert"> {/* Added role="alert" for screen readers */}
                    <Alert.Heading>{t('errorLoadingData')}</Alert.Heading>
                    <p>
                        {t('tryAgainLater')}
                    </p>
                    <p>{t('orderHistoryError')}: {error?.message}</p>
                    <p>{t('productDataError')}: {error?.message}</p>
                </Alert>
            </Container>
        );
    }

    if (!orderHistory || orderHistory.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="info" role="alert"> {/* Added role="alert" for screen readers */}
                    <Alert.Heading>{t('noOrderHistory')}</Alert.Heading>
                    <p>
                        {t('noOrdersFound')}
                    </p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2>{t('orderHistoryTitle')}</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>{t('orderId')}</th>
                        <th>{t('date')}</th>
                        <th>{t('totalItems')}</th>
                        <th>{t('totalPrice')}</th>
                    </tr>
                </thead>
                <tbody>
                    {orderHistory.map(order => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                            <td>{order.items.reduce((sum, product) => sum + product.quantity, 0)}</td>
                            <td>
                                ${order.totalPrice}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <p className="mt-3">
                <Link to="/home">{t('backToHome')}</Link>
            </p>
        </Container>
    );
}

export default OrderHistory;