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
}