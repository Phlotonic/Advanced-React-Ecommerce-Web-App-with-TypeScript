import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingCart from '../ShoppingCart';
import { Provider } from 'react-redux';
import store from '../../app/store';
import { addToCart, removeFromCart, clearCart } from '../../features/cart/cartSlice';
import { useTranslation } from 'react-i18next';

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
}));

describe('ShoppingCart Component', () => {
    it('renders "Your cart is empty" message when cart is empty', () => {
        render(
            <Provider store={store}>
                <ShoppingCart />
            </Provider>
        );
        expect(screen.getByText('cartEmpty')).toBeInTheDocument();
    });

    it('renders cart items and total when items are in cart', () => {
        const initialState = {
            cart: {
                items: [
                    { id: 1, title: 'Test Product 1', price: 10, quantity: 2, image: 'img1.jpg' },
                    { id: 2, title: 'Test Product 2', price: 20, quantity: 1, image: 'img2.jpg' }
                ]
            }
        };
        const testStore = { ...store, getState: () => initialState }; // Mock store's getState

        render(
            <Provider store={testStore}>
                <ShoppingCart />
            </Provider>
        );

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('$40.00')).toBeInTheDocument(); // Total price (2*10 + 1*20)
    });

    it('dispatches removeFromCart action when "Remove" button is clicked', () => {
        const initialState = {
            cart: {
                items: [
                    { id: 1, title: 'Test Product', price: 10, quantity: 1, image: 'img.jpg' }
                ]
            }
        };
        const testStore = { ...store, getState: () => initialState, dispatch: jest.fn() }; // Mock dispatch

        render(
            <Provider store={testStore}>
                <ShoppingCart />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /remove/i })); // Click "Remove" button

        expect(testStore.dispatch).toHaveBeenCalledTimes(1);
        expect(testStore.dispatch).toHaveBeenCalledWith(removeFromCart(1));
    });

    it('dispatches clearCart action when "Clear Cart" button is clicked', () => {
        const initialState = {
            cart: {
                items: [
                    { id: 1, title: 'Test Product', price: 10, quantity: 1, image: 'img.jpg' }
                ]
            }
        };
        const testStore = { ...store, getState: () => initialState, dispatch: jest.fn() }; // Mock dispatch

        render(
            <Provider store={testStore}>
                <ShoppingCart />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /clearCart/i })); // Click "Clear Cart" button

        expect(testStore.dispatch).toHaveBeenCalledTimes(1);
        expect(testStore.dispatch).toHaveBeenCalledWith(clearCart());
    });
});