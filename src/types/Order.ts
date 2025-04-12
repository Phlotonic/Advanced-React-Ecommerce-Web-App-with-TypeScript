// Define the Order type
export interface Order {
    id: string;
    orderId: string; // Unique identifier for the order
    date: string;
    dateCreated: string; // Timestamp or date string when the order was created
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalPrice: number;
}