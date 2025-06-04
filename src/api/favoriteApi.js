// src/api/favoriteApi.js
import axios from './axiosInstance';

// 添加收藏
export const addFavorite = async (userId, workId) => {
  return axios.post('/favorites', { userId, workId });
};

// 取消收藏（最终写法！）
export const removeFavorite = async (userId, workId) => {
  // 路径参数方式，不要 params
  return axios.delete(`/favorites/delete/${userId}/${workId}`);
};

// 查询所有收藏
export const fetchFavorites = (userId) => {
  return axios.get(`/favorites/user/${userId}`);
};
