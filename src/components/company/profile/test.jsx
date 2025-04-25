import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet-geosearch/dist/geosearch.css';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickableMap({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapExample() {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = { lat: latitude, lng: longitude };
        setPosition(latlng);
        setMapCenter([latitude, longitude]);
        fetchLocationName(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      setLocationName(data.display_name || 'Unknown location');
    } catch {
      setLocationName('Location fetch failed');
    }
  };

  const handleMapClick = async (latlng) => {
    setPosition(latlng);
    setMapCenter([latlng.lat, latlng.lng]);
    fetchLocationName(latlng.lat, latlng.lng);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const loc = data[0];
        const lat = parseFloat(loc.lat);
        const lon = parseFloat(loc.lon);
        setPosition({ lat, lng: lon });
        setMapCenter([lat, lon]);
        setLocationName(loc.display_name || 'Unknown location');
      } else {
        setLocationName('No results found');
      }
    } catch (err) {
      console.error('Search failed', err);
      setLocationName('Search failed');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <form onSubmit={handleSearch} style={{ textAlign: 'center', padding: '10px' }}>
        <input
          type="text"
          placeholder="Search for a location"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
          Search
        </button>
      </form>

      <MapContainer center={mapCenter} zoom={13} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />
        <ClickableMap onMapClick={handleMapClick} />
        {position && (
          <Marker position={position}>
            <Popup>
              <strong>Lat:</strong> {position.lat.toFixed(5)} <br />
              <strong>Lng:</strong> {position.lng.toFixed(5)} <br />
              <strong>Location:</strong> {locationName}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
