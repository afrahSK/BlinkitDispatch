import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// Fix marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Routing component
const Routing = ({ source, destination }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !source || !destination) return;

    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (err) {
        console.warn("Could not remove routing control:", err);
      }
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(source[0], source[1]), L.latLng(destination[0], destination[1])],
      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    routingControlRef.current = control;

    control.on('routesfound', function (e) {
      const coordinates = e.routes[0].coordinates;

      if (!coordinates || coordinates.length === 0) return;

      if (markerRef.current && map.hasLayer(markerRef.current)) {
        try {
          map.removeLayer(markerRef.current);
        } catch (err) {
          console.warn("Error removing marker:", err);
        }
      }

      const redIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
      });

      const newMarker = L.marker(coordinates[0], { icon: redIcon }).addTo(map);
      markerRef.current = newMarker;

      let i = 0;
      const interval = setInterval(() => {
        if (!markerRef.current || !map) {
          clearInterval(interval);
          return;
        }
        if (i >= coordinates.length) {
          clearInterval(interval);
          return;
        }
        markerRef.current.setLatLng(coordinates[i]);
        map.panTo(coordinates[i]);
        i++;
      }, 100);
    });

    return () => {
      try {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
        if (markerRef.current && map.hasLayer(markerRef.current)) {
          map.removeLayer(markerRef.current);
          markerRef.current = null;
        }
      } catch (err) {
        console.warn("Cleanup error:", err);
      }
    };
  }, [map, source, destination]);

  return null;
};

const Track = () => {
  const { orderId } = useParams();
  const [source, setSource] = useState([22.989771, 72.5850]); // Hardcoded source
  const [destination, setDestination] = useState([22.9876, 72.5480]); // Static destination (Nirma University, Ahmedabad)
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/track/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch tracking data");

        const data = await res.json();

        const now = new Date();
        const timelineData = data.route.map((step, index) => ({
          status: step.status,
          timestamp: new Date(now.getTime() + index * 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        setTimeline(timelineData);
        // destination is now static, so no need to update from backend
      } catch (err) {
        console.error("Tracking fetch error:", err);
      }
    };

    fetchTracking();
  }, [orderId]);

  return (
    <div className="track-container" style={{ display: 'flex', height: '100vh' }}>
      <div className="left-panel" style={{ width: '30%', padding: '20px', background: '#f5f5f5' }}>
        <h2>Order ID: #{orderId}</h2>
        <div className="timeline">
          {timeline.map((update, idx) => (
            <div className="status" key={idx} style={{ marginBottom: '20px' }}>
              <div className="dot" style={{ height: '10px', width: '10px', borderRadius: '50%', background: '#3498db', marginBottom: '5px' }} />
              <div className="details">
                <strong>{update.status}</strong>
                <p>{update.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel" style={{ width: '70%' }}>
        <MapContainer center={source} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {destination && <Routing source={source} destination={destination} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Track;
