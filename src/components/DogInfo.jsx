import React, { useState, useEffect } from 'react';
import './DogInfo.css';

const DogInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dog, setDog] = useState({
    name: '바둑이',
    breed: '골든 리트리버',
    age: 3,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  });

  useEffect(() => {
    const savedDog = localStorage.getItem('dogInfo');
    if (savedDog) {
      setDog(JSON.parse(savedDog));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('dogInfo', JSON.stringify(dog));
      setIsEditing(false);
      alert("저장되었습니다! 🐾");
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert("사진 용량이 너무 커서 저장할 수 없습니다. 😭\n더 작은 사진을 선택해주세요!");
      } else {
        alert("저장 중 오류가 발생했습니다.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using Canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 300; // max width/height in px
          let w = img.width;
          let h = img.height;
          if (w > h) { h = Math.round(h * MAX_SIZE / w); w = MAX_SIZE; }
          else { w = Math.round(w * MAX_SIZE / h); h = MAX_SIZE; }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          setDog(prev => ({ ...prev, image: compressed }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="dog-info-card editing">
        <form onSubmit={handleSave} className="dog-form">
          <div className="form-group">
            <label>이름</label>
            <input name="name" value={dog.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>품종</label>
            <input name="breed" value={dog.breed} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>나이</label>
            <input name="age" type="number" value={dog.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>사진 (파일 선택)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <button type="submit" className="save-btn">저장</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dog-info-card">
      <img src={dog.image} alt={dog.name} className="dog-image" />
      <div className="dog-details">
        <div className="header-row">
          <h2>{dog.name}</h2>
          <button onClick={() => setIsEditing(true)} className="edit-btn">수정</button>
        </div>
        <p>{dog.breed}, {dog.age}세</p>
      </div>
    </div>
  );
};

export default DogInfo;
