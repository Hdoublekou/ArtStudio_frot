import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useUser } from '../context/UserContext';
import { STATIC_BASE_URL } from '../api/config';

export default function MyArtworks() {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [page, setPage] = useState(0);

  const fetchArtworks = () => {
    if (!user) return;
    axios.get(`/works/my`, {
      params: {
        userId: user.id,
        page,
        size: 20
      }
    }).then(res => {
      setArtworks(res.data);
    });
  };

  useEffect(() => {
    fetchArtworks();
  }, [user, page]);

  const handleDelete = async (workId) => {
    if (!window.confirm('确定要删除这件作品吗？')) return;

    try {
      await axios.delete(`/works/${workId}`);
      fetchArtworks(); // 重新加载作品
    } catch (err) {
      console.error('删除失败', err);
      alert('删除失败，请稍后再试');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">我的作品</h2>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((work) => (
            <div key={work.id} className="w-64 rounded overflow-hidden shadow bg-white hover:shadow-xl transition duration-300">
              <img
                src={`${STATIC_BASE_URL}${work.imageUrl}`}
                alt={work.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 text-center text-sm text-gray-700">
                {work.title || '无'}
              </div>
              <div className="text-center mb-3">
                <button
                  onClick={() => handleDelete(work.id)}
                  className="mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          上一页
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
