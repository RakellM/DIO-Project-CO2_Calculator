// ui.js
// User interface rendering and utility functions for CO2 Emission Calculator

const UI = (function() {
    'use strict';
    
    /**
     * Global UI object containing rendering and utility methods
     * @namespace UI
     */
    const ui = {
        
        /* ========== UTILITY METHODS ========== */
        
        /**
         * Format a number with thousand separators and decimal places
         * @param {number} number - The number to format
         * @param {number} decimals - Number of decimal places (default: 2)
         * @returns {string} Formatted number string
         */
        formatNumber: function(number, decimals = 2) {
            if (typeof number !== 'number' || isNaN(number)) {
                return 'N/A';
            }
            
            // Handle very small numbers
            if (number === 0) return '0';
            
            // Use fixed decimals
            const fixedNumber = Math.abs(number) < 0.01 && number !== 0 
                ? number.toExponential(2) 
                : number.toFixed(decimals);
            
            // Add thousand separators
            const parts = fixedNumber.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            
            return parts.join('.');
        },
        
        /**
         * Format a value as US currency
         * @param {number} value - The monetary value
         * @returns {string} Formatted currency string
         */
        formatCurrency: function(value) {
            if (typeof value !== 'number' || isNaN(value)) {
                return 'US$ N/A';
            }
            
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        },
        
        /**
         * Show an element by removing the 'hidden' class
         * @param {string} elementId - ID of the element to show
         */
        showElement: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.remove('hidden');
            }
        },
        
        /**
         * Hide an element by adding the 'hidden' class
         * @param {string} elementId - ID of the element to hide
         */
        hideElement: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.add('hidden');
            }
        },
        
        /**
         * Smoothly scroll to an element
         * @param {string} elementId - ID of the element to scroll to
         */
        scrollToElement: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        },
        
        /* ========== RENDERING METHODS ========== */
        
        /**
         * Render the main emission results
         * @param {Object} data - Calculation results data
         * @param {string} data.origin - Origin city
         * @param {string} data.destination - Destination city
         * @param {number} data.distance - Distance in km
         * @param {number} data.emission - CO2 emissions in kg
         * @param {string} data.mode - Transport mode key
         * @param {Object} data.savings - Savings object from Calculator.calculateSavings()
         * @returns {string} HTML string for results section
         */
        renderResults: function(data) {
            // Get transport mode metadata
            const modeInfo = CONFIG.TRANSPORT_MODES[data.mode];
            
            // Format numbers for display
            const formattedDistance = this.formatNumber(data.distance, 0);
            const formattedEmission = this.formatNumber(data.emission, 2);
            const formattedSavings = data.savings.savedKg > 0 
                ? this.formatNumber(data.savings.savedKg, 2) 
                : '0';
            
            return `
                <div class="results__grid">
                    <!-- Route Card -->
                    <div class="results__card results__card--route">
                        <div class="results__card-header">
                            <span class="results__card-icon">📍</span>
                            <h3 class="results__card-title">Route</h3>
                        </div>
                        <div class="results__card-content">
                            <p class="results__route">
                                <span class="results__city">${data.origin}</span>
                                <span class="results__arrow">→</span>
                                <span class="results__city">${data.destination}</span>
                            </p>
                            <p class="results__route-distance">${formattedDistance} km journey</p>
                        </div>
                    </div>
                    
                    <!-- Distance Card -->
                    <div class="results__card results__card--distance">
                        <div class="results__card-header">
                            <span class="results__card-icon">📏</span>
                            <h3 class="results__card-title">Distance</h3>
                        </div>
                        <div class="results__card-content">
                            <p class="results__distance-value">${formattedDistance} <span class="results__unit">km</span></p>
                            <p class="results__distance-label">Total journey distance</p>
                        </div>
                    </div>
                    
                    <!-- Emission Card -->
                    <div class="results__card results__card--emission">
                        <div class="results__card-header">
                            <span class="results__card-icon">🌿</span>
                            <h3 class="results__card-title">CO₂ Emissions</h3>
                        </div>
                        <div class="results__card-content">
                            <p class="results__emission-value">${formattedEmission} <span class="results__unit">kg</span></p>
                            <p class="results__emission-label">Carbon dioxide equivalent</p>
                            ${data.savings.savedKg > 0 ? `
                                <div class="results__savings">
                                    <span class="results__savings-icon">✅</span>
                                    <span class="results__savings-text">
                                        Saved ${formattedSavings} kg vs car (${data.savings.percentage}%)
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Transport Card -->
                    <div class="results__card results__card--transport" style="border-color: ${modeInfo.color}">
                        <div class="results__card-header">
                            <span class="results__card-icon">${modeInfo.icon}</span>
                            <h3 class="results__card-title">Transport</h3>
                        </div>
                        <div class="results__card-content">
                            <p class="results__transport-mode">${modeInfo.label}</p>
                            <p class="results__transport-impact">
                                ${data.mode === 'bicycle' ? 'Zero-emission transport' : 
                                  data.mode === 'car' ? 'Standard passenger vehicle' :
                                  data.mode === 'bus' ? 'Shared public transport' :
                                  'Commercial freight transport'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Render comparison of all transport modes
         * @param {Array} modesArray - Array of mode data from Calculator.calculateAllModes()
         * @param {string} selectedMode - Currently selected transport mode key
         * @returns {string} HTML string for comparison section
         */
        renderComparison: function(modesArray, selectedMode) {
            // Find maximum emission for progress bar scaling
            const maxEmission = Math.max(...modesArray.map(m => m.emission));
            
            // Generate HTML for each transport mode
            const modesHTML = modesArray.map(mode => {
                const isSelected = mode.mode === selectedMode;
                const percentageOfMax = maxEmission > 0 ? (mode.emission / maxEmission) * 100 : 0;
                
                // Determine progress bar color based on percentage
                let barColorClass = '';
                if (mode.emission === 0) {
                    barColorClass = 'comparison__bar--green';
                } else if (percentageOfMax <= 25) {
                    barColorClass = 'comparison__bar--green';
                } else if (percentageOfMax <= 75) {
                    barColorClass = 'comparison__bar--yellow';
                } else if (percentageOfMax <= 100) {
                    barColorClass = 'comparison__bar--orange';
                } else {
                    barColorClass = 'comparison__bar--red';
                }
                
                return `
                    <div class="comparison__item ${isSelected ? 'comparison__item--selected' : ''}" 
                         style="border-color: ${mode.color}">
                        ${isSelected ? `
                            <div class="comparison__badge">
                                Selected
                            </div>
                        ` : ''}
                        
                        <div class="comparison__header">
                            <div class="comparison__mode">
                                <span class="comparison__icon">${mode.icon}</span>
                                <span class="comparison__label">${mode.label}</span>
                            </div>
                            <div class="comparison__stats">
                                <span class="comparison__emission">${this.formatNumber(mode.emission, 2)} kg</span>
                                <span class="comparison__percentage">${mode.percentageVsCar}% vs car</span>
                            </div>
                        </div>
                        
                        <div class="comparison__bar-container">
                            <div class="comparison__bar ${barColorClass}" 
                                 style="width: ${percentageOfMax}%">
                                <span class="comparison__bar-label">
                                    ${mode.emission === 0 ? 'Zero emissions' : ''}
                                </span>
                            </div>
                        </div>
                        
                        <div class="comparison__footer">
                            ${mode.emission === 0 ? `
                                <span class="comparison__tip">🏆 Zero emissions!</span>
                            ` : mode.mode === selectedMode ? `
                                <span class="comparison__tip">📊 Your selection</span>
                            ` : `
                                <span class="comparison__tip">
                                    ${mode.percentageVsCar === 100 ? 'Baseline' : 
                                      mode.percentageVsCar < 100 ? `Saves ${100 - mode.percentageVsCar}% vs car` :
                                      `${mode.percentageVsCar - 100}% more than car`}
                                </span>
                            `}
                        </div>
                    </div>
                `;
            }).join('');
            
            return `
                <div class="comparison__grid">
                    ${modesHTML}
                </div>
                
                <div class="comparison__tip-box">
                    <div class="comparison__tip-header">
                        <span class="comparison__tip-icon">💡</span>
                        <h4 class="comparison__tip-title">Did You Know?</h4>
                    </div>
                    <p class="comparison__tip-text">
                        Choosing public transport or active mobility (walking, cycling) 
                        can reduce your carbon footprint by up to 95% compared to driving alone. 
                        Every small change contributes to a greener planet!
                    </p>
                </div>
            `;
        },
        
        /**
         * Render carbon credits information
         * @param {Object} creditsData - Carbon credits calculation results
         * @param {number} creditsData.credits - Number of credits needed
         * @param {Object} creditsData.price - Price estimates {min, max, average}
         * @returns {string} HTML string for carbon credits section
         */
        renderCarbonCredits: function(creditsData) {
            // Format numbers for display
            const formattedCredits = this.formatNumber(creditsData.credits, 4);
            const formattedMin = this.formatCurrency(creditsData.price.min);
            const formattedMax = this.formatCurrency(creditsData.price.max);
            const formattedAvg = this.formatCurrency(creditsData.price.average);
            
            return `
                <div class="carbon-credits__grid">
                    <!-- Credits Needed Card -->
                    <div class="carbon-credits__card carbon-credits__card--credits">
                        <div class="carbon-credits__card-header">
                            <span class="carbon-credits__card-icon">🌳</span>
                            <h3 class="carbon-credits__card-title">Credits Needed</h3>
                        </div>
                        <div class="carbon-credits__card-content">
                            <p class="carbon-credits__value">${formattedCredits}</p>
                            <p class="carbon-credits__label">Carbon Credits</p>
                            <p class="carbon-credits__helper">
                                1 credit = ${CONFIG.CARBON_CREDIT.KG_PER_CREDIT.toLocaleString()} kg CO₂
                            </p>
                        </div>
                    </div>
                    
                    <!-- Price Estimate Card -->
                    <div class="carbon-credits__card carbon-credits__card--price">
                        <div class="carbon-credits__card-header">
                            <span class="carbon-credits__card-icon">💰</span>
                            <h3 class="carbon-credits__card-title">Estimated Cost</h3>
                        </div>
                        <div class="carbon-credits__card-content">
                            <p class="carbon-credits__value">${formattedAvg}</p>
                            <p class="carbon-credits__label">Average Market Price</p>
                            <p class="carbon-credits__range">
                                Range: ${formattedMin} – ${formattedMax}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="carbon-credits__info">
                    <div class="carbon-credits__info-header">
                        <span class="carbon-credits__info-icon">ℹ️</span>
                        <h4 class="carbon-credits__info-title">About Carbon Credits</h4>
                    </div>
                    <p class="carbon-credits__info-text">
                        Carbon credits represent the reduction or removal of one metric ton (1000 kg) 
                        of carbon dioxide from the atmosphere. They fund environmental projects like 
                        reforestation, renewable energy, and conservation efforts. Purchasing credits 
                        helps compensate for emissions you cannot avoid.
                    </p>
                </div>
                
                <button class="carbon-credits__button" id="compensate-button">
                    <span class="carbon-credits__button-icon">🛒</span>
                    <span class="carbon-credits__button-text">Compensate Emissions</span>
                </button>
                <p class="carbon-credits__disclaimer">
                    Note: This is a demo tool. Actual compensation requires verification through certified providers.
                </p>
            `;
        },
        
        /* ========== LOADING STATES ========== */
        
        /**
         * Show loading state on a button
         * @param {HTMLElement} buttonElement - The button element to show loading on
         */
        showLoading: function(buttonElement) {
            if (!buttonElement) return;
            
            // Save original text
            buttonElement.dataset.originalText = buttonElement.innerHTML;
            
            // Disable button and change content
            buttonElement.disabled = true;
            buttonElement.innerHTML = `
                <span class="spinner"></span>
                <span class="button__loading-text">Calculating...</span>
            `;
        },
        
        /**
         * Hide loading state on a button
         * @param {HTMLElement} buttonElement - The button element to restore
         */
        hideLoading: function(buttonElement) {
            if (!buttonElement) return;
            
            // Enable button and restore content
            buttonElement.disabled = false;
            if (buttonElement.dataset.originalText) {
                buttonElement.innerHTML = buttonElement.dataset.originalText;
            }
        }
    };
    
    return ui;
})();

// Make UI available globally
window.UI = UI;
