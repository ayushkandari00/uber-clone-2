import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by Webpack/Vite asset pipeline
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Inner component that re-centers the map whenever position changes
const RecenterMap = ({ position }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(position, map.getZoom())
    }, [position, map])
    return null
}

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({ lat: 28.6139, lng: 77.2090 }) // Default: New Delhi

    useEffect(() => {
        if (!navigator.geolocation) return

        // Single watchPosition covers both initial + updates — no need for separate setInterval
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (err) => console.warn('Geolocation error:', err.message),
            { enableHighAccuracy: true, maximumAge: 5000 }
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    return (
        <MapContainer
            center={[currentPosition.lat, currentPosition.lng]}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap position={[currentPosition.lat, currentPosition.lng]} />
            <Marker position={[currentPosition.lat, currentPosition.lng]} />
        </MapContainer>
    )
}

export default LiveTracking