// src/pages/Addresses.jsx
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useUser } from '../context/UserContext';

export default function Addresses() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null); // 编辑中的地址
  const [form, setForm] = useState({
    recipient: '', phone: '', postalCode: '', province: '', city: '', detail: ''
  });

  const fetchAddresses = async () => {
    if (!user) return;
    const res = await axios.get(`/addresses/user/${user.id}`);
    setAddresses(res.data);
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  const handleEdit = addr => {
    setEditing(addr.id);
    setForm({ ...addr });
  };

  const handleSave = async () => {
    if (editing) {
      await axios.put(`/addresses/${editing}`, form);
    } else {
      await axios.post('/addresses', { ...form, userId: user.id });
    }
    setEditing(null);
    setForm({ recipient: '', phone: '', postalCode: '', province: '', city: '', detail: '' });
    fetchAddresses();
  };

  const handleDelete = async id => {
    if (window.confirm('本当に削除しますか？')) {
      await axios.delete(`/addresses/${id}`);
      fetchAddresses();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">お届け先情報管理</h2>
      <div className="mb-6">
        <h3 className="font-semibold">{editing ? 'お届け先編集' : 'お届け先追加'}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-1" placeholder="氏名" value={form.recipient} onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))} />
          <input className="border p-1" placeholder="電話番号" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <input className="border p-1" placeholder="郵便番号" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
          <input className="border p-1" placeholder="都道府県" value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
          <input className="border p-1" placeholder="市区町村" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          <input className="border p-1 col-span-2" placeholder="詳細住所" value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} />
        </div>
        <button onClick={handleSave} className="mt-2 px-3 py-1 bg-lime-600 text-white rounded">{editing ? '更新' : '追加'}</button>
        {editing && <button onClick={() => { setEditing(null); setForm({ recipient: '', phone: '', postalCode: '', province: '', city: '', detail: '' }); }} className="ml-2 px-3 py-1 bg-gray-400 text-white rounded">キャンセル</button>}
      </div>
      <h3 className="font-semibold mb-2">登録済みお届け先</h3>
      {addresses.map(addr => (
        <div key={addr.id} className="border rounded p-3 mb-2 flex justify-between items-center">
          <div>
            <div>{addr.recipient}（{addr.phone}）</div>
            <div>{addr.postalCode} {addr.province}{addr.city}{addr.detail}</div>
          </div>
          <div>
            <button className="mr-2 px-2 py-1 bg-indigo-500 text-white rounded" onClick={() => handleEdit(addr)}>編集</button>
            <button className="px-2 py-1 bg-rose-500 text-white rounded" onClick={() => handleDelete(addr.id)}>削除</button>
          </div>
        </div>
      ))}
    </div>
  );
}
