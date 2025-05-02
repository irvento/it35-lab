import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const Map = () => {
  const [position, setPosition] = useState<[number, number]>([8.367803, 124.866020]); 
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setLoaded(true);
        },
        (error) => {
          console.log("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
    }
  }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {loaded && (
        <Marker position={position} icon={L.icon({
          iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
          iconSize: [38, 95],
        })}>
          <Popup>You are here!</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
