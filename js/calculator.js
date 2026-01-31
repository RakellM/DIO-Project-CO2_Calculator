// calculator.js
// Calculation engine for CO2 Emission Calculator

const Calculator = (function() {
    'use strict';
    
    /**
     * Global calculator object containing all calculation methods
     * @namespace Calculator
     */
    const calculator = {
        
        /**
         * Calculate CO2 emissions for a given distance and transport mode
         * @param {number} distanceKm - Distance in kilometers
         * @param {string} transportMode - Transport mode key (bicycle, car, bus, truck)
         * @returns {number} CO2 emissions in kilograms, rounded to 2 decimal places
         * @throws {Error} If distance is invalid or transport mode not found
         */
        calculateEmission: function(distanceKm, transportMode) {
            // Validate input parameters
            if (typeof distanceKm !== 'number' || distanceKm <= 0) {
                throw new Error("Invalid distance. Must be a positive number.");
            }
            
            if (!CONFIG.EMISSION_FACTORS.hasOwnProperty(transportMode)) {
                throw new Error(`Unknown transport mode: ${transportMode}`);
            }
            
            // Get emission factor for the selected transport mode
            const emissionFactor = CONFIG.EMISSION_FACTORS[transportMode];
            
            // Calculate emissions: distance × emission factor
            const emission = distanceKm * emissionFactor;
            
            // Return rounded to 2 decimal places for readability
            return Math.round(emission * 100) / 100;
        },
        
        /**
         * Calculate emissions for all transport modes and compare to car as baseline
         * @param {number} distanceKm - Distance in kilometers
         * @returns {Array} Array of objects with emission data for each transport mode,
         *                  sorted from lowest to highest emissions
         */
        calculateAllModes: function(distanceKm) {
            if (typeof distanceKm !== 'number' || distanceKm <= 0) {
                throw new Error("Invalid distance. Must be a positive number.");
            }
            
            const results = [];
            
            // Get car emission as baseline for comparison
            const carEmission = this.calculateEmission(distanceKm, 'car');
            
            // Calculate emissions for each transport mode
            Object.keys(CONFIG.EMISSION_FACTORS).forEach(mode => {
                const emission = this.calculateEmission(distanceKm, mode);
                
                // Calculate percentage compared to car (car = 100%)
                let percentageVsCar;
                if (carEmission === 0) {
                    percentageVsCar = emission === 0 ? 100 : Infinity;
                } else {
                    percentageVsCar = Math.round((emission / carEmission) * 100);
                }
                
                // Create result object with all relevant data
                results.push({
                    mode: mode,
                    emission: emission,
                    percentageVsCar: percentageVsCar,
                    label: CONFIG.TRANSPORT_MODES[mode].label,
                    icon: CONFIG.TRANSPORT_MODES[mode].icon,
                    color: CONFIG.TRANSPORT_MODES[mode].color
                });
            });
            
            // Sort by emission (lowest first)
            results.sort((a, b) => a.emission - b.emission);
            
            return results;
        },
        
        /**
         * Calculate emissions savings compared to a baseline (typically car)
         * @param {number} emission - Actual emissions in kg
         * @param {number} baselineEmission - Baseline emissions to compare against (e.g., car)
         * @returns {Object} Object containing saved amount and percentage
         */
        calculateSavings: function(emission, baselineEmission) {
            // Validate inputs
            if (typeof emission !== 'number' || typeof baselineEmission !== 'number') {
                throw new Error("Both emission and baselineEmission must be numbers");
            }
            
            if (baselineEmission <= 0) {
                return {
                    savedKg: 0,
                    percentage: 0
                };
            }
            
            // Calculate absolute savings in kg
            const savedKg = Math.max(0, baselineEmission - emission);
            
            // Calculate percentage savings
            const percentage = (savedKg / baselineEmission) * 100;
            
            // Round to 2 decimal places for display
            return {
                savedKg: Math.round(savedKg * 100) / 100,
                percentage: Math.round(percentage * 100) / 100
            };
        },
        
        /**
         * Calculate number of carbon credits needed to offset emissions
         * Based on voluntary carbon market standard: 1 credit = 1000kg CO2
         * @param {number} emissionKg - Total emissions in kilograms
         * @returns {number} Number of carbon credits needed, rounded to 4 decimal places
         */
        calculateCarbonCredits: function(emissionKg) {
            if (typeof emissionKg !== 'number' || emissionKg < 0) {
                throw new Error("Emission must be a non-negative number");
            }
            
            // Calculate credits: emissions ÷ 1000 kg per credit
            const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
            
            // Round to 4 decimal places to handle small emissions accurately
            return Math.round(credits * 10000) / 10000;
        },
        
        /**
         * Estimate price range for carbon credits
         * Uses current market price range for voluntary carbon credits
         * @param {number} credits - Number of carbon credits
         * @returns {Object} Price estimates in USD
         */
        estimateCreditPrice: function(credits) {
            if (typeof credits !== 'number' || credits < 0) {
                throw new Error("Credits must be a non-negative number");
            }
            
            // Calculate price range based on market minimum and maximum
            const minPrice = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_USD;
            const maxPrice = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_USD;
            const averagePrice = (minPrice + maxPrice) / 2;
            
            // Round all prices to 2 decimal places
            return {
                min: Math.round(minPrice * 100) / 100,
                max: Math.round(maxPrice * 100) / 100,
                average: Math.round(averagePrice * 100) / 100
            };
        },
        
        /**
         * Format a number for display with appropriate units
         * @param {number} value - The value to format
         * @param {string} unit - Unit abbreviation (kg, km, etc.)
         * @returns {string} Formatted string with value and unit
         */
        formatNumber: function(value, unit = '') {
            if (typeof value !== 'number') return 'N/A';
            
            // Round to 2 decimal places for display
            const roundedValue = Math.round(value * 100) / 100;
            
            // Add thousand separators for large numbers
            const formattedValue = roundedValue.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
            
            return unit ? `${formattedValue} ${unit}` : formattedValue;
        }
    };
    
    return calculator;
})();

// Make Calculator available globally
window.Calculator = Calculator;
