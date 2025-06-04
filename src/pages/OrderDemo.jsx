import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import {
  createOrder,
  payOrder,
  cancelOrder,
  fetchUserOrders,
} from '../api/orderApi';

export default function OrderDemo({ workId, product }) {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 查询当前用户所有订单
  const loadOrders = async () => {
    if (!user) return;
    const res = await fetchUserOrders(user.id);
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [user]);

  // 下单
  const handleCreateOrder = async () => {
    if (!user) return alert("请先登录");
    if (!product || !product.price) return alert("商品信息缺失！");
    setLoading(true);
    await createOrder(user.id, workId, product.price);
    await loadOrders();
    setLoading(false);
  };

  // 模拟支付
  const handlePayOrder = async (orderId) => {
    setLoading(true);
    await payOrder(orderId);
    await loadOrders();
    setLoading(false);
  };

  // 取消订单
  const handleCancelOrder = async (orderId) => {
    setLoading(true);
    await cancelOrder(orderId);
    await loadOrders();
    setLoading(false);
  };

  return (
    <div className="p-6">
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        onClick={handleCreateOrder}
        disabled={loading || !product || !product.price}
      >
        下单
      </button>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">我的订单</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">订单ID</th>
              <th className="border px-2 py-1">作品ID</th>
              <th className="border px-2 py-1">状态</th>
              <th className="border px-2 py-1">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-2 py-1">{order.id}</td>
                <td className="border px-2 py-1">{order.workId}</td>
                <td className="border px-2 py-1">
                  {order.status === 'CREATED' && '待支付'}
                  {order.status === 'PAID' && '已支付'}
                  {order.status === 'CANCELLED' && '已取消'}
                </td>
                <td className="border px-2 py-1 space-x-2">
                  {order.status === 'CREATED' && (
                    <>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                        onClick={() => handlePayOrder(order.id)}
                        disabled={loading}
                      >
                        支付
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={loading}
                      >
                        取消订单
                      </button>
                    </>
                  )}
                  {(order.status === 'PAID' || order.status === 'CANCELLED') && (
                    <span className="text-gray-400">无操作</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  暂无订单
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
