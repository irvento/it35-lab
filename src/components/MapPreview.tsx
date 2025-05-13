import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ latitude, longitude }) => {
  return (
    <div style={{ height: '200px', width: '100%', marginTop: '10px', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[latitude, longitude]} 
          icon={L.icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
            iconSize: [25, 50],
          })}
        />
      </MapContainer>
    </div>
  );
};

export default MapPreview; 