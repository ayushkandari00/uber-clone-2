const axios = require('axios');
const captainModel = require('../models/captain.model');

/**
 * Geocode an address to {ltd, lng} using Nominatim (OpenStreetMap) — FREE, no key needed.
 */
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'uber-clone-app/1.0' }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                ltd: parseFloat(lat),
                lng: parseFloat(lon)
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Nominatim error:', error.message);
        throw error;
    }
};

/**
 * Get distance (meters) and duration (seconds) between two addresses using OSRM — FREE, no key needed.
 * Returns object shaped like Google Distance Matrix element: { distance: {value}, duration: {value} }
 */
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // First geocode both addresses
        const [originCoords, destCoords] = await Promise.all([
            module.exports.getAddressCoordinate(origin),
            module.exports.getAddressCoordinate(destination)
        ]);

        // OSRM public routing API (driving profile)
        const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'uber-clone-app/1.0' }
        });

        if (response.data.code === 'Ok' && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: { value: route.distance },  // metres
                duration: { value: route.duration }   // seconds
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error('OSRM error:', err.message);
        throw err;
    }
};

/**
 * Get place autocomplete suggestions using Photon (Komoot) — FREE, no key needed.
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5&lang=en`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'uber-clone-app/1.0' }
        });

        if (response.data && response.data.features) {
            return response.data.features
                .map(feature => {
                    const p = feature.properties;
                    const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
                    return parts.join(', ');
                })
                .filter(Boolean);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error('Photon error:', err.message);
        throw err;
    }
};

/**
 * Find captains within a radius (km) using MongoDB geospatial query.
 */
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;
};