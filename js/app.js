/**
 * app.js
 * Application initialization and event handling
 * This file wires CONFIG, Calculator, and UI together
 */

document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     INITIALIZATION
  ========================= */

  // Populate city autocomplete datalist
  if (typeof CONFIG !== "undefined" && CONFIG.populateDatalist) {
    CONFIG.populateDatalist();
  }

  // Enable auto distance calculation between cities
  if (typeof CONFIG !== "undefined" && CONFIG.setupDistanceAutofill) {
    CONFIG.setupDistanceAutofill();
  }

  // Get calculator form
  var form = document.getElementById("calculator-form");

  if (!form) {
    console.warn("⚠️ Calculator form not found");
    return;
  }

  // Attach submit handler
  form.addEventListener("submit", handleFormSubmit);

  console.log("✅ Initialized Calculator!");
});

/* =========================
   FORM SUBMIT HANDLER
========================= */

function handleFormSubmit(event) {
  event.preventDefault(); // Prevent page reload

  /* ---- Get form values ---- */

  var originInput = document.getElementById("origin");
  var destinationInput = document.getElementById("destination");
  var distanceInput = document.getElementById("distance");

  var selectedModeInput = document.querySelector(
    'input[name="transport"]:checked'
  );

  var origin = originInput ? originInput.value.trim() : "";
  var destination = destinationInput ? destinationInput.value.trim() : "";
  var distanceKm = distanceInput ? parseFloat(distanceInput.value) : NaN;
  var transportMode = selectedModeInput ? selectedModeInput.value : "";

  /* ---- Validation ---- */

  if (!origin || !destination || !distanceKm || !transportMode) {
    alert("Please fill in all fields before calculating.");
    return;
  }

  if (distanceKm <= 0 || isNaN(distanceKm)) {
    alert("Distance must be greater than 0.");
    return;
  }

  /* ---- Loading state ---- */

  var submitButton = event.target.querySelector('button[type="submit"]');
  if (submitButton) {
    UI.showLoading(submitButton);
  }

  // Hide previous results (if any)
  UI.hideElement("results");
  UI.hideElement("comparison");
  UI.hideElement("carbon-credits");

  /* =========================
     SIMULATED PROCESSING
  ========================= */

  setTimeout(function () {
    try {
      /* ---- Core calculations ---- */

      // Emission for selected transport mode
      var emission = Calculator.calculateEmission(
        distanceKm,
        transportMode
      );

      // Baseline car emission
      var carEmission = Calculator.calculateEmission(distanceKm, "car");

      // Savings compared to car
      var savings = Calculator.calculateSavingd(
        emission,
        carEmission
      );

      // Comparison across all transport modes
      var allModesComparison =
        Calculator.calculateAllModes(distanceKm);

      // Carbon credits needed
      var credits =
        Calculator.calculateCarbonCredits(emission);

      // Estimated price range
      var creditPrice =
        Calculator.estimatedCreditPrice(credits);

      /* ---- Build render data ---- */

      var resultsData = {
        origin: origin,
        destination: destination,
        distance: distanceKm,
        emission: emission,
        mode: transportMode,
        savings: savings
      };

      var creditsData = {
        credits: credits,
        price: creditPrice
      };

      /* ---- Render UI ---- */

      var resultsContainer =
        document.getElementById("results-content");
      var comparisonContainer =
        document.getElementById("comparison-content");
      var creditsContainer =
        document.getElementById("carbon-credits-content");

      if (resultsContainer) {
        resultsContainer.innerHTML =
          UI.renderResults(resultsData);
      }

      if (comparisonContainer) {
        comparisonContainer.innerHTML =
          UI.renderComparison(allModesComparison, transportMode);
      }

      if (creditsContainer) {
        creditsContainer.innerHTML =
          UI.renderCarbonCredits(creditsData);
      }

      // Show sections
      UI.showElement("results");
      UI.showElement("comparison");
      UI.showElement("carbon-credits");

      // Scroll to results
      UI.scrollToElement("results");
    } catch (error) {
      console.error("❌ Calculation error:", error);
      alert(
        "Something went wrong while calculating emissions. Please try again."
      );
    } finally {
      // Restore button state
      if (submitButton) {
        UI.hideLoading(submitButton);
      }
    }
  }, 1500); // Simulated delay
}
