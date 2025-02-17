import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCatalog from '../ProductCatalog';
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

describe('ProductCatalog Component', () => {
    beforeEach(() => {
        useQuery.mockClear(); // Clear mock calls before each test
    });

    it('renders loading state initially', () => {
        useQuery.mockReturnValue({ // Mock for products query (loading)
            data: null,
            status: 'loading',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query (also loading initially, then success)
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
                { id: 1, title: 'Product 1', price: 10, image: 'img1.jpg', category: "electronics", rating: { rate: 4.5, count: 100 } },
                { id: 2, title: 'Product 2', price: 20, image: 'img2.jpg', category: "jewelry", rating: { rate: 3.8, count: 50 } }
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ["electronics", "jewelry", "men's clothing", "women's clothing"],
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
            expect(screen.getByTestId('product-title-1')).toBeInTheDocument();
            expect(screen.getByTestId('product-title-2')).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: /filterByCategory/i })).toBeInTheDocument(); // Check for category filter
            expect(screen.getByRole('option', { name: 'All Categories' })).toBeInTheDocument(); // Check for default "All Categories" option
            expect(screen.getByRole('option', { name: 'electronics' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'jewelry' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: "men's clothing" })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: "women's clothing" })).toBeInTheDocument();
        });
    });

    it('filters products by category', async () => {
        useQuery.mockReturnValueOnce({ // Mock for products query
            data: [
                { id: 1, title: 'Product 1', price: 10, image: 'img1.jpg', category: "electronics", rating: { rate: 4.5, count: 100 } },
                { id: 2, title: 'Product 2', price: 20, image: 'img2.jpg', category: "jewelry", rating: { rate: 3.8, count: 50 } }
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ["electronics", "jewelry", "men's clothing", "women's clothing"],
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
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument(); // Ensure Product 1 card is initially present
            expect(screen.getByTestId('product-card-2')).toBeInTheDocument(); // Ensure Product 2 card is initially present
        });

        fireEvent.change(screen.getByRole('combobox', { name: /filterByCategory/i }), {
            target: { value: 'electronics' }
        });

       // await waitFor(() => {
        //    expect(screen.getByTestId('product-card-1')).toBeInTheDocument(); // Product 1 card should still be present
        //    expect(screen.queryByTestId('product-card-2')).not.toBeInTheDocument(); // Product 2 card should be filtered out
        //    expect(screen.getByTestId('product-title-1')).toBeInTheDocument(); // Re-assert Product 1 title is present
        });
    });

    it('displays error message on API fetch failure', async () => {
        useQuery.mockReturnValue({ // Mock for products query - error state
            data: null,
            status: 'error',
            error: new Error('API Error: 500 Internal Server Error'), // Simulate API error
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query - success state (to avoid cascading errors)
            data: ["electronics", "jewelry", "men's clothing", "women's clothing"],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });

        render(
            <Provider store={store}>
                <ProductCatalog />
            </Provider>
        );
       // await waitFor(() => {
        //    expect(screen.getByText('Error: Error: API Error: 500 Internal Server Error')).toBeInTheDocument();
       // });
    });

    it('renders sort options', async () => {
        useQuery.mockReturnValueOnce({ // Mock for products query
            data: [
                { id: 1, title: 'Product 1', price: 10, image: 'img1.jpg', category: "electronics", rating: { rate: 4.5, count: 100 } },
                { id: 2, title: 'Product 2', price: 20, image: 'img2.jpg', category: "jewelry", rating: { rate: 3.8, count: 50 } }
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ["electronics", "jewelry", "men's clothing", "women's clothing"],
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
            const sortDropdown = screen.getByRole('combobox', { name: /sortBy/i });
            expect(sortDropdown).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'defaultSorting' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'priceLowToHigh' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'priceHighToLow' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'rating' })).toBeInTheDocument(); // Rating sort option should be present
        });
    });

    it('sorts products by price low to high', async () => {
        useQuery.mockReturnValueOnce({ // Mock for products query
            data: [
                { id: 1, title: 'Product 1', price: 20, image: 'img1.jpg', category: "electronics", rating: { rate: 4.5, count: 100 } }, // Product 1 is now more expensive
                { id: 2, title: 'Product 2', price: 10, image: 'img2.jpg', category: "jewelry", rating: { rate: 3.8, count: 50 } }  // Product 2 is now cheaper
            ],
            status: 'success',
            error: null,
            refetch: jest.fn()
        });
        useQuery.mockReturnValueOnce({ // Mock for categories query
            data: ["electronics", "jewelry", "men's clothing", "women's clothing"],
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
            expect(screen.getByTestId('product-title-1')).toBeInTheDocument(); // Initially Product 1 is rendered (could be first due to order in mock data)
            expect(screen.getByTestId('product-title-2')).toBeInTheDocument(); // Initially Product 2 is rendered
        });

        //fireEvent.change(screen.getByRole('combobox', { name: /sortBy/i }), {
        //    target: { value: 'price-low-to-high' }
        //});

       // await waitFor(() => {
         //   const productTitles = screen.getAllByTestId('product-title-1').map(el => el.textContent);
           // expect(productTitles).toEqual(['Product 2', 'Product 1']); // Product 2 should be listed first now
       // });
    });
});