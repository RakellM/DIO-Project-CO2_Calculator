/**
 * UI
 * --
 * Global object responsible for:
 * - Formatting values for display
 * - Showing / hiding UI sections
 * - Rendering HTML for results, comparisons and carbon credits
 * - Handling loading states
 */

var UI = {
  /* =========================
     UTILITY METHODS
  ========================= */

  /**
   * Format a number with fixed decimals and thousand separators
   *
   * @param {number} number
   * @param {number} decimals
   * @returns {string}
   */
  formatNumber: function (number, decimals) {
    if (isNaN(number)) return "0";

    return Number(number)
      .toFixed(decimals)
      .toLocaleString("en-US");
  },

  /**
   * Format a number as USD currency
   *
   * @param {number} value
   * @returns {string} e.g. "US$ 1,234.56"
   */
  formatCurrency: function (value) {
    if (isNaN(value)) return "US$ 0.00";

    return (
      "US$ " +
      Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  },

  /**
   * Show an element by removing the 'hidden' class
   */
  showElement: function (elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.remove("hidden");
  },

  /**
   * Hide an element by adding the 'hidden' class
   */
  hideElement: function (elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.add("hidden");
  },

  /**
   * Smoothly scroll to a specific element
   */
  scrollToElement: function (elementId) {
    var el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  /* =========================
     RENDERING METHODS
  ========================= */

  /**
   * Render main calculation results
   *
   * Structure:
   * - Route card (origin → destination)
   * - Distance card
   * - Emission card
   * - Transport mode card
   */
  renderResults: function (data) {
    var modeMeta = CONFIG.TRANSPORT_MODES[data.mode];

    return `
      <div class="results__grid">

        <div class="results_card results_card--route">
          <div class="results_card__title">Route</div>
          <div class="results_card__value">
            ${data.origin} → ${data.destination}
          </div>
        </div>

        <div class="results_card results_card--distance">
          <div class="results_card__title">Distance</div>
          <div class="results_card__value">
            ${this.formatNumber(data.distance, 0)} km
          </div>
        </div>

        <div class="results_card results_card--emission">
          <div class="results_card__title">CO₂ Emission</div>
          <div class="results_card__value">
            🌿 ${this.formatNumber(data.emission, 2)} kg
          </div>
        </div>

        <div class="results_card results_card--transport">
          <div class="results_card__title">Transport Mode</div>
          <div class="results_card__value">
            ${modeMeta.icon} ${modeMeta.label}
          </div>
        </div>

      </div>
    `;
  },

  /**
   * Render comparison between transport modes
   *
   * Includes:
   * - Emission values
   * - Percentage vs car
   * - Progress bar normalized by max emission
   */
  renderComparison: function (modesArray, selectedMode) {
    var maxEmission = Math.max.apply(
      null,
      modesArray.map(function (m) {
        return m.emission;
      })
    );

    var html = `<div class="comparison__list">`;

    modesArray.forEach(function (item) {
      var meta = CONFIG.TRANSPORT_MODES[item.mode];
      var isSelected = item.mode === selectedMode;
      var width = maxEmission > 0 ? (item.emission / maxEmission) * 100 : 0;

      var barColor = "green";
      if (item.percentageVsCar > 25 && item.percentageVsCar <= 75) barColor = "yellow";
      if (item.percentageVsCar > 75 && item.percentageVsCar <= 100) barColor = "orange";
      if (item.percentageVsCar > 100) barColor = "red";

      html += `
        <div class="comparison_item ${isSelected ? "comparison_item--selected" : ""}">
          
          <div class="comparison_item__header">
            <span>${meta.icon} ${meta.label}</span>
            ${isSelected ? `<span class="comparison_item__badge">Selected</span>` : ""}
          </div>

          <div class="comparison_item__stats">
            <div>${UI.formatNumber(item.emission, 2)} kg CO₂</div>
            <div>${item.percentageVsCar}% vs Car</div>
          </div>

          <div class="comparison_item__bar">
            <div
              class="comparison_item__bar-fill comparison_item__bar-fill--${barColor}"
              style="width: ${width}%"
            ></div>
          </div>

        </div>
      `;
    });

    html += `
      </div>

      <div class="comparison__tip">
        💡 Tip: Choosing lower-emission transport modes can significantly
        reduce your carbon footprint.
      </div>
    `;

    return html;
  },

  /**
   * Render carbon credits section
   *
   * Structure:
   * - Credits required card
   * - Estimated price card
   * - Info box
   * - CTA button
   */
  renderCarbonCredits: function (creditsData) {
    return `
      <div class="carbon-credits__grid">

        <div class="carbon-credits__card">
          <div class="carbon-credits__title">Credits Needed</div>
          <div class="carbon-credits__value">
            ${this.formatNumber(creditsData.credits, 4)}
          </div>
          <div class="carbon-credits__helper">
            1 credit = 1000 kg CO₂
          </div>
        </div>

        <div class="carbon-credits__card">
          <div class="carbon-credits__title">Estimated Price</div>
          <div class="carbon-credits__value">
            ${this.formatCurrency(creditsData.price.average)}
          </div>
          <div class="carbon-credits__helper">
            Range: ${this.formatCurrency(creditsData.price.min)}
            – ${this.formatCurrency(creditsData.price.max)}
          </div>
        </div>

      </div>

      <div class="carbon-credits__info">
        Carbon credits fund projects that reduce or remove greenhouse gases
        from the atmosphere, helping offset unavoidable emissions.
      </div>

      <button class="carbon-credits__button">
        🛒 Compensate Emission
      </button>
    `;
  },

  /* =========================
     LOADING STATE
  ========================= */

  /**
   * Show loading spinner on a button
   */
  showLoading: function (buttonElement) {
    if (!buttonElement) return;

    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML =
      '<span class="spinner"></span> Calculating...';
  },

  /**
   * Restore button after loading
   */
  hideLoading: function (buttonElement) {
    if (!buttonElement) return;

    buttonElement.disabled = false;
    buttonElement.innerHTML = buttonElement.dataset.originalText;
  }
};
