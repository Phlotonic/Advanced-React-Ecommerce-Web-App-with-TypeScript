import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCatalog from '../ProductCatalog';
import ShoppingCart from '../ShoppingCart';
import { Provider } from 'react-redux';
import store from '../../store';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';

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
        useQuery.mockImplementation((query) => {
            if (query.queryKey[0] === 'products') {
                return { // Mock for products query
                    data: [ 
                        { id: 1, title: 'Integrated Product 1', price: 10, image: 'img1.jpg', category: 'category1' }
                    ],
                    status: 'success',
                    error: null,
                    refetch: jest.fn()
                };
            } else if (query.queryKey[0] === 'categories') {
                return { // Mock for categories query
                    data: ['category1'],
                    status: 'success',
                    error: null,
                    refetch: jest.fn()
                };
            }
            return { data: undefined, status: 'loading', error: null }; // Default case
        });
    });

    it('adds product from ProductCatalog to ShoppingCart and updates cart display', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProductCatalog />
                    <ShoppingCart />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Integrated Product 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /addToCart/i })); // Add product to cart

        await waitFor(() => {
            expect(screen.getByText('shoppingCart')).toBeInTheDocument(); // Shopping cart heading should be present (integration implies both rendered)
            expect(screen.getAllByText('Integrated Product 1')[0]).toBeInTheDocument(); // Product should appear in cart
            expect(screen.getAllByText('$10.00')[0]).toBeInTheDocument(); // Check total price in cart
        });
    });
});