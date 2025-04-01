import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from './store';
import HomePage from './components/HomePage';
import ShoppingCart from './components/ShoppingCart';
import AddProduct from './components/AddProduct';
import Login from './components/Login'; 
import Register from './components/Register';
import Logout from './components/Logout';
import UpdateUser from './components/UpdateUser';
import DeleteUser from './components/DeleteUser';
import NotFound from './components/NotFound'; 
import UserContext from './context/UserContext'; 
import OrderHistory from './components/OrderHistory';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState({ name: '', isLoggedIn: false}); // Keep your user state

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}> {/* Keep UserContext.Provider if you are using UserContext */}
        <BrowserRouter> {/* Use BrowserRouter directly */}
          <Routes>
            <Route path="/" element={<Login />} /> {/* Login Route */}
            <Route path="/register" element={<Register />} /> {/* Register Route */}
            <Route path="/home" element={<HomePage />} /> {/* Home Route */}
            <Route path="/cart" element={<ShoppingCart />} /> {/* Cart Route */}
            <Route path="/add-product" element={<AddProduct />} /> {/* Add Product Route */}
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/logout" element={<Logout />} /> {/* Logout Route */}
            <Route path="/update-profile" element={<UpdateUser />} /> {/* Update Profile Route */}
            <Route path="/delete-user" element={<DeleteUser />} /> {/* Delete User Route - CORRECTED PATH */}
            <Route path="*" element={<NotFound />} /> {/* Not Found Route */}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider> {/* Keep UserContext.Provider if you are using UserContext */}
    </QueryClientProvider>
  );
}

export default App;