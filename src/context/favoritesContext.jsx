// src/context/favoritesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useUser } from "./UserContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useUser();
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 初始化获取收藏
  useEffect(() => {
    if (user?.id) {
      axios.get(`/favorites/user/${user.id}`)
        .then(res => setFavoriteIds(res.data.map(f => f.workId || f.productId)))
        .catch(() => setFavoriteIds([]));
    } else {
      setFavoriteIds([]);
    }
  }, [user]);

  // 添加收藏
  const addFavorite = async (productId) => {
    if (!user) return alert("先登录");
    await axios.post('/favorites', { userId: user.id, workId: productId });
    setFavoriteIds(ids => [...ids, productId]);
  };

  // 取消收藏
  const removeFavorite = async (productId) => {
    if (!user) return alert("先登录");
    await axios.delete('/favorites', { data: { userId: user.id, workId: productId } });
    setFavoriteIds(ids => ids.filter(id => id !== productId));
  };

  // 判断是否已收藏
  const isFavorite = (productId) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider value={{ addFavorite, removeFavorite, isFavorite, favoriteIds }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
