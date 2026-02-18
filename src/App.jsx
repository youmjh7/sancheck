import { useState, useEffect, useRef } from 'react'
import './App.css'
import DogInfo from './components/DogInfo'
import WalkMap from './components/WalkMap'

import LandingPage from './components/LandingPage'

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [userName, setUserName] = useState('');
  const [isWalking, setIsWalking] = useState(false)
  const [path, setPath] = useState([])
  const [currentPosition, setCurrentPosition] = useState(null)
  const watchId = useRef(null)

  const handleEnterApp = (name) => {
    setUserName(name);
    setShowLanding(false);
  };

  const toggleWalk = () => {
    if (isWalking) {
      // Stop walking
      setIsWalking(false)
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current)
        watchId.current = null
      }
    } else {
      // Start walking
      setIsWalking(true)
      setPath([]) // Reset path for new walk

      if (navigator.geolocation) {
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setPath((prevPath) => [...prevPath, [latitude, longitude]])
          },
          (error) => {
            console.error("Error getting location:", error)
          },
          { enableHighAccuracy: true }
        )
      } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.")
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current)
      }
    }
  }, [])

  if (showLanding) {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🐾 산책하니?</h1>
        {userName && <div className="user-greeting">{userName}님, 반가워요!</div>}
      </header>

      <main className="app-content">
        <DogInfo />

        <div className="map-section">
          <WalkMap isWalking={isWalking} path={path} onPositionFound={setCurrentPosition} />
        </div>

        <div className="controls">
          <button
            className={`walk-button ${isWalking ? 'stop' : 'start'}`}
            onClick={toggleWalk}
          >
            {isWalking ? '산책 종료' : '산책 시작'}
          </button>


          {isWalking && (
            <div className="stats">
              <p>기록된 위치: {path.length}개</p>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h3>빠른 실행</h3>
          <div className="button-grid">
            <a href="https://www.google.com/maps/search/애견운동장" target="_blank" rel="noopener noreferrer" className="action-btn">
              🌳 근처 애견운동장
            </a>
            <a href="https://www.google.com/maps/search/애견용품점" target="_blank" rel="noopener noreferrer" className="action-btn">
              🦴 근처 애견용품점
            </a>
            <button onClick={() => {
              const pos = currentPosition || (path.length > 0 ? { lat: path[path.length - 1][0], lng: path[path.length - 1][1] } : null);
              if (!pos) {
                alert("먼저 지도의 📍 GPS 버튼을 눌러 위치를 가져오세요!");
                return;
              }
              const mapUrl = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
              const text = `[산책하니?] 현재 위치 공유 🐾\n📍 위치: ${mapUrl}`;
              if (navigator.share) {
                navigator.share({ title: '산책하니? 위치 공유', text, url: mapUrl })
                  .catch(err => console.log('공유 실패', err));
              } else {
                navigator.clipboard.writeText(text);
                alert("위치 정보가 클립보드에 복사되었습니다!");
              }
            }} className="action-btn share">
              📢 위치 공유
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
