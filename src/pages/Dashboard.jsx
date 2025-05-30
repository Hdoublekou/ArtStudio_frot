// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


export default function Dashboard() {
  const { user, logout, login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`/${user.id}`, formData);
      login(res.data); // ✅ 更新 context 中的 user 信息
      alert('✅ 信息更新成功！');
    } catch (err) {
      console.error(err);
      alert('❌ 更新失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // ✅ 跳转回登录页
  };

  const handleDelete = async () => {
    const confirm = window.confirm('确认要注销此账户吗？此操作不可恢复！');
    if (!confirm) return;

    try {
      await axios.delete(`/${user.id}`);
      alert('✅ 账户已注销');
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('❌ 注销失败，请稍后再试');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">用户信息</h2>
      <div className="space-y-4">
        <div>
          <label>ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            disabled
            className="w-full border px-4 py-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label>邮箱</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label>密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? '更新中...' : '更新信息'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-rose-200 text-white py-2 rounded hover:bg-rose-300 transition"
        >
          退出登录
        </button>

        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          注销账户
        </button>
      </div>
    </div>
  );
}
