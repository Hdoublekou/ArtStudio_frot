// src/components/AvatarUploader.jsx
import React, { useState } from 'react';
import axios from '../api/axiosInstance';

export default function AvatarUploader({ currentAvatar, onUpload, onSave, uploaded, userId }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onUpload(file);  // 通知 Profile 页面已上传
      setError('');
    } else {
      setError('画像ファイルを選択してください');
    }
  };

  const handleSaveClick = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

await axios.post(`/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});


      onSave();
    } catch (err) {
      console.error(err);
      setError('アップロード中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <img
        src={preview || currentAvatar}
        alt="Avatar Preview"
        className="w-24 h-24 rounded-full object-cover mx-auto"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
      />

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      {/* ✅ 只有上传了图片才显示保存按钮 */}
      {preview && (
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition text-sm"
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      )}
    </div>
  );
}
