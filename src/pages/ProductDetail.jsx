import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import OrderDemo from "./OrderDemo"; // 根据你的实际路径调整

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <div>加载中...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <img src={product.imageUrl} className="w-full h-72 object-cover rounded mb-4" alt={product.name} />
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <div className="text-indigo-700 text-lg font-bold mt-2">{product.price} 円</div>

      {/* 只有数据完整时才显示下单区域 */}
      {product && product.price && (
        <OrderDemo workId={id} product={product} />
      )}
    </div>
  );
}
