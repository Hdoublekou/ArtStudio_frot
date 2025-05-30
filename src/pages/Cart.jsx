// src/pages/Cart.jsx
import { useCart } from '../context/CartContext';

export default function Cart() {
  // 购物车操作
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  // 合计金额
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 购物车为空时
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
    </div>
  );
}
