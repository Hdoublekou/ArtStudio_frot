import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import AvatarUploader from '../components/AvatarUploader';
import ArtworkUploader from '../components/ArtworkUploader';
import defaultAvatar from '../assets/images/default-avatar.png';
import axios from '../api/axiosInstance';
import { STATIC_BASE_URL } from '../api/config';
import OrderHistory from '../components/OrderHistory'; 
import AddressBook from "../components/AddressBook";


export default function Profile() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [works, setWorks] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 读取作品
    const fetchWorks = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`/works/user/${user.id}`);
            setWorks(res.data);
        } catch (err) {
            console.error('作品取得エラー:', err);
        }
    };

    // 读取收藏
    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`/favorites/user/${user.id}`);
            setFavorites(res.data); // 约定为作品数组
        } catch (err) {
            console.error('お気に入り取得エラー:', err);
        }
    };

    // 删除作品
    const handleDeleteWork = async (workId) => {
        if (!window.confirm('この作品を本当に削除しますか？')) return;
        try {
            await axios.delete(`/works/${workId}`);
            setWorks(works.filter(work => work.id !== workId));
        } catch (err) {
            alert('作品削除に失敗しました');
            console.error(err);
        }
    };

    // 点赞/取消点赞
    const toggleFavorite = async (work) => {
        try {
            if (work.isFavorite) {
                // 取消
                await axios.delete(`/favorites`, { data: { userId: user.id, workId: work.id } });
            } else {
                // 点赞
                await axios.post(`/favorites`, { userId: user.id, workId: work.id });
            }
            fetchFavorites(); // 更新收藏列表
            fetchWorks(); // 刷新作品（如作品内有favorite count/isFavorite标识）
        } catch (err) {
            alert('お気に入り処理に失敗しました');
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWorks();
            fetchFavorites();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-start min-h-screen mt-32">
                <p className="text-gray-600 mb-4">未ログインです。ログインしてください。</p>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 transition"
                >
                    ログインページへ
                </button>
            </div>
        );
    }

    // 上传头像
    const handleAvatarUpload = (file) => {
        setAvatarFile(file);
        setUploaded(true);
    };

    const handleAvatarSave = async () => {
        if (!avatarFile) return;
        const formData = new FormData();
        formData.append("file", avatarFile);

        try {
            await axios.post(`/users/${user.id}/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('アバターを更新しました！');
            window.location.reload();
        } catch (err) {
            alert('アバターの保存に失敗しました');
            console.error('Avatar Save Error:', err);
        }
    };

    // 修改密码
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('新しいパスワードが一致しません。');
            return;
        }
        try {
            await axios.put(`/users/${user.id}/password`, {
                currentPassword,
                newPassword
            });
            alert('パスワードが変更されました');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            alert('パスワード変更に失敗しました');
            console.error('Password Change Error:', err);
        }
    };

    // 注销账户
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。');
        if (!confirmDelete) return;

        try {
            await axios.delete(`/users/${user.id}`);
            alert('アカウントが削除されました');
            logout();
            navigate('/');
        } catch (err) {
            alert('アカウントの削除に失敗しました');
            console.error('Delete Account Error:', err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-10">
                {/* 左侧菜单 */}
                <aside className="w-full md:w-1/4 space-y-4 border-r pr-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatarUrl ? `${STATIC_BASE_URL}${user.avatarUrl}` : defaultAvatar}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="font-semibold text-lg">{user.name}</h2>
                            <p className="text-sm text-gray-500">プロフィール設定</p>
                        </div>
                    </div>
<nav className="text-sm space-y-2 text-gray-700">
    <div className="font-bold">一般</div>
    <ul className="space-y-1">
        <li onClick={() => setActiveTab('profile')} className={`cursor-pointer ${activeTab === 'profile' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>プロフィール</li>
        <li onClick={() => setActiveTab('password')} className={`cursor-pointer ${activeTab === 'password' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>パスワード</li>
        <li onClick={() => setActiveTab('notification')} className={`cursor-pointer ${activeTab === 'notification' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>通知設定</li>
        <li
          onClick={() => setActiveTab("address")}
          className={`cursor-pointer ${activeTab === "address" ? "text-lime-600 font-semibold" : "hover:text-lime-600"}`}
        >
          お届け先情報
        </li>
        <li onClick={() => setActiveTab('upload')} className={`cursor-pointer ${activeTab === 'upload' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>作品アップロード</li>
        <li onClick={() => setActiveTab('cart')} className={`cursor-pointer ${activeTab === 'cart' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>カート</li>
        <li onClick={() => setActiveTab('favorites')} className={`cursor-pointer ${activeTab === 'favorites' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>お気に入り</li>
        <li onClick={() => setActiveTab('orders')} className={`cursor-pointer ${activeTab === 'orders' ? 'text-lime-600 font-semibold' : 'hover:text-lime-600'}`}>注文履歴</li>
        {/* 只允许 店铺/管理者 显示商品管理 */}
        {(user.role === 'shop' || user.role === 'admin') && (
          <li onClick={() => navigate('/my-products')} className="cursor-pointer hover:text-lime-600">商品管理</li>
        )}
        <li onClick={handleDeleteAccount} className="text-rose-500 hover:underline cursor-pointer">アカウント削除</li>
    </ul>
</nav>

                </aside>

                {/* 右侧内容 */}
                <section className="flex-1 space-y-6">
                    {/* プロフィール设置 */}
                    {activeTab === 'profile' && (
                        <>
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">ユーザー名</label>
                                <input type="text" defaultValue={user.name} className="w-full border px-4 py-2 rounded text-sm" disabled />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">メールアドレス</label>
                                <input type="email" defaultValue={user.email} className="w-full border px-4 py-2 rounded text-sm" disabled />
                            </div>
                            <div className="mt-6">
                                <h3 className="text-sm text-gray-700 mb-2">アバター変更</h3>
                                <AvatarUploader currentAvatar={user.avatarUrl || defaultAvatar} onUpload={handleAvatarUpload} onSave={handleAvatarSave} uploaded={uploaded} userId={user.id} />
                            </div>
                            <div className="pt-6">
                                <button onClick={logout} className="bg-rose-500 text-white px-5 py-2 rounded hover:bg-rose-600 transition text-sm">
                                    ログアウト
                                </button>
                            </div>
                        </>
                    )}

                    {/* 作品上传/我的作品 */}
                    {activeTab === 'upload' && (
                        <div className="space-y-6">
                            <div className="mt-10">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">作品をアップロード</h3>
                                <ArtworkUploader userId={user.id} onUpload={fetchWorks} />
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/my-artworks')}
                                        className="text-sm text-lime-700 hover:underline"
                                    >
                                        ▶ アップロード済み作品ページへ
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">アップロード済み作品</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {works.map(work => (
                                        <div key={work.id} className="border rounded shadow-sm overflow-hidden relative group">
                                            <img src={`${STATIC_BASE_URL}${work.imageUrl}`} alt={work.title} className="w-full h-40 object-cover" />
                                            <div className="p-2">
                                                <h4 className="text-sm font-semibold">{work.title}</h4>
                                                {work.description && <p className="text-xs text-gray-500">{work.description}</p>}
                                                <div className="flex items-center gap-2 mt-2">
                                                    {/* 喜欢按钮 */}
                                                    <button
                                                        className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${work.isFavorite ? 'bg-lime-100 text-lime-600' : 'hover:bg-gray-100'}`}
                                                        onClick={() => toggleFavorite(work)}
                                                    >
                                                        <span className="material-icons" style={{ fontSize: '18px' }}>{work.isFavorite ? "favorite" : "favorite_border"}</span>
                                                        {work.favoriteCount || 0}
                                                    </button>
                                                    {/* 删除按钮（仅自己作品） */}
                                                    <button
                                                        className="text-xs text-rose-500 hover:underline ml-2"
                                                        onClick={() => handleDeleteWork(work.id)}
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* パスワード */}
                    {activeTab === 'password' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">現在のパスワード</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border px-4 py-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">新しいパスワード</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border px-4 py-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">パスワード再入力</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border px-4 py-2 rounded text-sm" />
                            </div>
                            <button onClick={handlePasswordChange} className="mt-2 bg-lime-600 text-white px-5 py-2 rounded hover:bg-lime-700 transition text-sm">
                                パスワードを変更
                            </button>
                        </div>
                    )}

                    {/* 通知设置 */}
                    {activeTab === 'notification' && (
                        <div className="text-sm text-gray-500">
                            通知設定機能は現在準備中です。
                        </div>
                    )}

                    {/* 购物车/收藏/订单 */}
                    {activeTab === 'cart' && (
                        <div className="text-sm text-gray-500">
                            <h3 className="text-lg font-semibold mb-4">カート</h3>
                            <p>ここにカート内容を表示</p>
                        </div>
                    )}

                    {/* 收藏页面 */}
                    {activeTab === 'favorites' && (
                        <div className="text-sm text-gray-500">
                            <h3 className="text-lg font-semibold mb-4">お気に入り</h3>
                            {favorites.length === 0 ? (
                                <p>まだお気に入り作品がありません。</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {favorites.map(work => (
                                        <div key={work.id} className="border rounded shadow-sm overflow-hidden">
                                            <img src={`${STATIC_BASE_URL}${work.imageUrl}`} alt={work.title} className="w-full h-40 object-cover" />
                                            <div className="p-2">
                                                <h4 className="text-sm font-semibold">{work.title}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-lime-600 material-icons" style={{ fontSize: '18px' }}>favorite</span>
                                                    {work.favoriteCount || 0}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

{activeTab === 'orders' && (
  <div className="text-sm text-gray-700">
    <OrderHistory userId={user.id} />
  </div>
)}

{activeTab === "address" && (
  <div className="text-sm text-gray-700">
    <AddressBook userId={user.id} />
  </div>
)}
                </section>
            </div>
        </div>
    );
}
