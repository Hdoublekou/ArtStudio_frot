// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';

export default function Products() {
  // 商品列表状态
  const [products, setProducts] = useState([]);
  // 购物车操作
  const { addToCart } = useCart();

  // 获取商品数据
  useEffect(() => {
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('画材商品の取得に失敗しました'));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">画材ストア</h2>
      <p className="text-center text-gray-600 mb-8">leafArtが選んだ安全・高品質な画材をオンラインで購入できます。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* 商品卡片 */}
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 flex flex-col">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="font-bold text-lg mb-2">{product.name}</div>
            <div className="text-gray-700 text-sm mb-2">{product.description}</div>
            <div className="text-lime-600 font-bold text-xl mb-4">{product.price}円</div>
            <button
              onClick={() => addToCart(product.id, 1)}
              className="mt-auto bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 transition"
            >
              カートに追加
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
