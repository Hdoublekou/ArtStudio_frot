import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useUser } from '../context/UserContext';
import { useFavorites } from '../context/favoritesContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // 加上这句

export default function Products() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const { user } = useUser();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleSearch = () => {
    axios
      .get(`/products/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => setProducts(res.data));
  };

  useEffect(() => {
    axios.get('/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">画材ストア</h2>
      <p className="text-center text-gray-600 mb-6">
        leafArtが選んだ安全・高品質な画材をオンラインで購入できます。
      </p>

      {/* 搜索栏 */}
      <div className="flex justify-center mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="商品名で検索"
          className="border rounded px-2 py-1"
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-lime-500 text-white px-3 py-1 rounded"
        >
          検索
        </button>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-64 rounded overflow-hidden shadow bg-white flex flex-col hover:shadow-xl transition duration-300"
            >
              {/* 整个图片和标题可点击 */}
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="font-bold text-lg cursor-pointer hover:underline mt-2">{product.name}</div>
              </Link>
              <div className="p-3 flex-1 flex flex-col">
                <div className="text-gray-500 text-sm mb-2">
                  {product.description}
                </div>
                <div className="text-lime-700 font-bold text-right">
                  {product.price} 円
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className={`flex-1 px-2 py-1 rounded ${isFavorite(product.id)
                      ? 'bg-red-200 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                      } transition`}
                    onClick={() =>
                      isFavorite(product.id)
                        ? removeFavorite(product.id)
                        : addFavorite(product.id)
                    }
                  >
                    {isFavorite(product.id) ? '♥ お気に入り済み' : '♡ お気に入り'}
                  </button>
                  <button
                    className="flex-1 px-2 py-1 rounded bg-lime-500 text-white hover:bg-lime-600 transition"
                    onClick={() => addToCart(product.id, 1)}
                  >
                    カートに追加
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
