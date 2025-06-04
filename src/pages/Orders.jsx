// src/pages/Orders.jsx
import { useUser } from '../context/UserContext';
import axios from '../api/axiosInstance';
import { useEffect, useState } from 'react';

export default function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    const res = await axios.get(`/orders/user/${user.id}`);
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const handleShowDetail = async (id) => {
    const res = await axios.get(`/orders/${id}`);
    setDetail(res.data);
  };

  const handleCancel = async (id) => {
    await axios.post(`/orders/${id}/cancel`);
    fetchOrders();
    if (detail && detail.id === id) setDetail({ ...detail, status: 'canceled' });
  };

  const handlePay = async (id) => {
    await axios.post(`/orders/${id}/pay`);
    fetchOrders();
    if (detail && detail.id === id) setDetail({ ...detail, status: 'paid' });
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-xl font-bold mb-6">注文履歴</h2>
      <div className="mb-6">
        {orders.length === 0 ? <div>注文履歴がありません。</div> : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">注文番号</th>
                <th>合計</th>
                <th>状態</th>
                <th>日時</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.id}</td>
                  <td>{order.totalAmount} 円</td>
                  <td>
                    {order.status === 'created' && <span className="text-lime-700">未払い</span>}
                    {order.status === 'paid' && <span className="text-blue-700">支払い済み</span>}
                    {order.status === 'canceled' && <span className="text-gray-500">キャンセル</span>}
                  </td>
                  <td>{order.createdAt?.replace('T', ' ').slice(0, 16)}</td>
                  <td>
                    <button className="text-lime-700 underline" onClick={() => handleShowDetail(order.id)}>詳細</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {detail && (
        <div className="border rounded p-4 bg-gray-50 mb-4">
          <div className="font-semibold mb-2">注文詳細（No.{detail.id}）</div>
          <div>状態: <b>{
            detail.status === 'created' ? '未払い'
              : detail.status === 'paid' ? '支払い済み'
              : 'キャンセル'
          }</b></div>
          <div>日時: {detail.createdAt?.replace('T', ' ').slice(0, 16)}</div>
          <div className="mt-2 font-semibold">商品一覧</div>
          <ul className="list-disc ml-6">
            {JSON.parse(detail.items).map((item, idx) => (
              <li key={idx}>{item.name} × {item.quantity}（{item.price * item.quantity} 円）</li>
            ))}
          </ul>
          <div className="font-bold mt-2">合計: {detail.totalAmount} 円</div>
          <div className="mt-2 flex gap-3">
            {detail.status === 'created' && (
              <>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handlePay(detail.id)}>支払い</button>
                <button className="px-3 py-1 bg-rose-500 text-white rounded" onClick={() => handleCancel(detail.id)}>キャンセル</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
