import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('2回入力したパスワードが一致しません。ご確認ください。');
      return;
    }

    try {
      const { name, email, password } = formData;
      const res = await axios.post('/register', { name, email, password });
      console.log('✅ 登録成功：', res.data);

      alert('登録に成功しました。ログインしてください。');
      navigate('/login');
    } catch (err) {
      console.error('❌ 登録失敗：', err.response?.data?.message || err.message);
      setError('登録に失敗しました。内容をご確認のうえ、再度お試しください。');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-limegreen text-2xl font-normal text-center text-indigo-600 mb-6">leafArt新規登録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="ユーザー名"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="パスワード（確認用）"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-limegreen w-full text-white px-4 py-2 rounded"
        >
          登録
        </button>
      </form>
         {/* 登录引导链接 */}
         <p className="text-xs text-left text-gray-600 mt-4">
        すでにアカウントをお持ちの方は、
        <a href="/login" className="text-limegreen hover:underline ml-1">こちら</a>
        からログインしてください。
      </p>
    </div>
  );
}
