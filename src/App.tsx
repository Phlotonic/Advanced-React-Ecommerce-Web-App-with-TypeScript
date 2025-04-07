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
  const [user, setUser] = useState({ name: '', isLoggedIn: false});

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/update-profile" element={<UpdateUser />} />
            <Route path="/delete-user" element={<DeleteUser />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;