import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useUser } from './UserContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`/cart/${user.id}`).then(res => setCartItems(res.data));
    } else {
      setCartItems([]);
    }
  }, [user]);

  // 添加商品到购物车
  const addToCart = (productId, quantity = 1) => {
    if (!user) return alert('ログインしてください');
    axios.post('/cart/add', { userId: user.id, productId, quantity })
      .then(res => setCartItems(items => {
        // 前端同步合并
        const found = items.find(i => i.productId === productId);
        if (found) {
          return items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...items, res.data];
      }));
  };

  // 修改商品数量
  const updateQuantity = (productId, quantity) => {
    axios.put('/cart/update', { userId: user.id, productId, quantity })
      .then(() => setCartItems(items => items.map(i => i.productId === productId ? { ...i, quantity } : i)));
  };

  // 删除商品
  const removeFromCart = (productId) => {
    axios.delete('/cart/remove', { params: { userId: user.id, productId } })
      .then(() => setCartItems(items => items.filter(i => i.productId !== productId)));
  };

  // 清空购物车
  const clearCart = () => {
    axios.delete(`/cart/clear/${user.id}`).then(() => setCartItems([]));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
