// src/api/orderApi.js

import axios from './axiosInstance';

export const createOrder = (userId, workId, totalPrice) =>
  axios.post('/orders/create', { userId, workId, totalPrice });

export const payOrder = (orderId) =>
  axios.post(`/orders/pay/${orderId}`);

export const cancelOrder = (orderId) =>
  axios.post(`/orders/cancel/${orderId}`);

export const fetchUserOrders = (userId) =>
  axios.get(`/orders/user/${userId}`);
