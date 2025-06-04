import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export default function AddressBook({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    recipient: "",
    postcode: "",
    prefecture: "",
    city: "",
    address: "",
    phone: "",
  });
  const [showForm, setShowForm] = useState(false);

  // 拉取地址列表
  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/addresses/user/${userId}`);
      setAddresses(res.data);
    } catch (e) {
      alert("お届け先情報取得に失敗しました");
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line
  }, [userId]);

  // 通用表单输入
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 打开添加新地址表单
  const handleAddNew = () => {
    setEditingId(null);
    setForm({
      recipient: "",
      postcode: "",
      prefecture: "",
      city: "",
      address: "",
      phone: "",
    });
    setShowForm(true);
  };

  // 打开编辑表单
  const handleEdit = (address) => {
    setEditingId(address.id);
    setForm(address);
    setShowForm(true);
  };

  // 提交表单（新建或编辑）
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // 编辑
        await axios.put(`/addresses/${editingId}`, {
          ...form,
          userId,
        });
        alert("お届け先情報を更新しました");
      } else {
        // 新建
        await axios.post("/addresses", {
          ...form,
          userId,
        });
        alert("お届け先情報を追加しました");
      }
      setShowForm(false);
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      alert("保存に失敗しました");
    }
  };

  // 删除
  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await axios.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (e) {
      alert("削除に失敗しました");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">お届け先情報</h3>
        <button
          className="bg-lime-600 text-white px-3 py-1 rounded text-sm"
          onClick={handleAddNew}
        >
          新規追加
        </button>
      </div>

      {/* 地址列表 */}
      {addresses.length === 0 ? (
        <div className="text-gray-400 py-8 text-center">
          お届け先情報がありません
        </div>
      ) : (
        <table className="w-full border text-sm mb-4">
          <thead>
            <tr>
              <th>受取人</th>
              <th>郵便番号</th>
              <th>都道府県</th>
              <th>市区町村</th>
              <th>住所</th>
              <th>電話番号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((addr) => (
              <tr key={addr.id}>
                <td>{addr.recipient}</td>
                <td>{addr.postcode}</td>
                <td>{addr.prefecture}</td>
                <td>{addr.city}</td>
                <td>{addr.address}</td>
                <td>{addr.phone}</td>
                <td>
                  <button
                    onClick={() => handleEdit(addr)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 表单弹窗 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border rounded-lg p-4 space-y-3 mb-6"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs mb-1">受取人</label>
              <input
                name="recipient"
                required
                className="w-full border px-2 py-1 rounded"
                value={form.recipient}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">郵便番号</label>
              <input
                name="postcode"
                required
                className="w-full border px-2 py-1 rounded"
                value={form.postcode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">都道府県</label>
              <input
                name="prefecture"
                required
                className="w-full border px-2 py-1 rounded"
                value={form.prefecture}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs mb-1">市区町村</label>
              <input
                name="city"
                required
                className="w-full border px-2 py-1 rounded"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1">住所</label>
              <input
                name="address"
                required
                className="w-full border px-2 py-1 rounded"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">電話番号</label>
              <input
                name="phone"
                required
                className="w-full border px-2 py-1 rounded"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              className="bg-lime-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "保存" : "追加"}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => setShowForm(false)}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
