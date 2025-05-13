import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const location = useLocation();
  const [position, setPosition] = useState<[number, number]>([8.367803, 124.866020]); 
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if we have location parameters in the URL
    const params = new URLSearchParams(location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');

    if (lat && lng) {
      // Use the location from URL parameters
      setPosition([parseFloat(lat), parseFloat(lng)]);
      setLoaded(true);
    } else {
      // Fallback to getting current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setPosition([latitude, longitude]);
            setLoaded(true);
          },
          (error) => {
            console.log("Error getting location: ", error);
            setLoaded(true); // Set loaded even if there's an error
          }
        );
      } else {
        console.log("Geolocation not supported by this browser.");
        setLoaded(true);
      }
    }
  }, [location.search]);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ 
          height: '100%', 
          width: '100%',
          zIndex: 1
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {loaded && (
          <Marker 
            position={position} 
            icon={L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              {location.search ? 'Report Location' : 'You are here!'}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
