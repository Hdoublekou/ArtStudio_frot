import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useUser } from '../context/UserContext';

export default function ArtworkUploader() {
    const { user } = useUser();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            alert('画像ファイルのみアップロード可能です。');
            e.target.value = null;
            setFile(null);
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('画像ファイルを選択してください。');
            return;
        }

        if (!user || !user.id) {
            alert('ユーザー情報が取得できません。ログインし直してください。');
            return;
        }

        const formData = new FormData();
        formData.append('userId', user.id); // ✅ 必须传给后端
        formData.append('file', file);
        formData.append('title', title || '無');
        formData.append('description', description || '');

        setUploading(true);

        try {
            await axios.post('/works/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('作品のアップロードに成功しました！');
            setFile(null);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Artwork Upload Error:', error);
            alert('作品のアップロードに失敗しました。');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">作品をアップロード</h3>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
            />
            <input
                type="text"
                placeholder="タイトル（最大15文字）"
                value={title}
                maxLength={15}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 block border rounded px-2 py-1 w-full"
            />
            <textarea
                placeholder="説明"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block border rounded px-2 py-1 w-full"
            ></textarea>

            <button
                onClick={handleUpload}
                disabled={uploading}
                className={`mt-2 px-4 py-2 text-white rounded ${
                    uploading ? 'bg-gray-400' : 'bg-lime-600 hover:bg-lime-700'
                }`}
            >
                {uploading ? 'アップロード中...' : 'アップロード'}
            </button>
        </div>
    );
}
