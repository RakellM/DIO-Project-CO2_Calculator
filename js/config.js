// config.js
// Global configuration and setup for CO2 Emission Calculator

const CONFIG = (function() {
    'use strict';
    
    /**
     * Emission factors in kg CO2 per kilometer
     * Source: Various environmental studies and transport authorities
     */
    const EMISSION_FACTORS = {
        bicycle: 0,     // Zero emissions for human-powered transport
        car: 0.12,      // Average passenger car (gasoline)
        bus: 0.089,     // Average bus (diesel, accounting for passenger load)
        truck: 0.96     // Average heavy-duty truck (diesel)
    };
    
    /**
     * Transport modes metadata for UI display
     * Each mode has label, icon, and color for visual representation
     */
    const TRANSPORT_MODES = {
        bicycle: {
            label: "Bicycle",
            icon: "🚲",
            color: "#10b981"  // Primary green
        },
        car: {
            label: "Car",
            icon: "🚗",
            color: "#3b82f6"  // Info blue
        },
        bus: {
            label: "Bus",
            icon: "🚌",
            color: "#f59e0b"  // Warning orange
        },
        truck: {
            label: "Truck",
            icon: "🚚",
            color: "#ef4444"  // Danger red
        }
    };
    
    /**
     * Carbon credit configuration
     * Based on voluntary carbon market standards
     */
    const CARBON_CREDIT = {
        KG_PER_CREDIT: 1000,      // 1 carbon credit = 1000kg CO2 reduction
        PRICE_MIN_USD: 50,        // Minimum price per credit
        PRICE_MAX_USD: 150        // Maximum price per credit
    };
    
    /**
     * Global configuration object
     * @namespace CONFIG
     */
    const config = {
        EMISSION_FACTORS: EMISSION_FACTORS,
        TRANSPORT_MODES: TRANSPORT_MODES,
        CARBON_CREDIT: CARBON_CREDIT,
        
        /**
         * Populate the datalist with available cities from RoutesDB
         * Creates option elements for each city in the database
         */
        populateDetails: function() {
            try {
                // Get all unique cities from RoutesDB
                const cities = RoutesDB.getAllCities();
                
                // Get the datalist element
                const datalist = document.getElementById("city-list");
                
                if (!datalist) {
                    console.error("Datalist element not found");
                    return;
                }
                
                // Clear any existing options
                datalist.innerHTML = "";
                
                // Create option elements for each city
                cities.forEach(city => {
                    const option = document.createElement("option");
                    option.value = city;
                    datalist.appendChild(option);
                });
                
                console.log(`Populated ${cities.length} cities into datalist`);
                
            } catch (error) {
                console.error("Error populating city details:", error);
            }
        },
        
        /**
         * Set up automatic distance calculation based on route selection
         * Adds event listeners to origin and destination inputs
         * Enables manual distance override via checkbox
         */
        setupDistanceAutofill: function() {
            try {
                // Get DOM elements
                const originInput = document.getElementById("origin");
                const destinationInput = document.getElementById("destination");
                const distanceInput = document.getElementById("distance");
                const manualCheckbox = document.getElementById("manual-distance");
                const helperText = document.querySelector(".calculator-form__helper");
                
                if (!originInput || !destinationInput || !distanceInput || !manualCheckbox || !helperText) {
                    console.error("Required form elements not found");
                    return;
                }
                
                /**
                 * Calculate and fill distance based on selected cities
                 */
                const calculateDistance = function() {
                    // If manual mode is enabled, don't auto-calculate
                    if (manualCheckbox.checked) {
                        return;
                    }
                    
                    const origin = originInput.value.trim();
                    const destination = destinationInput.value.trim();
                    
                    // Only calculate if both fields have values
                    if (origin && destination) {
                        const distance = RoutesDB.findDistance(origin, destination);
                        
                        if (distance !== null) {
                            // Route found - fill distance
                            distanceInput.value = distance;
                            distanceInput.readOnly = true;
                            helperText.textContent = `Distance found: ${distance} km`;
                            helperText.style.color = "#10b981"; // Success green
                            
                            // Visual feedback
                            distanceInput.style.borderColor = "#10b981";
                            setTimeout(() => {
                                distanceInput.style.borderColor = "";
                            }, 2000);
                            
                        } else {
                            // Route not found - clear and show message
                            distanceInput.value = "";
                            distanceInput.readOnly = false;
                            helperText.textContent = "Route not found in database. Please enter distance manually or check spelling.";
                            helperText.style.color = "#f59e0b"; // Warning orange
                        }
                    } else {
                        // Clear if one field is empty
                        distanceInput.value = "";
                        distanceInput.readOnly = false;
                        helperText.textContent = "Distance will be populated automatically";
                        helperText.style.color = "#6b7280"; // Default gray
                    }
                };
                
                /**
                 * Handle manual distance checkbox change
                 */
                const handleManualCheckbox = function() {
                    if (manualCheckbox.checked) {
                        // Manual mode enabled
                        distanceInput.readOnly = false;
                        distanceInput.value = "";
                        distanceInput.focus();
                        helperText.textContent = "Enter distance manually (in kilometers)";
                        helperText.style.color = "#3b82f6"; // Info blue
                    } else {
                        // Manual mode disabled - try to auto-calculate
                        distanceInput.readOnly = true;
                        calculateDistance();
                    }
                };
                
                // Add event listeners
                originInput.addEventListener("change", calculateDistance);
                originInput.addEventListener("input", calculateDistance);
                destinationInput.addEventListener("change", calculateDistance);
                destinationInput.addEventListener("input", calculateDistance);
                manualCheckbox.addEventListener("change", handleManualCheckbox);
                
                // Initial calculation in case fields are pre-filled
                setTimeout(calculateDistance, 100);
                
                console.log("Distance autofill system initialized");
                
            } catch (error) {
                console.error("Error setting up distance autofill:", error);
            }
        }
    };
    
    return config;
})();

// Make CONFIG available globally
window.CONFIG = CONFIG;
