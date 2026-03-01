import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
    const [dogImage, setDogImage] = useState('/logo.jpg');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        if (savedName) setUserName(savedName);
    }, []);

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
                    <img src={dogImage} alt="App Logo" className="app-logo" />
                </div>

                <h1 className="landing-title">산책하니? 🐾</h1>
                <p className="landing-subtitle">내 강아지와 함께하는 행복한 산책</p>

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
