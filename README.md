# Advanced E-Commerce App with React, TypeScript, and Vite

This project is a feature-rich e-commerce application built using React, TypeScript, and Vite. It demonstrates modern front-end development practices, including state management with Redux Toolkit, data fetching with React Query, and persistent storage with sessionStorage and localStorage.

## Features

### Product Catalog
- **Product Listing and Display**:
  - Fetches all products from the FakeStoreAPI using React Query.
  - Displays product details, including title, price, category, description, rating, and image.
  - Each product has an "Add to Cart" button for easy shopping.

- **Category Navigation**:
  - Provides a dynamic dropdown menu to filter products by category.
  - Fetches product categories dynamically from the FakeStoreAPI using React Query.
  - Updates the product listing based on the selected category.

### Shopping Cart
- **State Management**:
  - Utilizes Redux Toolkit for managing the shopping cart state.
  - Includes actions and reducers for adding, updating, and removing products from the cart.

- **Shopping Cart Component**:
  - Displays a list of products in the cart, including title, image, quantity, and price.
  - Allows users to remove items from the cart.
  - Dynamically calculates and displays the total number of items and the total price.

- **Session Storage**:
  - Persists shopping cart data in sessionStorage to maintain state across browser sessions.

- **Checkout Functionality**:
  - Simulates a checkout process by clearing the cart in Redux state and sessionStorage.
  - Provides visual feedback to users upon successful checkout.

### Order History
- **Order Tracking**:
  - Displays a list of past orders stored in localStorage.
  - Shows order details, including order ID, date, total items, and total price.

- **Error Handling**:
  - Handles errors gracefully when fetching or displaying order history.

### Modern Development Practices
- **React Query**:
  - Used for efficient data fetching and caching.

- **Redux Toolkit**:
  - Simplifies state management with slices and actions.

- **TypeScript**:
  - Ensures type safety and better developer experience.

- **Vite**:
  - Provides a fast development environment with hot module replacement (HMR).

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd advanced-e-commerce-react-typescript
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser at `http://localhost:5173`.

## Project Structure

- **src/components**: Contains React components for the app, including `ProductCatalog`, `ShoppingCart`, and `OrderHistory`.
- **src/features**: Includes Redux slices for managing state, such as `cartSlice`.
- **src/utils**: Utility functions, such as localStorage helpers.
- **src/api**: API service functions for interacting with the FakeStoreAPI.

## API Integration

This app uses the [FakeStoreAPI](https://fakestoreapi.com/) for fetching product and category data. Endpoints used include:
- `/products` for fetching all products.
- `/products/categories` for fetching product categories.
- `/products/category/:category` for fetching products by category.

## Future Enhancements

- Add user authentication and profile management.
- Implement a backend for order processing and user data storage.
- Enhance the UI/UX with animations and responsive design.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
