import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/users/login', formData);
    login(res.data); 
    alert('ログインに成功しました。');
    navigate('/');
  } catch (err) {
    console.error('ログイン失敗：', err.response?.data?.message || err.message);
    alert('ログインに失敗しました。メールアドレスまたはパスワードをご確認ください。');
  }
};

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-normal text-center text-indigo-600 mb-6">ログイン</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          ログイン
        </button>
      </form>
               {/* 注册引导链接 */}
               <p className="text-xs text-left text-gray-600 mt-4">
        まだアカウントをお持ちでない方は
        <a href="/Register" className="text-limegreen hover:underline ml-1">こちら</a>から登録してください。
      </p>
    </div>
  );
}
