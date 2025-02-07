import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCatalog from '../ProductCatalog';
import { Provider } from 'react-redux';
import store from '../../app/store';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
}));

// Mock useQuery hook from react-query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('ProductCatalog Component', () => {
    beforeEach(() => {
        useQuery.mockClear(); // Clear mock calls before each test
    });

    it('renders loading state initially', () => {
        useQuery.mockReturnValue({
            data: null,
            status: 'loading',
            error: null,
            refetch: jest.fn()
        });

        render(
            <Provider store={store}>
                <ProductCatalog />
            </Provider>
        );
        expect(screen.getByText('loadingProductsAndCategories...')).toBeInTheDocument();
    });

    it('renders products and categories on successful data fetch', async () => {
        useQuery.mockReturnValueOnce({ // Mock for products query
            data: [
                { id: 1, title: 'Product 1', price: 10, image: 'img1.jpg', category: 'category1' },
                { id: 2, title: 'Product 2', price: 20, image: 'img2.jpg', category: 'category2' }
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ['category1', 'category2'],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });


        render(
            <Provider store={store}>
                <ProductCatalog />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: /filterByCategory/i })).toBeInTheDocument(); // Check for category filter
        });
    });

    it('filters products by category', async () => {
        useQuery.mockReturnValueOnce({ // Mock for products query
            data: [
                { id: 1, title: 'Product 1', price: 10, image: 'img1.jpg', category: 'category1' },
                { id: 2, title: 'Product 2', price: 20, image: 'img2.jpg', category: 'category2' }
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ['category1', 'category2'],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });

        render(
            <Provider store={store}>
                <ProductCatalog />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByRole('combobox', { name: /filterByCategory/i }), {
            target: { value: 'category1' }
        });

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.queryByText('Product 2')).not.toBeInTheDocument(); // Product 2 should be filtered out
        });
    });

    it('displays error message on API fetch failure', () => {
        useQuery.mockReturnValue({
            data: null,
            status: 'error',
            error: new Error('API Error: 500 Internal Server Error'), // Simulate API error
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query to avoid errors
            data: ['category1', 'category2'],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });

        render(
            <Provider store={store}>
                <ProductCatalog />
            </Provider>
        );
        expect(screen.getByText('Error: Error: API Error: 500 Internal Server Error')).toBeInTheDocument();
    });
});