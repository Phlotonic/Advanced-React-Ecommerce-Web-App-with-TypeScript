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

    // --- Function Declarations MUST COME BEFORE USE ---
    const getCategoriesFromLocalStorage = () => {
        const storedCategories = localStorage.getItem('productCategories');
        return storedCategories ? JSON.parse(storedCategories) : [];
    };

    const saveCategoriesToLocalStorage = (categories) => {
        localStorage.setItem('productCategories', JSON.stringify(categories));
    };
    // --- End Function Declarations ---


    const { data: products, status, error, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: () => dispatch(fetchProducts()).unwrap(),
    });

    const cachedCategories = getCategoriesFromLocalStorage(); // Now getCategoriesFromLocalStorage is defined before use

    const { data: categories, status: categoriesStatus, error: categoriesError, refetch: refetchCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedCategories = await response.json();
            saveCategoriesToLocalStorage(fetchedCategories); // Now saveCategoriesToLocalStorage is defined before use
            return fetchedCategories;
        },
        initialData: cachedCategories,
        staleTime: Infinity,
    });


    const [sortOption, setSortOption] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');


    const sortedProducts = useMemo(() => {
        if (!products) return [];
        let productsArray = Array.isArray(products) ? products : Object.values(products);

        switch (sortOption) {
            case 'price-low-to-high':
                return [...productsArray].sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return [...productsArray].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...productsArray].sort((a, b) => b.rating.rate - b.rating.rate);
            default:
                return productsArray;
        }
    }, [products, sortOption]);

    const filteredProducts = useMemo(() => {
        if (!sortedProducts) return [];

        let categoryFilteredProducts = sortedProducts;

        if (selectedCategory && selectedCategory !== 'all') {
            categoryFilteredProducts = sortedProducts.filter(product => product.category === selectedCategory);
        }


        if (!searchQuery) {
            return categoryFilteredProducts;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();

        return categoryFilteredProducts.filter(product => {
            const titleMatch = product.title && product.title.toLowerCase().includes(lowerCaseQuery);
            const descriptionMatch = product.description && product.description.toLowerCase().includes(lowerCaseQuery);
            return titleMatch || descriptionMatch;
        });
    }, [sortedProducts, searchQuery, selectedCategory]);


    useEffect(() => {
        if (status === 'idle') {
            refetch();
        }
    }, [status, refetch]);

    useEffect(() => {
        if (categoriesStatus === 'idle' && !cachedCategories?.length) {
            refetchCategories();
        }
    }, [categoriesStatus, refetchCategories, cachedCategories]);


    const handleAddToCart = useCallback((product) => {
        dispatch(addToCart(product));
    }, [dispatch]);


    if (status === 'loading' || categoriesStatus === 'loading' && !cachedCategories?.length) {
        return <div>{t('loadingProductsAndCategories')}...</div>;
    }

    if (status === 'failed' || categoriesStatus === 'failed') {
        return <div>Error: {error || categoriesError}</div>;
    }


    return (
        <div>
            <Form.Group className="mb-3" controlId="search-product"> {/* controlId on Form.Group */}
                <Form.Label>{t('searchProducts')}:</Form.Label> {/* Removed htmlFor */}
                <Form.Control
                    type="search"
                    placeholder={t('searchProducts')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                /> {/* Removed id */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="category-select"> {/* controlId on Form.Group */}
                <Form.Label>{t('filterByCategory')}:</Form.Label> {/* Removed htmlFor */}
                <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                > {/* Removed id */}
                    <option value="all">{t('categories')}</option>
                    {categories && categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3" controlId="sort-select"> {/* controlId on Form.Group */}
                <Form.Label>{t('sortBy')}:</Form.Label> {/* Removed htmlFor */}
                <Form.Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                > {/* Removed id */}
                    <option value="default">{t('defaultSorting')}</option>
                    <option value="price-low-to-high">{t('priceLowToHigh')}</option>
                    <option value="price-high-to-low">{t('priceHighToLow')}</option>
                    {products && products[0] && products[0].rating && <option value="rating">{t('rating')}</option>}
                </Form.Select>
            </Form.Group>


            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredProducts.map((product) => (
                    <Col key={product.id}>
                        <Card>
                            <Card.Img
                                variant="top"
                                src={product.image}
                                alt={product.title}
                                style={{ height: '200px', objectFit: 'contain' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Text>{t('price')}: ${product.price}</Card.Text>
                                {product.rating && <Card.Text>{t('rating')}: {product.rating.rate} ({product.rating.count} reviews)</Card.Text>}
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
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