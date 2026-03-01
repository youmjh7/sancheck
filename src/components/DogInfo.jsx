import React, { useState, useEffect } from 'react';
import './DogInfo.css';

const DogInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dog, setDog] = useState({
    name: '스티치',
    breed: '실험체 626호',
    age: 3,
    image: 'https://static.wikia.nocookie.net/disney/images/b/b8/Stitch-ohana.png'
  });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedDog = localStorage.getItem('dogInfo');
    if (savedDog) setDog(JSON.parse(savedDog));
    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('dogInfo', JSON.stringify(dog));
      setIsEditing(false);
    } catch (e) {
      alert(e.name === 'QuotaExceededError'
        ? "사진 용량이 너무 커서 저장할 수 없습니다. 😭\n더 작은 사진을 선택해주세요!"
        : "저장 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDog(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let w = img.width, h = img.height;
        if (w > h) { h = Math.round(h * MAX_SIZE / w); w = MAX_SIZE; }
        else { w = Math.round(w * MAX_SIZE / h); h = MAX_SIZE; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        setDog(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.7) }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  if (isEditing) {
    return (
      <div className="di-card">
        <div className="di-edit-header">
          <button onClick={() => setIsEditing(false)} className="di-back-btn">←</button>
          <h2>프로필 수정</h2>
          <div style={{ width: 40 }} />
        </div>
        <form onSubmit={handleSave} className="di-form">
          <label className="di-photo-upload">
            <img src={dog.image} alt="프로필" className="di-edit-photo" />
            <div className="di-photo-overlay">📷 변경</div>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
          <div className="di-form-group">
            <label>이름</label>
            <input name="name" value={dog.name} onChange={handleChange} placeholder="강아지 이름" required />
          </div>
          <div className="di-form-group">
            <label>품종</label>
            <input name="breed" value={dog.breed} onChange={handleChange} placeholder="ex) 포메라니안" required />
          </div>
          <div className="di-form-group">
            <label>나이</label>
            <input name="age" type="number" value={dog.age} onChange={handleChange} placeholder="나이(숫자)" required />
          </div>
          <button type="submit" className="di-save-btn">💾 변경사항 저장</button>
        </form>
      </div>
    );
  }

  return (
    <div className="di-card">
      {/* Header */}
      <div className="di-card-header">
        <span className="di-header-title">🐾 내 반려견 프로필</span>
        <button onClick={() => setIsEditing(true)} className="di-edit-btn">수정</button>
      </div>

      {/* Profile */}
      <div className="di-profile-section">
        <div className="di-avatar-wrap">
          <img src={dog.image} alt={dog.name} className="di-avatar" />
          <div className="di-status-dot" />
        </div>
        <h3 className="di-name">{dog.name}</h3>
        <div className="di-breed-row">
          <span className="di-breed">{dog.breed}</span>
          <span className="di-dot" />
          <span className="di-active">산책 준비중</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="di-stats-grid">
        <div className="di-stat-card">
          <p className="di-stat-label">나이</p>
          <p className="di-stat-value">{dog.age}세</p>
        </div>
        <div className="di-stat-card">
          <p className="di-stat-label">상태</p>
          <p className="di-stat-value">활발 🐾</p>
        </div>
      </div>

      {/* Owner Section */}
      {userName && (
        <div className="di-owner-section">
          <div className="di-owner-info">
            <div className="di-owner-avatar">{userName[0]}</div>
            <div>
              <p className="di-owner-label">보호자</p>
              <p className="di-owner-name">{userName}님</p>
            </div>
          </div>
          <span className="di-verified">✓</span>
        </div>
      )}
    </div>
  );
};

export default DogInfo;
