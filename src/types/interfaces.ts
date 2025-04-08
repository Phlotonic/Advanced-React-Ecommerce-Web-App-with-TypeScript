// --- Type Definitions ---

// Defines the structure for the nested 'rating' object within a Product
interface ProductRating {
    rate: number;
    count: number;
}

// Defines the structure for a single Product object based on fakestoreapi data
// Used for type safety throughout the app.
interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: ProductRating; // Uses the nested ProductRating interface
}

