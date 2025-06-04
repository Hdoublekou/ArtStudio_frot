import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useUser } from "../context/UserContext";

export default function ShopProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 编辑商品
  const handleEdit = (id) => {
    window.location.href = `/edit-product/${id}`;
  };

  // 删除商品
  const handleDelete = async (id) => {
    if (!window.confirm("确认删除该商品？")) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("删除失败");
    }
  };

  // 商品上传用
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProducts();
    // eslint-disable-next-line
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/products/shop/${user.id}`);
      setProducts(res.data);
    } catch (e) {
      alert("商品读取失败");
    }
    setLoading(false);
  };

  // 上传表单内容变化
  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // 上传商品
  const handleSubmit = async e => {
    e.preventDefault();
    setUploading(true);
    const data = new FormData();
    data.append('shopId', user.id);
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('stock', form.stock);
    if (form.image) data.append('image', form.image);

    try {
      await axios.post('/products/upload', data, { // 注意这里是 /upload
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ name: "", price: "", stock: "", image: null });
      fetchProducts();
    } catch (err) {
      alert('商品上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">商品管理</h2>

      {/* 上传表单 */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="商品名"
          value={form.name}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="价格"
          value={form.price}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="库存"
          value={form.stock}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" disabled={uploading} className="bg-lime-600 text-white px-4 py-1 rounded">
          {uploading ? "上传中..." : "商品上传"}
        </button>
      </form>

      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>图片</th>
              <th>商品名</th>
              <th>价格</th>
              <th>库存</th>
              <th>上架</th>
              <th>活动</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.imageUrl &&
                    <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `${process.env.REACT_APP_STATIC_BASE_URL || 'http://localhost:8080'}${p.imageUrl}`} alt="" className="w-12 h-12 object-cover" />}
                </td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  {/* 上架/下架按钮逻辑自己补充 */}
                </td>
                <td>
                  {/* 活动按钮逻辑自己补充 */}
                </td>
                <td>
                  <button onClick={() => handleEdit(p.id)} className="mr-2 text-blue-600 hover:underline">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
