// Define the Order type
export interface Order {
    id: string;
    date: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    orderId?: string; // Optional property to resolve the issue in ShoppingCart.tsx
    dateCreated?: string; // Optional property to resolve the issue in ShoppingCart.tsx
    totalPrice?: number; // Optional property to resolve the issue in ShoppingCart.tsx
}