import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCatalog from '../ProductCatalog';
import ShoppingCart from '../ShoppingCart';
import { Provider } from 'react-redux';
import store from '../../store';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import '@testing-library/jest-dom'

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
}));

// Mock useQuery hook from react-query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('ProductCatalog and ShoppingCart Integration', () => {
    beforeEach(() => {
        useQuery.mockClear();
        useQuery.mockReturnValueOnce({ // Mock for products query
            data: [
                { id: 1, title: 'Integrated Product 1', price: 10, image: 'img1.jpg', category: 'category1' }
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ['category1'],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
    });

    it('adds product from ProductCatalog to ShoppingCart and updates cart display', async () => {
        render(
            <Provider store={store}>
                <ProductCatalog />
                <ShoppingCart />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Integrated Product 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /addToCart/i })); // Add product to cart

        await waitFor(() => {
            expect(screen.getByText('Shopping Cart')).toBeInTheDocument(); // Shopping cart heading should be present (integration implies both rendered)
            expect(screen.getByText('Integrated Product 1')).toBeInTheDocument(); // Product should appear in cart
            expect(screen.getByText('$10.00')).toBeInTheDocument(); // Check total price in cart
        });
    });
});