// Removed unused import `useSelector` as it is not used in this component.
import React, { useState, useMemo, useCallback } from 'react';
import { useAppDispatch } from '../store';
import { fetchProducts } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Product, ProductRating } from '../types/Product';

/**
 * ProductCatalog Component
 * This component is responsible for displaying a list of products with features like sorting, filtering, and searching.
 * It uses React Query for data fetching and Redux for managing cart state.
 */
function ProductCatalog() {
    // --- Redux and Translation Setup ---
    const dispatch = useAppDispatch(); // Custom hook to dispatch Redux actions.
    const { t } = useTranslation(); // Translation hook for internationalization.

    // --- Data Fetching with React Query ---
    /**
     * Fetches the list of products using React Query and Redux.
     * The `fetchProducts` action is dispatched and its result is unwrapped for use.
     */
    const { 
        data: products, // The fetched products data.
        error, // Error object if the query fails.
        refetch: refetchProducts, // Function to manually refetch products.
        isPending: productsIsPending, // Boolean indicating if the query is loading.
        isError: productsIsError // Boolean indicating if the query encountered an error.
    } = useQuery<Product[]>({
        queryKey: ['products'], // Unique key for caching this query.
        queryFn: () => dispatch(fetchProducts()).unwrap(), // Fetch products using Redux action.
    });

    /**
     * Fetches the list of product categories directly from the API.
     * This query is independent of Redux and uses React Query's built-in functionality.
     */
    const { 
        data: categories, // The fetched categories data.
        error: categoriesError, // Error object for categories query.
        refetch: refetchCategories, // Function to manually refetch categories.
        isPending: categoriesIsPending, // Boolean indicating if the categories query is loading.
        isError: categoriesIsError // Boolean indicating if the categories query encountered an error.
    } = useQuery<string[]>({
        queryKey: ['categories'], // Unique key for caching this query.
        queryFn: async () => {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return (await response.json()) as string[];
        },
    });

    // --- Local State for UI Controls ---
    /**
     * State variables to manage user interactions:
     * - `sortOption`: Controls the sorting of products (e.g., by price or rating).
     * - `searchQuery`: Stores the user's search input.
     * - `selectedCategory`: Filters products by the selected category.
     */
    const [sortOption, setSortOption] = useState('default'); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [selectedCategory, setSelectedCategory] = useState('all'); 

    // --- Memoized Derived Data (Sorting & Filtering) ---
    /**
     * Sorts the products based on the selected sorting option.
     * Uses `useMemo` to optimize performance by avoiding unnecessary recalculations.
     */
    const sortedProducts = useMemo(() => {
        const productsArray = products ?? []; // Fallback to an empty array if products are undefined.
        switch (sortOption) {
            case 'price-low-to-high':
                return [...productsArray].sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return [...productsArray].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...productsArray].sort((a, b) => b.rating.rate - a.rating.rate); 
            default:
                return productsArray;
        }
    }, [products, sortOption]);

    /**
     * Filters the sorted products based on the selected category and search query.
     * Uses `useMemo` to optimize performance by avoiding unnecessary recalculations.
     */
    const filteredProducts = useMemo(() => {
        let categoryFilteredProducts = sortedProducts;
        if (selectedCategory !== 'all') { 
            categoryFilteredProducts = sortedProducts.filter(product => product.category === selectedCategory);
        }
        if (!searchQuery) {
            return categoryFilteredProducts; 
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return categoryFilteredProducts.filter(product => {
            const titleMatch = product.title?.toLowerCase().includes(lowerCaseQuery);
            const descriptionMatch = product.description?.toLowerCase().includes(lowerCaseQuery);
            return titleMatch || descriptionMatch;
        });
    }, [sortedProducts, searchQuery, selectedCategory]);

    // --- Action Dispatch Callback ---
    /**
     * Adds a product to the cart by dispatching the `addToCart` action.
     * Uses `useCallback` to memoize the function and avoid unnecessary re-renders.
     */
    const handleAddToCart = useCallback((product: Product) => {
        dispatch(addToCart(product)); 
    }, [dispatch]);

    // --- Loading and Error State Rendering ---
    /**
     * Displays a loading message if either the products or categories are being fetched.
     */
    if (productsIsPending || categoriesIsPending) { 
        return <div>{t('loadingProductsAndCategories')}...</div>;
    }

    /**
     * Displays an error message if either the products or categories queries fail.
     */
    if (productsIsError || categoriesIsError) {
        const prodMsg = productsIsError ? error?.message : null;
        const catMsg = categoriesIsError ? categoriesError?.message : null;
        const combinedMsg = [prodMsg, catMsg].filter(Boolean).join('; ') || t('errorLoadingData');
        return <div>Error: {combinedMsg}</div>; 
    }

    // --- Main Component Render (JSX) ---
    return (
        <div>
            {/* Search Input Control */}
            <Form.Group className="mb-3" controlId="search-product">
                <Form.Label>{t('searchProducts')}:</Form.Label>
                <Form.Control
                    type="search"
                    placeholder={t('searchProducts')}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} 
                />
            </Form.Group>

            {/* Category Filter Dropdown */}
            <Form.Group className="mb-3" controlId="category-select">
                <Form.Label>{t('filterByCategory')}:</Form.Label>
                <Form.Select
                    value={selectedCategory}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)} 
                >
                    <option value="all">{t('All Categories')}</option> 
                    {categories && categories.map((category) => ( 
                        <option key={category} value={category}>{category}</option> 
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Sort Options Dropdown */}
            <Form.Group className="mb-3" controlId="sort-select">
                <Form.Label>{t('sortBy')}:</Form.Label>
                <Form.Select
                    value={sortOption}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOption(e.target.value)} 
                >
                    <option value="default">{t('defaultSorting')}</option>
                    <option value="price-low-to-high">{t('priceLowToHigh')}</option>
                    <option value="price-high-to-low">{t('priceHighToLow')}</option>
                    {products && products[0]?.rating && <option value="rating">{t('rating')}</option>} 
                </Form.Select>
            </Form.Group>

            {/* Product Grid Layout */}
            <Row className="product-grid" style={{ maxWidth: '100%' }}>
                {filteredProducts.map((product) => ( 
                    <Col key={product.id} data-testid={`product-col-${product.id}`}>
                        <Card data-testid={`product-card-${product.id}`}>
                            <Card.Img
                                variant="top"
                                src={product.image}
                                alt={product.title}
                                style={{ height: '200px', objectFit: 'contain' }} 
                            />
                            <Card.Body>
                                <Card.Title data-testid={`product-title-${product.id}`}>{product.title}</Card.Title>
                                <Card.Text data-testid={`product-price-${product.id}`}>{t('price')}: ${product.price.toFixed(2)}</Card.Text>
                                {product.rating && <Card.Text data-testid={`product-rating-${product.id}`}>{t('rating')}: {product.rating.rate} ({product.rating.count} reviews)</Card.Text>}
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleAddToCart(product); 
                                    }}
                                    data-testid={`add-to-cart-button-${product.id}`}
                                >
                                    {t('addToCart')}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default ProductCatalog;