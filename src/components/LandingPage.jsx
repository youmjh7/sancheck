import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
    const [logo, setLogo] = useState('https://static.wikia.nocookie.net/disney/images/b/b8/Stitch-ohana.png');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const savedLogo = localStorage.getItem('appLogo');
        if (savedLogo) {
            setLogo(savedLogo);
        }
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            setUserName(savedName);
        }
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    localStorage.setItem('appLogo', reader.result);
                    setLogo(reader.result);
                } catch (e) {
                    alert("로고 사진 용량이 너무 큽니다. 😭\n더 작은 사진을 선택해주세요!");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEnter = () => {
        if (userName.trim()) {
            localStorage.setItem('userName', userName);
            onEnter(userName);
        } else {
            alert("보호자님 닉네임을 입력해주세요!");
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="logo-container">
                    <label htmlFor="logo-upload" className="logo-label" title="로고 변경하기">
                        <img src={logo} alt="App Logo" className="app-logo" />
                        <div className="edit-overlay">✏️</div>
                    </label>
                    <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <h1 className="landing-title">👽 스티치와 산책!</h1>
                <p className="landing-subtitle">스티치와 함께하는 특별한 산책 🐾</p>

                <div className="login-form">
                    <input
                        type="text"
                        className="name-input"
                        placeholder="보호자님 닉네임"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEnter()}
                    />
                    <button onClick={handleEnter} className="enter-button">
                        🚀 출발!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
