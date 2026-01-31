// app.js
// Main application initialization and event handling for CO2 Emission Calculator

(function() {
    'use strict';
    
    /**
     * Wait for DOM to be fully loaded before initializing
     */
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });
    
    /**
     * Main application initialization function
     * Sets up all necessary components and event listeners
     */
    function initializeApp() {
        try {
            // 1. Populate city datalist for autocomplete
            CONFIG.populateDetails();
            
            // 2. Set up automatic distance calculation
            CONFIG.setupDistanceAutofill();
            
            // 3. Get form element and add submit listener
            const form = document.getElementById('calculator-form');
            if (form) {
                form.addEventListener('submit', handleFormSubmit);
                console.log("✅ Form event listener attached");
            } else {
                console.error("❌ Calculator form not found");
                return;
            }
            
            // 4. Log successful initialization
            console.log("✅ CO2 Emission Calculator initialized successfully!");
            
        } catch (error) {
            console.error("❌ Error during initialization:", error);
            alert("Failed to initialize the calculator. Please refresh the page.");
        }
    }
    
    /**
     * Handle form submission and perform emission calculations
     * @param {Event} event - Form submit event
     */
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get the submit button
        const submitButton = event.target.querySelector('button[type="submit"]');
        
        try {
            // 1. Get and validate form values
            const formData = getFormValues();
            
            if (!validateFormData(formData)) {
                return; // Validation failed
            }
            
            // 2. Show loading state
            UI.showLoading(submitButton);
            
            // 3. Hide any previous results
            UI.hideElement('results');
            UI.hideElement('comparison');
            UI.hideElement('carbon-credits');
            
            // 4. Simulate processing delay for better UX
            setTimeout(function() {
                try {
                    performCalculations(formData);
                    UI.hideLoading(submitButton);
                } catch (calcError) {
                    console.error("❌ Calculation error:", calcError);
                    alert("An error occurred during calculation. Please check your inputs and try again.");
                    UI.hideLoading(submitButton);
                }
            }, 1500);
            
        } catch (error) {
            console.error("❌ Form submission error:", error);
            alert("An unexpected error occurred. Please try again.");
            if (submitButton) {
                UI.hideLoading(submitButton);
            }
        }
    }
    
    /**
     * Extract and parse form values from input fields
     * @returns {Object} Form data object
     */
    function getFormValues() {
        return {
            origin: document.getElementById('origin').value.trim(),
            destination: document.getElementById('destination').value.trim(),
            distance: parseFloat(document.getElementById('distance').value),
            transport: getSelectedTransportMode()
        };
    }
    
    /**
     * Get the selected transport mode from radio buttons
     * @returns {string|null} Selected transport mode or null
     */
    function getSelectedTransportMode() {
        const selectedRadio = document.querySelector('input[name="transport"]:checked');
        return selectedRadio ? selectedRadio.value : null;
    }
    
    /**
     * Validate form data before processing
     * @param {Object} formData - Form data object
     * @returns {boolean} True if valid, false otherwise
     */
    function validateFormData(formData) {
        // Check if all required fields are filled
        if (!formData.origin) {
            alert("Please enter an origin city.");
            return false;
        }
        
        if (!formData.destination) {
            alert("Please enter a destination city.");
            return false;
        }
        
        if (isNaN(formData.distance) || formData.distance <= 0) {
            alert("Please enter a valid distance greater than 0 km.");
            return false;
        }
        
        if (!formData.transport) {
            alert("Please select a transport mode.");
            return false;
        }
        
        // Check if origin and destination are the same
        if (formData.origin.toLowerCase() === formData.destination.toLowerCase()) {
            alert("Origin and destination cannot be the same city.");
            return false;
        }
        
        return true;
    }
    
    /**
     * Perform all emission calculations and render results
     * @param {Object} formData - Validated form data
     */
    function performCalculations(formData) {
        // 1. Calculate emissions for selected transport mode
        const selectedEmission = Calculator.calculateEmission(
            formData.distance, 
            formData.transport
        );
        
        // 2. Calculate car emissions as baseline for comparison
        const carEmission = Calculator.calculateEmission(formData.distance, 'car');
        
        // 3. Calculate savings compared to car
        const savings = Calculator.calculateSavings(selectedEmission, carEmission);
        
        // 4. Calculate emissions for all transport modes
        const allModes = Calculator.calculateAllModes(formData.distance);
        
        // 5. Calculate carbon credits needed
        const creditsNeeded = Calculator.calculateCarbonCredits(selectedEmission);
        const creditPrice = Calculator.estimateCreditPrice(creditsNeeded);
        
        // 6. Prepare data objects for rendering
        const resultsData = {
            origin: formData.origin,
            destination: formData.destination,
            distance: formData.distance,
            emission: selectedEmission,
            mode: formData.transport,
            savings: savings
        };
        
        const creditsData = {
            credits: creditsNeeded,
            price: creditPrice
        };
        
        // 7. Render all result sections
        renderResultsSections(resultsData, allModes, creditsData);
        
        // 8. Scroll to results for better user experience
        setTimeout(function() {
            UI.scrollToElement('results');
        }, 100);
    }
    
    /**
     * Render all result sections with calculated data
     * @param {Object} resultsData - Main results data
     * @param {Array} allModes - All transport modes comparison data
     * @param {Object} creditsData - Carbon credits data
     */
    function renderResultsSections(resultsData, allModes, creditsData) {
        try {
            // 1. Render main results section
            const resultsContent = document.getElementById('result-content');
            if (resultsContent) {
                resultsContent.innerHTML = UI.renderResults(resultsData);
                UI.showElement('results');
            }
            
            // 2. Render comparison section
            const comparisonContent = document.getElementById('comparison-content');
            if (comparisonContent) {
                comparisonContent.innerHTML = UI.renderComparison(allModes, resultsData.mode);
                UI.showElement('comparison');
            }
            
            // 3. Render carbon credits section
            const carbonCreditsContent = document.getElementById('carbon-credits-content');
            if (carbonCreditsContent) {
                carbonCreditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
                UI.showElement('carbon-credits');
                
                // Add click handler for compensate button (demo only)
                const compensateButton = document.getElementById('compensate-button');
                if (compensateButton) {
                    compensateButton.addEventListener('click', handleCompensateClick);
                }
            }
            
            console.log("✅ All results rendered successfully");
            
        } catch (renderError) {
            console.error("❌ Error rendering results:", renderError);
            throw new Error("Failed to display calculation results");
        }
    }
    
    /**
     * Handle click on the compensate emissions button (demo functionality)
     * @param {Event} event - Click event
     */
    function handleCompensateClick(event) {
        event.preventDefault();
        
        // In a real application, this would redirect to a payment gateway
        // or open a modal with compensation options
        
        alert("Thank you for your interest in carbon compensation!\n\n" +
              "This is a demo feature. In a real application, this button would " +
              "connect you with certified carbon offset providers.\n\n" +
              "To actually compensate your emissions, visit verified platforms like:\n" +
              "• Gold Standard\n" +
              "• Verra\n" +
              "• Climate Action Reserve");
    }
    
})();
