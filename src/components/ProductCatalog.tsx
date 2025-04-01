import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function ProductCatalog() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // --- Data Fetching with react-query ---
    // Fetch products using redux thunk (productsSlice)
    const { data: products, status, error, refetch: refetchProducts } = useQuery({
        queryKey: ['products'],
        queryFn: () => dispatch(fetchProducts()).unwrap(), // Dispatch redux thunk to fetch products
    });

    // Fetch categories directly from fakestoreapi
    const { data: categories, status: categoriesStatus, error: categoriesError, refetch: refetchCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedCategories = await response.json();
            return fetchedCategories;
        },
    });

    // --- Local State for UI controls ---
    const [sortOption, setSortOption] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'all' categories


    // --- Memoized product lists for sorting and filtering ---
    // Sort products based on sortOption
    const sortedProducts = useMemo(() => {
        if (!products) return [];
        // Ensure products is an array before sorting
        const productsArray = Array.isArray(products) ? products : Object.values(products);

        switch (sortOption) {
            case 'price-low-to-high':
                return [...productsArray].sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return [...productsArray].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...productsArray].sort((a, b) => b.rating.rate - a.rating.rate); // Corrected sort order
            default:
                return productsArray;
        }
    }, [products, sortOption]);

    // Filter products based on searchQuery and selectedCategory
    const filteredProducts = useMemo(() => {
        if (!sortedProducts) return [];

        // Category filtering
        let categoryFilteredProducts = sortedProducts;
        if (selectedCategory !== 'all') { // Filter only if a category is selected (not 'all')
            categoryFilteredProducts = sortedProducts.filter(product => product.category === selectedCategory);
        }

        // Search query filtering
        if (!searchQuery) {
            return categoryFilteredProducts; // Return category-filtered products if no search query
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        return categoryFilteredProducts.filter(product => {
            const titleMatch = product.title && product.title.toLowerCase().includes(lowerCaseQuery);
            const descriptionMatch = product.description && product.description.toLowerCase().includes(lowerCaseQuery);
            return titleMatch || descriptionMatch;
        });
    }, [sortedProducts, searchQuery, selectedCategory]);


    // --- useEffect hooks for data fetching ---
    // Fetch products when component mounts or when refetch is called manually
    useEffect(() => {
        if (status === 'idle') {
            refetchProducts(); // Use refetchProducts for products
        }
    }, [status, refetchProducts]); // Depend on refetchProducts


    // Fetch categories when component mounts or when refetchCategories is called manually
    useEffect(() => {
        if (categoriesStatus === 'idle') {
            refetchCategories(); // Use refetchCategories for categories
        }
    }, [categoriesStatus, refetchCategories]); // Depend on refetchCategories


    // --- useCallback for adding to cart ---
    const handleAddToCart = useCallback((product) => {
        dispatch(addToCart(product));
    }, [dispatch]);


    // --- Loading and Error states ---
    if (status === 'loading' || categoriesStatus === 'loading') {
        return <div>{t('loadingProductsAndCategories')}...</div>;
    }

    if (status === 'failed' || categoriesStatus === 'failed') {
        return <div>Error: {error?.message || categoriesError?.message || t('errorLoadingData')}</div>; // Display error messages
    }


    return (
        <div>
            {/* Search Input */}
            <Form.Group className="mb-3" controlId="search-product">
                <Form.Label>{t('searchProducts')}:</Form.Label>
                <Form.Control
                    type="search"
                    placeholder={t('searchProducts')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form.Group>

            {/* Category Filter Dropdown */}
            <Form.Group className="mb-3" controlId="category-select">
                <Form.Label>{t('filterByCategory')}:</Form.Label>
                <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="default">{t('defaultSorting')}</option>
                    <option value="price-low-to-high">{t('priceLowToHigh')}</option>
                    <option value="price-high-to-low">{t('priceHighToLow')}</option>
                    {products && products[0] && products[0].rating && <option value="rating">{t('rating')}</option>}
                </Form.Select>
            </Form.Group>

            {/* Product Grid */}
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
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
                                <Card.Title  data-testid={`product-title-${product.id}`}>{product.title}</Card.Title>
                                <Card.Text  data-testid={`product-price-${product.id}`}>{t('price')}: ${product.price}</Card.Text>
                                {product.rating && <Card.Text data-testid={`product-rating-${product.id}`}>{t('rating')}: {product.rating.rate} ({product.rating.count} reviews)</Card.Text>}
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    data-testid={`add-to-cart-button-${product.id}`} // Added data-testid for testing
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