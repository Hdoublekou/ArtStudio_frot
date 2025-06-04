// src/pages/Cart.jsx
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import axios from '../api/axiosInstance';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

const total = cartItems.reduce((sum, item) => {
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  return sum + price * quantity;
}, 0);

  // 下单&支付
  const handleCheckout = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (cartItems.length === 0) {
      alert('カートが空です');
      return;
    }

    setLoading(true);

    try {
      // 支持一次下多单，逐一调用下单API
// 下单
for (const item of cartItems) {
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  await axios.post('/orders/create', {
    userId: user.id,
    workId: item.productId,
    totalPrice: (price * quantity).toString()
  });
}
      alert('下单成功！');
      clearCart();
    } catch (e) {
      alert('下单失败');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        カートは空です。
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">ショッピングカート</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.productId} className="flex items-center border-b py-4">
            <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded mr-4" />
            <div className="flex-1">
              <div className="font-bold">{item.productName}</div>
              <div className="text-sm text-gray-500">{item.price}円</div>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={e => updateQuantity(item.productId, parseInt(e.target.value, 10))}
              className="w-16 border rounded px-2 py-1 text-center mr-4"
            />
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-500 px-2"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-6">
        <div className="font-bold text-xl">合計: {total}円</div>
        <button
          onClick={clearCart}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          カートを空にする
        </button>
      </div>
      {/* 新增支付按钮 */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "注文処理中..." : "注文確定・下单"}
        </button>
      </div>
    </div>
  );
}
