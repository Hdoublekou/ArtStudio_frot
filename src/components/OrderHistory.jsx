// src/components/OrderHistory.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

export default function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 拉取订单
  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/orders/user/${userId}`);
      setOrders(res.data);
    } catch (e) {
      alert('注文履歴の取得に失敗しました');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [userId]);

  // 支付
  const handlePay = async (orderId) => {
    if (!window.confirm('この注文を支払いますか？')) return;
    try {
      await axios.post(`/orders/pay/${orderId}`);
      alert('支払い成功');
      fetchOrders(); // ⏫⏫支付后立即刷新
    } catch (e) {
      alert('支払い失敗');
    }
  };

  // 取消
  const handleCancel = async (orderId) => {
    if (!window.confirm('この注文をキャンセルしますか？')) return;
    try {
      await axios.post(`/orders/cancel/${orderId}`);
      alert('キャンセルしました');
      fetchOrders(); // ⏫⏫取消后立即刷新
    } catch (e) {
      alert('キャンセル失敗');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">注文履歴</h3>
      {loading ? (
        <div className="text-gray-400">読み込み中...</div>
      ) : (
        <table className="w-full border text-center text-sm">
          <thead>
            <tr>
              <th>注文ID</th>
              <th>作品ID</th>
              <th>注文日時</th>
              <th>金額</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-gray-400">注文履歴がありません</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.workId}</td>
                  <td>{order.createdAt?.replace('T', ' ').substring(0, 16) || ''}</td>
                  <td>{order.totalPrice}円</td>
                  <td>
                    {order.status === 'PAID' ? '支払い済み'
                      : order.status === 'CANCELLED' ? 'キャンセル'
                      : '未払い'}
                  </td>
                  <td>
                    {order.status === 'CREATED' && (
                      <>
                        <button
                          onClick={() => handlePay(order.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                        >支払い</button>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >取消</button>
                      </>
                    )}
                    {(order.status === 'PAID' || order.status === 'CANCELLED') && '無操作'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
