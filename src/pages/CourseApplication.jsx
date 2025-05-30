// src/pages/CourseApplication.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './leafArt_course_application.module.css';
import { useUser } from '../context/UserContext';

export default function CourseApplication() {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      date,
      time,
      name,
      email,
      phone
    });
    alert('予約申請が送信されました！');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>コース予約</h2>
      <p className={styles.steps}>
        コースの日付を選択 → 時間帯を選択 → 情報を入力 → 予約ボタンをクリック
      </p>

      <h3 className={styles.stepTitle}>1. 日付を選択</h3>
      <div className={styles.calendarWrapper}>
        <Calendar onChange={setDate} value={date} />
      </div>

      <h3 className={styles.stepTitle}>2. 時間帯を選択</h3>
      {date ? (
        <select
          className={styles.inputField}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="">時間帯を選択してください</option>
          <option value="09:00-12:00">09:00-12:00</option>
          <option value="13:00-16:00">13:00-16:00</option>
          <option value="17:00-20:00">17:00-20:00</option>
        </select>
      ) : (
        <p>まず日付を選択してください</p>
      )}

      {/* 删除 3.情報を入力标题 */}
      <form onSubmit={handleSubmit} className={styles.formGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="お名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.inputField}
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.inputField}
          type="tel"
          placeholder="電話番号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          className={`${styles.submitButton} ${styles.alwaysVisible}`}
        >
          予約する
        </button>
      </form>
    </div>
  );
}
