import React, { useState } from 'react'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Col, Form } from 'react-bootstrap';

// --- Type Definitions ---

// Defines the expected structure and data types for a Product object.
// This ensures type safety when creating products and interacting with the API.
interface Product {
    title: string,
    price: number,
    description: string,
    image: string, // Expecting a URL string from the form input
    category: string,
}

// --- API Interaction ---

// An asynchronous function responsible for sending the new product data to the API endpoint.
// It takes a 'product' object (matching the Product interface) as an argument.
const postProduct = async (product: Product) => {
    // Uses the fetch API to make a POST request to the fakestoreapi endpoint.
    const response = await fetch('https://fakestoreapi.com/products', {
        method: "POST", // Specifies the HTTP method
        headers: {
            // Indicates the body of the request contains JSON data
            'Content-Type': 'application/json', 
        },
        // Converts the JavaScript 'product' object into a JSON string for the request body
        body: JSON.stringify(product), 
    });
    // Basic error handling: checks if the HTTP response status code indicates success (e.g., 2xx).
    if (!response.ok) {
        // Throws an error if the request failed, stopping execution in the 'try' block of useMutation.
        throw new Error('Failed to add new product'); 
    }
    // Parses the JSON response body from the API (likely containing the newly created product with its ID)
    // and returns it. This data is passed to the 'onSuccess' callback in useMutation.
    return response.json(); 
};

// --- React Component ---

// Functional component responsible for rendering the "Add Product" form and handling its submission.
// Uses React.FC (Functional Component) for typing, though optional for basic components.
const AddProduct: React.FC = () => { 
    // Get the React Query client instance. Used later to invalidate queries (refresh data).
    const queryClient = useQueryClient();
    // State to control the visibility of the success confirmation alert message.
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // --- React Query Mutation Setup ---
    // Sets up the mutation using React Query's useMutation hook.
    // This hook simplifies handling the state (loading, error, success) of asynchronous operations like API calls.
    const { 
        mutate,        // The function to call to trigger the mutation (postProduct)
        isPending,     // Boolean flag, true while the mutation (API call) is in progress
        isError,       // Boolean flag, true if the mutation encountered an error
        error          // Stores the error object if isError is true
    } = useMutation({
        mutationFn: postProduct, // Specifies the async function that performs the mutation
        
        // Callback function executed if the mutationFn (postProduct) succeeds
        onSuccess: (data) => {
            // Show the success alert message
            setShowSuccessAlert(true); 
            // Log the data returned from the API upon success
            console.log('Product added:', data); 
            // CRITICAL: Invalidate the 'products' query cache. This tells React Query that
            // any component using useQuery(['products'], ...) should refetch its data, 
            // ensuring the product list UI updates to show the newly added product.
            queryClient.invalidateQueries({ queryKey: ['products'] }); 
            // Set a timer to automatically hide the success alert after 5 seconds (5000ms)
            setTimeout(() => setShowSuccessAlert(false), 5000); 
        },
        
        // Callback function executed if the mutationFn (postProduct) throws an error
        onError: (err) => {
            // Log the error to the console for debugging purposes.
            // More sophisticated error handling could be added here (e.g., showing specific error messages).
            console.error("Mutation failed:", err);
        }
    });

    // --- Form Submission Handler ---
    // Function called when the form is submitted.
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the default browser behavior of submitting the form, which would cause a page reload.
        event.preventDefault(); 
        // Create a FormData object from the submitted form element (event.currentTarget).
        // This provides an easy way to access form field values by their 'name' attribute.
        const formData = new FormData(event.currentTarget); 

        // --- Safely Extract and Type Form Values ---
        // FormData values can be string, File, or null. We need to convert them
        // safely to match the 'Product' interface types (string, number) before sending to the API.

        // Handle string fields: Check if the retrieved value is actually a string.
        // If it is, use it; otherwise (if it's null, undefined, or a File), default to an empty string ''.
        const titleValue = formData.get('title');
        const safeTitle = typeof titleValue === 'string' ? titleValue : '';

        const descriptionValue = formData.get('description');
        const safeDescription = typeof descriptionValue === 'string' ? descriptionValue : '';

        const imageValue = formData.get('image');
        const safeImage = typeof imageValue === 'string' ? imageValue : '';

        const categoryValue = formData.get('category');
        const safeCategory = typeof categoryValue === 'string' ? categoryValue : '';

        // Handle number field (price): 
        // First, ensure we have a string representation (defaulting to '0' if value is not a string).
        const priceValue = formData.get('price');
        const priceString = typeof priceValue === 'string' ? priceValue : '0';
        // Then, parse the string into a floating-point number.
        // Note: More robust handling might check if parseFloat returns NaN (Not a Number).
        const safePrice = parseFloat(priceString); 

        // --- Prepare Product Object for API ---
        // Create the 'product' object conforming to the 'Product' interface, using the safe values extracted above.
        const product: Product = {
            title: safeTitle,
            price: safePrice,
            description: safeDescription,
            image: safeImage,
            category: safeCategory,
        };

        // --- Trigger API Call and Reset Form ---
        // Call the 'mutate' function provided by useMutation, passing the prepared 'product' object.
        // This will execute the 'postProduct' function with this data.
        mutate(product); 
        // Reset the form fields to their initial state after successful submission initiation.
        event.currentTarget.reset(); 
    };

    // --- Component Rendering (JSX) ---
    return (
        <div>
            {/* Conditionally render an error Alert component if the mutation resulted in an error */}
            {isError && <Alert variant="danger">An error occurred: {error instanceof Error ? error.message : 'Unknown error'}</Alert>}
            
            {/* Conditionally render a success Alert component based on the showSuccessAlert state */}
            {showSuccessAlert && <Alert variant="success">Product added successfully!</Alert>}

            {/* Use React Bootstrap's Col for layout (centering the form) */}
            <Col md={{ span: 6, offset: 3 }}> 
                {/* The form element, using React Bootstrap's Form component. onSubmit calls our handler. */}
                <Form onSubmit={handleSubmit}>
                    {/* Form groups for structure and labeling */}
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        {/* Controlled input for title. 'name' attribute must match formData.get() key. */}
                        <Form.Control type="text" placeholder="Enter title" name="title" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        {/* Although type="number", FormData typically retrieves value as string. 'step' allows decimals. */}
                        <Form.Control type="number" placeholder="Enter price" name="price" step="0.01" required /> 
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        {/* Textarea input */}
                        <Form.Control name="description" as="textarea" rows={3} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image URL</Form.Label>
                        {/* URL type input */}
                        <Form.Control type="url" placeholder="Enter image url" name="image" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" placeholder="Enter category" name="category" required />
                    </Form.Group>

                    {/* The submit button */}
                    {/* 'disabled' prop is set to true when the mutation is pending (API call in progress) */}
                    <Button variant="primary" type="submit" disabled={isPending}>
                        {/* Button text changes based on the pending state */}
                        {isPending ? 'Adding...' : 'Add Product'}
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default AddProduct;