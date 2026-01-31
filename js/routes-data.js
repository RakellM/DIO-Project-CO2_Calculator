// routes-data.js
// Global Routes Database for CO2 Emission Calculator

const RoutesDB = (function() {
    'use strict';
    
    // Main routes array containing popular Canada/USA routes
    const routes = [
        // Canada - East
        { origin: "Toronto, ON", destination: "Ottawa, ON", distanceKm: 451 },
        { origin: "Toronto, ON", destination: "Montreal, QC", distanceKm: 542 },
        { origin: "Toronto, ON", destination: "Vancouver, BC", distanceKm: 4350 },
        { origin: "Toronto, ON", destination: "New York, NY", distanceKm: 874 },
        { origin: "Toronto, ON", destination: "Chicago, IL", distanceKm: 838 },
        { origin: "Ottawa, ON", destination: "Montreal, QC", distanceKm: 199 },
        { origin: "Ottawa, ON", destination: "Edmonton, AB", distanceKm: 3389 },
        { origin: "Ottawa, ON", destination: "Vancouver, BC", distanceKm: 4465 },
        { origin: "Montreal, QC", destination: "Quebec City, QC", distanceKm: 250 },
        { origin: "Montreal, QC", destination: "Boston, MA", distanceKm: 506 },
        
        // Canada - West
        { origin: "Vancouver, BC", destination: "Seattle, WA", distanceKm: 230 },
        { origin: "Vancouver, BC", destination: "Calgary, AB", distanceKm: 970 },
        { origin: "Vancouver, BC", destination: "Edmonton, AB", distanceKm: 1170 },
        { origin: "Vancouver, BC", destination: "Toronto, ON", distanceKm: 4350 },
        { origin: "Calgary, AB", destination: "Edmonton, AB", distanceKm: 299 },
        { origin: "Calgary, AB", destination: "Winnipeg, MB", distanceKm: 1330 },
        { origin: "Edmonton, AB", destination: "Saskatoon, SK", distanceKm: 525 },
        { origin: "Edmonton, AB", destination: "Victoria, BC", distanceKm: 1210 },
        
        // Canada - Central
        { origin: "Winnipeg, MB", destination: "Toronto, ON", distanceKm: 2040 },
        { origin: "Winnipeg, MB", destination: "Calgary, AB", distanceKm: 1330 },
        { origin: "Winnipeg, MB", destination: "Saskatoon, SK", distanceKm: 785 },
        { origin: "Winnipeg, MB", destination: "Thunder Bay, ON", distanceKm: 705 },
        { origin: "Halifax, NS", destination: "St. John's, NL", distanceKm: 1710 },
        { origin: "Halifax, NS", destination: "Montreal, QC", distanceKm: 1265 },
        { origin: "Halifax, NS", destination: "Toronto, ON", distanceKm: 1795 },
        
        // USA - Major Routes
        { origin: "New York, NY", destination: "Washington, DC", distanceKm: 365 },
        { origin: "New York, NY", destination: "Boston, MA", distanceKm: 346 },
        { origin: "New York, NY", destination: "Chicago, IL", distanceKm: 1266 },
        { origin: "New York, NY", destination: "Los Angeles, CA", distanceKm: 4470 },
        { origin: "Los Angeles, CA", destination: "San Francisco, CA", distanceKm: 616 },
        { origin: "Los Angeles, CA", destination: "Las Vegas, NV", distanceKm: 434 },
        { origin: "Los Angeles, CA", destination: "San Diego, CA", distanceKm: 192 },
        { origin: "Chicago, IL", destination: "Detroit, MI", distanceKm: 458 },
        { origin: "Chicago, IL", destination: "St. Louis, MO", distanceKm: 467 },
        { origin: "Chicago, IL", destination: "Minneapolis, MN", distanceKm: 644 },
        
        // Cross-border Routes
        { origin: "Seattle, WA", destination: "Portland, OR", distanceKm: 280 },
        { origin: "Seattle, WA", destination: "Vancouver, BC", distanceKm: 230 },
        { origin: "Detroit, MI", destination: "Windsor, ON", distanceKm: 5 },
        { origin: "Buffalo, NY", destination: "Toronto, ON", distanceKm: 157 },
        { origin: "Boston, MA", destination: "Montreal, QC", distanceKm: 506 },
        
        // Additional Popular Routes
        { origin: "San Francisco, CA", destination: "Portland, OR", distanceKm: 1015 },
        { origin: "San Francisco, CA", destination: "Seattle, WA", distanceKm: 1300 },
        { origin: "Miami, FL", destination: "Orlando, FL", distanceKm: 346 },
        { origin: "Miami, FL", destination: "Atlanta, GA", distanceKm: 1087 },
        { origin: "Atlanta, GA", destination: "Nashville, TN", distanceKm: 395 },
        { origin: "Dallas, TX", destination: "Houston, TX", distanceKm: 385 },
        { origin: "Dallas, TX", destination: "Austin, TX", distanceKm: 320 },
        { origin: "Phoenix, AZ", destination: "Tucson, AZ", distanceKm: 188 },
        { origin: "Phoenix, AZ", destination: "Las Vegas, NV", distanceKm: 474 }
    ];
    
    /**
     * RoutesDB object containing routes data and utility methods
     * @namespace RoutesDB
     */
    return {
        /**
         * Array of route objects with origin, destination, and distanceKm
         * @type {Array}
         * @property {string} origin - City with state/province
         * @property {string} destination - City with state/province
         * @property {number} distanceKm - Distance in kilometers
         */
        routes: routes,
        
        /**
         * Get all unique city names from routes database
         * Extracts cities from both origin and destination fields
         * @returns {string[]} Sorted array of unique city names
         */
        getAllCities: function() {
            const cities = new Set();
            
            // Add all origins and destinations to Set (automatically removes duplicates)
            this.routes.forEach(route => {
                cities.add(route.origin);
                cities.add(route.destination);
            });
            
            // Convert Set to Array and sort alphabetically
            return Array.from(cities).sort();
        },
        
        /**
         * Find distance between two cities
         * Searches in both directions (origin-destination and destination-origin)
         * @param {string} cityA - First city name with state/province
         * @param {string} cityB - Second city name with state/province
         * @returns {number|null} Distance in km if found, null if not found
         */
        findDistance: function(cityA, cityB) {
            // Normalize inputs: trim whitespace and convert to lowercase
            const normalizedA = cityA.trim().toLowerCase();
            const normalizedB = cityB.trim().toLowerCase();
            
            // Search for route in either direction
            const route = this.routes.find(route => {
                const origin = route.origin.toLowerCase();
                const destination = route.destination.toLowerCase();
                
                return (origin === normalizedA && destination === normalizedB) ||
                       (origin === normalizedB && destination === normalizedA);
            });
            
            // Return distance if found, null otherwise
            return route ? route.distanceKm : null;
        }
    };
})();

// Make RoutesDB available globally
window.RoutesDB = RoutesDB;
