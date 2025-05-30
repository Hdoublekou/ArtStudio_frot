import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { STATIC_BASE_URL } from '../api/config';
import { useUser } from '../context/UserContext'; // 需要有登录用户

export default function Gallery() {
  const { user } = useUser(); // 当前用户
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetchWorks();
    // eslint-disable-next-line
  }, []);

  // 获取作品数据
  const fetchWorks = () => {
    axios.get('/works/all', { params: { userId: user?.id } }) // 请求带 userId
      .then(res => {
        setWorks(res.data);
      })
      .catch(err => {
        console.error('作品の取得に失敗しました:', err);
      });
  };

  // 点赞/取消点赞功能
  const handleLike = async (workId, liked) => {
    if (!user) {
      alert('ログイン後に「いいね」できます！');
      return;
    }
    try {
      if (liked) {
        await axios.post(`/works/${workId}/unlike`, null, { params: { userId: user.id } });
      } else {
        await axios.post(`/works/${workId}/like`, null, { params: { userId: user.id } });
      }
      fetchWorks(); // 刷新数据
    } catch (err) {
      alert('操作に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">優秀作品ギャラリー</h2>
      <p className="text-center text-gray-600 mb-6">このページでは公開された子供のアート作品を表示します</p>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {works.map(work => (
            <div key={work.id} className="w-64 rounded overflow-hidden shadow bg-white hover:shadow-xl transition duration-300">
              {/* 作品图片 */}
              <img
                src={`${STATIC_BASE_URL}${work.imageUrl}`}
                alt={work.title}
                className="w-full h-48 object-cover"
              />
              {/* 作品标题 */}
              <div className="p-3 text-center text-sm text-gray-700">
                {work.title || '無'}
              </div>
              {/* 点赞区 */}
              <div className="flex items-center justify-center pb-2">
                <button
                  onClick={() => handleLike(work.id, work.likedByCurrentUser)}
                  className={`mr-2 text-lg ${work.likedByCurrentUser ? 'text-red-500' : 'text-gray-400'}`}
                  title={work.likedByCurrentUser ? "いいねを取り消す" : "いいね"}
                >
                  ❤️
                </button>
                <span className="text-xs">{work.likeCount} 件のいいね</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
