// src/pages/OrderConfirm.jsx
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import axios from '../api/axiosInstance';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirm() {
  const { user } = useUser();
  const { cartItems, total, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios.get(`/addresses/user/${user.id}`).then(res => setAddresses(res.data));
    }
  }, [user]);

  const handleOrder = async () => {
    if (!selectedAddr) return alert('お届け先を選択してください');
    if (!cartItems.length) return alert('カートが空です');
    const order = {
      userId: user.id,
      addressId: selectedAddr.id,
      totalAmount: total,
      items: JSON.stringify(cartItems.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      }))),
    };
    const res = await axios.post('/orders', order);
    clearCart();
    navigate(`/orders/${res.data.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">ご注文内容確認</h2>
      <div className="mb-4">
        <div className="font-semibold mb-2">お届け先を選択</div>
        {addresses.map(addr => (
          <div key={addr.id} className="mb-2">
            <label className="cursor-pointer">
              <input type="radio" name="address" value={addr.id} onChange={() => setSelectedAddr(addr)} checked={selectedAddr?.id === addr.id} />
              <span className="ml-2">{addr.recipient}（{addr.phone}） {addr.postalCode} {addr.province}{addr.city}{addr.detail}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="border rounded p-4 mb-4">
        <div className="font-semibold mb-2">ご注文商品</div>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between mb-1">
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} 円</span>
          </div>
        ))}
        <div className="text-right font-bold mt-2">合計: {total} 円</div>
      </div>
      <button className="bg-lime-600 text-white px-5 py-2 rounded" onClick={handleOrder}>注文を確定する</button>
    </div>
  );
}
