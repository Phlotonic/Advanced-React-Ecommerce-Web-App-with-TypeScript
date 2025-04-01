import React, { useState } from 'react'; // Ensure React is imported
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Col, Form } from 'react-bootstrap';

// Interface defining the structure of a product
interface Product {
    title: string,
    price: number,
    description: string,
    image: string, // Expecting a URL string
    category: string,
}

// Async function to post the product data to the API
const postProduct = async (product: Product) => {
    const response = await fetch('https://fakestoreapi.com/products', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error('Failed to add new product'); // Basic error handling
    }
    return response.json(); // Returns the response (likely the newly added product with ID)
};

// The AddProduct component
const AddProduct: React.FC = () => { // Using React.FC for functional component typing
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Setup mutation hook from React Query
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: postProduct,
        onSuccess: (data) => {
            // On success, show alert, log, invalidate cache, and set timeout to hide alert
            setShowSuccessAlert(true);
            console.log('Product added:', data); // Log the returned data
            // Invalidate 'products' query cache to refetch list including the new product
            queryClient.invalidateQueries({ queryKey: ['products'] }); 
            setTimeout(() => setShowSuccessAlert(false), 5000); // Auto-hide alert
        },
        onError: (err) => {
            // Optional: Add specific error handling if needed
            console.error("Mutation failed:", err);
        }
    });

    // Handle form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default browser form submission
        const formData = new FormData(event.currentTarget); // Get form data

        // --- Safely get and type values from FormData ---

        // Strings: Check type is string, default to '' if null/File/undefined
        const titleValue = formData.get('title');
        const safeTitle = typeof titleValue === 'string' ? titleValue : '';

        const descriptionValue = formData.get('description');
        const safeDescription = typeof descriptionValue === 'string' ? descriptionValue : '';

        const imageValue = formData.get('image');
        const safeImage = typeof imageValue === 'string' ? imageValue : '';

        const categoryValue = formData.get('category');
        const safeCategory = typeof categoryValue === 'string' ? categoryValue : '';

        // Number: Check type is string, default to '0', then parse
        const priceValue = formData.get('price');
        const priceString = typeof priceValue === 'string' ? priceValue : '0';
        // Using parseFloat for price; consider adding isNaN(safePrice) check for more robustness
        const safePrice = parseFloat(priceString); 

        // --- Create the product object matching the Product interface ---
        const product: Product = {
            title: safeTitle,
            price: safePrice,
            description: safeDescription,
            image: safeImage,
            category: safeCategory,
        };

        // --- Trigger the mutation and reset the form ---
        mutate(product); // Call the mutation function with the typed product data
        event.currentTarget.reset(); // Reset form fields after submission
    };

    // --- Render the component JSX ---
    return (
        <div>
            {/* Display error alert if mutation failed */}
            {isError && <Alert variant="danger">An error occurred: {error instanceof Error ? error.message : 'Unknown error'}</Alert>}
            
            {/* Display success alert */}
            {showSuccessAlert && <Alert variant="success">Product added successfully!</Alert>}

            <Col md={{ span: 6, offset: 3 }}> {/* Using React Bootstrap layout */}
                <Form onSubmit={handleSubmit}>
                    {/* Form Fields using React Bootstrap components */}
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        {/* Note: type="number" still gives string from FormData, step attribute for decimals */}
                        <Form.Control type="number" placeholder="Enter price" name="price" step="0.01" required /> 
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" as="textarea" rows={3} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="url" placeholder="Enter image url" name="image" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" placeholder="Enter category" name="category" required />
                    </Form.Group>

                    {/* Submit Button - state reflects mutation status */}
                    <Button variant="primary" type="submit" disabled={isPending}>
                        {isPending ? 'Adding...' : 'Add Product'}
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default AddProduct;