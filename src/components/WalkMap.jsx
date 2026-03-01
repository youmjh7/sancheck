import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom red icon for other dogs to distinguish them
const otherDogIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function GpsButton({ onClick, status }) {
    return (
        <div
            className="leaflet-top leaflet-right"
            style={{ marginTop: '16px', marginRight: '16px', zIndex: 1000 }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            <div className="leaflet-control">
                <button
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
                    style={{
                        background: status === 'searching' ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '50%',
                        width: '56px',
                        height: '56px',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        touchAction: 'manipulation',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                    }}
                    title="내 위치 찾기"
                >
                    {status === 'searching' ? '⏳' : '📍'}
                </button>
            </div>
        </div>
    );
}

function LocationMarker({ onPositionFound }) {
    const [position, setPosition] = useState(null);
    const [nearbyDogs, setNearbyDogs] = useState([]);
    const [userIcon, setUserIcon] = useState(DefaultIcon);
    const [gpsStatus, setGpsStatus] = useState('idle'); // idle | searching | found | error
    const map = useMap();

    useEffect(() => {
        // Load dog image from localStorage
        const savedDog = localStorage.getItem('dogInfo');
        if (savedDog) {
            const { image } = JSON.parse(savedDog);
            if (image) {
                const customIcon = L.divIcon({
                    className: 'custom-dog-marker',
                    html: `<div style="
            background-image: url('${image}');
            background-size: cover;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          "></div>`,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor: [0, -25]
                });
                setUserIcon(customIcon);
            }
        }

        map.on("locationfound", function (e) {
            setPosition(e.latlng);
            setGpsStatus('found');
            map.flyTo(e.latlng, 16);

            if (nearbyDogs.length === 0) {
                const dogs = [];
                const names = ["초코", "두부", "콩이", "사랑이", "해피"];
                const breeds = ["푸들", "말티즈", "포메라니안", "비숑", "시츄"];
                for (let i = 0; i < 3; i++) {
                    const latOffset = (Math.random() - 0.5) * 0.005;
                    const lngOffset = (Math.random() - 0.5) * 0.005;
                    dogs.push({
                        id: i,
                        position: [e.latlng.lat + latOffset, e.latlng.lng + lngOffset],
                        name: names[Math.floor(Math.random() * names.length)],
                        breed: breeds[Math.floor(Math.random() * breeds.length)]
                    });
                }
                setNearbyDogs(dogs);
            }
        });

        map.on("locationerror", function () {
            setGpsStatus('error');
            alert("위치를 찾을 수 없습니다. 브라우저에서 위치 권한을 허용해주세요!");
        });
    }, [map]);

    const handleGpsClick = () => {
        setGpsStatus('searching');

        if (!navigator.geolocation) {
            alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
            setGpsStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                setPosition(latlng);
                setGpsStatus('found');
                map.flyTo(latlng, 16);
                if (onPositionFound) onPositionFound({ lat: latlng.lat, lng: latlng.lng });

                if (nearbyDogs.length === 0) {
                    const dogs = [];
                    const names = ["초코", "두부", "콩이", "사랑이", "해피"];
                    const breeds = ["푸들", "말티즈", "포메라니안", "비숑", "시츄"];
                    for (let i = 0; i < 3; i++) {
                        const latOffset = (Math.random() - 0.5) * 0.005;
                        const lngOffset = (Math.random() - 0.5) * 0.005;
                        dogs.push({
                            id: i,
                            position: [latlng.lat + latOffset, latlng.lng + lngOffset],
                            name: names[Math.floor(Math.random() * names.length)],
                            breed: breeds[Math.floor(Math.random() * breeds.length)]
                        });
                    }
                    setNearbyDogs(dogs);
                }
            },
            (err) => {
                setGpsStatus('error');
                if (err.code === 1) {
                    alert("위치 권한이 거부되었습니다.\n브라우저 주소창 옆 🔒 아이콘을 눌러 위치 권한을 허용해주세요!");
                } else if (err.code === 2) {
                    alert("위치를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.");
                } else {
                    alert("위치 요청 시간이 초과되었습니다. 다시 시도해주세요.");
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    return (
        <>
            <GpsButton onClick={handleGpsClick} status={gpsStatus} />
            {position && (
                <Marker position={position} icon={userIcon}>
                    <Popup>현재 위치 (나)</Popup>
                </Marker>
            )}
            {nearbyDogs.map(dog => (
                <Marker key={dog.id} position={dog.position} icon={otherDogIcon}>
                    <Popup>
                        <strong>🐾 {dog.name}</strong><br />
                        ({dog.breed})<br />
                        산책 중이에요!
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

const WalkMap = ({ isWalking, path, onPositionFound }) => {
    const center = [37.5665, 126.9780]; // Default to Seoul

    return (
        <MapContainer center={center} zoom={15} style={{ height: "400px", width: "100%", borderRadius: "12px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onPositionFound={onPositionFound} />
            {path && path.length > 0 && (
                <>
                    <Polyline
                        positions={path}
                        color="#FF5252"
                        weight={6}
                        opacity={0.8}
                        lineCap="round"
                        lineJoin="round"
                    />
                    <Marker position={path[0]} icon={DefaultIcon}>
                        <Popup>🚩 산책 시작 지점</Popup>
                    </Marker>
                </>
            )}
        </MapContainer>
    );
};

export default WalkMap;
